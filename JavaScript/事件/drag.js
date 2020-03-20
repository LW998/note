$(function () {
    let $dialogBox = $('.dialogBox'),
        $dialogMark = $('.dialogMark'),
        $title = $dialogBox.find('.title'),
        $closeBtn = $dialogBox.find('i');
    let winW = document.documentElement.clientWidth,
        winH = document.documentElement.clientHeight,
        boxW = $dialogBox[0].offsetWidth,
        boxH = $dialogBox[0].offsetHeight;
    $dialogBox.css({
        top: (winH - boxH) / 2,
        left: (winW - boxW) / 2
    })
    $closeBtn.on('click', function () {
        $dialogBox.stop().fadeOut(200, () => {
            $dialogMark.stop().fadeOut(100);
        });
    })

    //鼠标按下:记录鼠标的起始位置，和盒子的起始位置
    let dragStart = function dragStart(ev) {
        //this :h3
        //把鼠标按下的位置记录在自定义属性中
        /*$(this).attr({ //JQ中设置的自定义属性都是字符串
            starX: ev.clientX,
            starY: ev.clientY,
            //基于JQ中的css获取到的样式属性值都是带单位的
            starL: parseFloat($dialogBox.css('left')),
            starT: parseFloat($dialogBox.css('top')),
        })*/
        //基于普通对象的形式设置自定义属性
        this.starX = ev.clientX;
        this.starY = ev.clientY;
        this.starL = parseFloat($dialogBox.css('left'));
        this.starT = parseFloat($dialogBox.css('top'));

        //setCapture把当前元素和鼠标绑定在一起（不兼容谷歌）
        // this.setCapture();

        //鼠标点下的时候绑定mousemove

        //=>BIND是预先处理THIS
        // console.log(dragMove.bind(this) === dragMove);//=>FALSE:说明执行BIND把方法中的THIS预先进行改变处理，
        //得到的结果和原有的函数是不一样的，也就是此时我们给DOCUMENT绑定的方法就不在是DRAG-MOVE了
        //this
        this.DRAG_MOVE = dragMove.bind(this);
        this.DRAG_END = dragEnd.bind(this);
        $(document).on('mousemove', this.DRAG_MOVE).on('mouseup', this.DRAG_END);
    }
    //鼠标移动
    let dragMove = function dragMove(ev) {
        let {
            starX,
            starY,
            starL,
            starT
        } = this;
        //随时根据鼠标的当前位置，减去鼠标的起始的鼠标位置，计算出鼠标的偏移值，
        //用偏移值加上盒子的起始位置，算出当前盒子的位置
        let curL = ev.clientX - starX + starL,
            curT = ev.clientY - starY + starT;
        let minL = 0,
            minT = 0,
            maxL = winW - boxW,
            maxT = winH - boxH;
        curL = curL < minL ? minL : (curL > maxL ? maxL : curL);
        curT = curT < minT ? minT : (curT > maxT ? maxT : curT);
        $dialogBox.css({
            top: curT,
            left: curL
        })

    }
    //鼠标抬起
    let dragEnd = function dragEnd() {
        //鼠标抬起的时候解除mousemove
        $(document).off('mousemove', this.DRAG_MOVE).off('mouseup', this.DRAG_END);
        //解除鼠标和当前元素的绑定（不兼容谷歌）
        // this.releaseCapture();
    }
    $title.on('mousedown', dragStart);
})
/*
 * 拖拽的一个问题：当鼠标移动过快，盒子需要计算最新的位置，但是计算速度跟不上
 * 鼠标的移动速度，导致鼠标离开了盒子（具体来说离开了H3），而我们的所有方法都是绑定给H3的相关事
 * 件行为的，鼠标不在H3上，不管做什么操作都不会和之前绑定的方法有关
 *   [鼠标不在H3上]
 *     1.鼠标继续移动，盒子也不动了，因为并没有触发H3的MOUSE-MOVE
 *     2.鼠标在H3以外松开，没有触发它的MOUSE-UP，也就是没有执行取消MOUSE-MOVE绑定方法的操作，
 *       此时H3的MOUSE-MOVE还绑定着呢，这样即使你鼠标松开课，我们鼠标重回到H3上，也会触发它的MOVE，让盒子跟着走
 *   ...
 *
 * 解决问题
 *   1.用一根绳子把H3和鼠标拴在一起，这样鼠标就不会离开H3了
 *      this.setCapture() ：把当前元素THIS和鼠标绑在一起
 *      this.releaseCapture()：解绑
 *     [此方法不兼容谷歌浏览器]
 *
 *   2.鼠标移动在快，也不会逃离DOCUMENT，此时我们可以把给document的mousemove绑定方法dragMove
 *  （给document的mouseup绑定方法dragEnd），只要是在文档中移动或者抬起鼠标，都执行对应的操作即可
 */