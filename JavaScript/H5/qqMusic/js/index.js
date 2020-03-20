let musicRender = (function () {
    let $headerBox = $('.headerBox'),
        $contentBox = $('.contentBox'),
        $footerBox = $('.footerBox'),
        $wrapper = $contentBox.find('.wrapper'),
        $lyricList = null,
        musicAudio = $('#musicAudio')[0],
        $playBtn = $headerBox.find('.playBtn'),
        $already = $footerBox.find('.already'),
        $duration = $footerBox.find('.duration'),
        $current = $footerBox.find('.current'),
        conH = computedContent();

    function computedContent() {
        let winH = document.documentElement.clientHeight,
            font = parseFloat(document.documentElement.style.fontSize);
        $contentBox.css({
            height: winH - $headerBox[0].offsetHeight - $footerBox[0].offsetHeight - 0.8 * font
        });
        return parseFloat($contentBox.css('height'));
    }


    //获取歌词
    function queryLyric() {
        return new Promise(resolve => {
            $.ajax({
                url: 'json/lyric2.json',
                // method 默认GET 
                // method: 'get',
                dataType: 'json',
                // async 默认 true
                // async: true,
                success: resolve
            })
        })
    }
    //绑定歌词
    function bindHtml(lyricAry) {
        let str = ``;
        lyricAry.forEach(item => {
            let {
                min,
                sec,
                mill,
                con
            } = item;
            str += `<p data-min="${min}" data-sec="${sec}" data-mill="${mill}">${con}</p>`;
        });
        $wrapper.html(str);
        $lyricList = $wrapper.find('p');
    }

    let $plan = $.Callbacks();
    let autoTimer = null;


    function playRun() {

        $playBtn.tap(() => {
            //是否为暂停状态
            if (musicAudio.paused) {
                musicAudio.play();
                $playBtn.addClass('move');
                return;
            }
            musicAudio.pause();
            $playBtn.removeClass('move');
        })
        musicAudio.addEventListener('canplay', $plan.fire);
    }

    //控制进度条
    $plan.add(() => {
        let duration = musicAudio.duration; //=>获取的总时间是秒
        $duration.html(computedTime(duration));
        //随时监听播放状态
        autoTimer = setInterval(() => {
            let curTime = musicAudio.currentTime;
            if (curTime >= duration) {
                //播放完成
                clearInterval(autoTimer);
                $already.html(computedTime(curTime));
                $current.css('width', '100%');
                musicAudio.pause();
                $playBtn.removeClass('move');
                return;
            }
            //正在播放中
            matchLyric(curTime);
            $already.html(computedTime(curTime));
            $current.css('width', curTime / duration * 100 + '%');
        }, 5);
    })


    let translateY = 0;

    function matchLyric(curTime) {
        let [min, sec, mill] = computedCurTime(curTime).split(':');
        //在歌词集合中筛选当前想要的
        let $cur = $lyricList.filter(`[data-min="${min}"]`).filter(`[data-sec="${sec}"]`).filter(`[data-mill="${mill}"]`);
        if ($cur.length === 0) return;
        if ($cur.hasClass('active')) return;
        $cur.addClass('active').siblings().removeClass('active');
        let curH = $cur[0].offsetHeight + $cur[0].offsetTop;
        if (curH >= (conH * 0.6)) {
            let moveH = $cur[0].offsetHeight;
            translateY -= moveH;
            $wrapper.css('transform', `translateY(${translateY}px)`)
        }
    }


    //计算时间
    function computedCurTime(time) {
        let min = Math.floor(time / 60),
            sec = Math.floor(time - min * 60);
        mill = time.toFixed(2).toString().replace(/\d+\.(\d+)/, "$1");
        min < 10 ? min = '0' + min : min;
        sec < 10 ? sec = '0' + sec : sec;
        return `${min}:${sec}:${mill}`;
    }

    function computedTime(time) {
        let min = Math.floor(time / 60),
            sec = Math.floor(time - min * 60);
        // console.log(time.getMilliseconds());
        min < 10 ? min = '0' + min : min;
        sec < 10 ? sec = '0' + sec : sec;
        return `${min}:${sec}`;
    }
    return {
        init() {
            computedContent();
            window.addEventListener('resize', computedContent);
            let promise = queryLyric();
            promise.then(result => {
                let {
                    lyric = ''
                } = result;
                //去掉歌词中的特殊符号
                obj = {
                    32: ' ',
                    40: '(',
                    41: ')',
                    45: '-'
                };
                lyric = lyric.replace(/&#(\d+);/g, (...[item, num]) => item = obj[num] || item);
                return lyric;
            }).then(lyric => {
                //把歌词对应的分钟、秒、歌词内容等信息依次存储
                //向歌词末尾手动添加结束符
                // lyric += '&#10;';
                let lyricAry = [],
                    reg = /\[(\d+)&#58;(\d+)&#46;(\d+)\]([^&#]+)(&#10;)?/g;
                lyric.replace(reg, (...[, min, sec, mill, con]) => {
                    lyricAry.push({
                        min,
                        sec,
                        mill,
                        con,
                    });
                });
                return lyricAry;
            }).then(bindHtml).then(playRun);
        }
    }
})();
musicRender.init();