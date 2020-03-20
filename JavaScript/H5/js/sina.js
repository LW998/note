let headerRender = (function () {
    let $headerBox = $('.headerBox'),
        $navMenu = $headerBox.find('.navMenu'),
        $navBox = $('.navBox');

    function handleTap() {
        // $navBox.stop().slideToggle(200); jq中显示影藏的方法，这zepto中没有
        let block = $navBox.css('display');
        if (block === 'none') {
            $navBox.css('display', 'block')
        } else {
            $navBox.css('display', 'none');
        }
    }
    return {
        init() {
            $navMenu.tap(handleTap);
        }
    }
})();
headerRender.init();

let bannerRender = (function () {
    let $bannerBox = $('.bannerBox'),
        $wrapper = $bannerBox.find('.swiper-wrapper');

    function queryData() {
        return new Promise(resolve => {
            $.ajax({
                url: 'json/banner.json',
                dataType: 'json',
                success: resolve
            })
        })
    }

    function bindHtml(result) {
        let str = ``;
        result.forEach(item => {
            let {
                img,
                desc
            } = item;
            str += `<div class="swiper-slide">
            <img src="${img}" alt="">
            <p>${desc}</p>
        </div>`
        })
        $wrapper.html(str);
        $bannerBox.css('display', 'block');
    }

    function swiperInit() {
        let swiper = new Swiper('.bannerBox', {
            loop: true,
            autoplay: 3000,
            autoplayDisableOnInteraction: false,
            pagination: '.swiper-pagination',
            paginationType: 'fraction',
        })
    }
    return {
        init() {
            let promise = queryData();
            promise.then(bindHtml).then(
                swiperInit
            );

        }
    }
})();
bannerRender.init();

let messageRender = (function () {
    let $messageBox = $('.messageBox'),
        $wrapper = $messageBox.find('.swiper-wrapper');

    function queryData() {
        return new Promise(resolve => {
            $.ajax({
                url: 'json/aside.json',
                dataType: 'json',
                success: resolve
            })
        })
    }

    function bindHtml(result) {
        let str = ``;
        result.forEach(item => {
            let {
                title,
                link
            } = item;
            str += `<div class="swiper-slide">
            <a href="${link}">${title}</a>
        </div>`
        })
        $wrapper.html(str);
        $messageBox.css('display', 'block');
    }

    function swiperInit() {
        let swiper = new Swiper('.messageCon', {
            loop: true,
            autoplay: 3000,
            direction: 'vertical'
        })
    }
    return {
        init() {
            let promise = queryData();
            promise.then(bindHtml).then(
                swiperInit
            );

        }
    }
})();
messageRender.init();