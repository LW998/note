let shopModel = (function ($) {
    let $navList = $('.navbar-nav li'),
        $cardBox = $('.card-deck'),
        $cardList = null,
        _DATA = null;

    function getData() {
        $.ajax({
            url: 'json/shop.json',
            method: 'GET',
            async: false,
            success: result => {
                _DATA = JSON.parse(result);
            }
        });

        // //1.创建ajax实例
        // let xhr = new XMLHttpRequest();
        // //2.打开请求的地址,参数（请求方式，地址，同步：false 或者 异步：true）
        // xhr.open('GET', 'json/shop.json', false);
        // //3
        // xhr.onreadystatechange = () => {
        //     if (xhr.readyState === 4 && xhr.status === 200) {
        //         _DATA = xhr.responseText;
        //     }
        // };
        // xhr.send(null);
        // console.log(_DATA);
    };

    function BindData() {
        if (!_DATA) return;
        let HTML = ``;
        $.each(_DATA, (index, item) => {
            let {
                title,
                img,
                price,
                hot,
                time
            } = item;
            HTML += `<div class="card" time="${time}" price="${price}" hot="${hot}">
            <img class="card-img-top" src="${img}">
            <div class="card-body">
                <h6 class="card-title">
                    ${title}
                </h6>
                <p class="card-text">价格: ￥${price}</p>
                <p class="card-text">好评: ${hot}</p>
                <p class="card-text"><small class="text-muted">上架时间：${time}</small></p>
            </div>
        </div>`
        });
        $cardBox.html(HTML);
        $cardList = $cardBox.children('.card');

    }

    function sortData() {
        $navList.attr('_type', -1);
        $navList.on('click', function () {
            let $this = $(this),
                _sort = $this.attr('sort');
            $this.attr('_type', $this.attr('_type') * -1).siblings().attr('_type', -1);
            $cardList.sort((A, B) => {
                let $A = $(A),
                    $B = $(B);
                $A = $A.attr(_sort);
                $B = $B.attr(_sort);
                _sort === "time" ? ($A = $A.replace(/-/g, ""), $B = $B.replace(/-/g, "")) : null;
                return ($A - $B) * $this.attr('_type');
            })
            $cardList.each((index, item) => $cardBox.append(item));

        })
    }
    return {
        init() { //init:function(){}
            getData();
            BindData();
            sortData();
        }
    }
})(jQuery);

shopModel.init();