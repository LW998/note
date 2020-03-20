let filtersModel = (function ($) {
    let _select = [],
        _DATA = [{
                type: 1,
                text: "品牌",
                content: ["苹果", "小米", "华为", "魅族", "锤子", "三星", "OPPO", "VIVO", "乐视", "360", "中兴", "索尼"]
            },
            {
                type: 2,
                text: "尺寸",
                content: ["3.0英寸以下", "3.0-3.9英寸", "4.0-4.5英寸", "5.0-5.5英寸", "5.5-6.0英寸", "6.0英寸以上"]
            },
            {
                type: 3,
                text: "系统",
                content: ["安卓(Android)", "苹果(IOS)", "微软(WindowsPhone)", "无", "其他"]
            },
            {
                type: 4,
                text: "网络",
                content: ["联通3G", "双卡单4G", "双卡双4G", "联通4G", "移动4G", "电信4G", "全网通4G"]
            }
        ],
        $chooseBOX = $('.choose'),
        $typeBox = $('#type');

    function render() {
        //待选择区渲染
        let str = ``;
        _DATA.forEach(item => {
            let {
                type,
                text,
                content
            } = item;
            str += `<li _type="${type}">
            ${text}:
            ${content.map(A => {
                return `<a href="javascript:;">${A}</a>`;
            }).join('')}
        </li>`
        });
        $typeBox.html(str); 
        //选择区
        str = `你的选择：`;
        _select.sort((A, B) => A.type - B.type);
        _select.forEach(item => {
            let {
                type,
                name
            } = item;
            str += `<mark>${name}<a href="javascript:;" _type='${type}'>X</a></mark>`
        });
        $chooseBOX.html(str);
        handler();
        handlerSelect();
    }

    function handler() {
        $typeBox.find('a').click(function () {
            let $this = $(this),
                obj = {};
            obj.type = parseFloat($this.parent().attr('_type'));
            obj.name = $this.text().trim();
            _select.forEach((item, index) => {
                if (item.type === obj.type) {
                    _select.splice(index, 1);
                }
            });
            _select.push(obj);
            render();
        });
    }

    function handlerSelect() {
        $chooseBOX.find('a').click(function () {
            let $this = $(this),
                _type = parseFloat($this.attr('_type'));
            _select.forEach((item, index) => {
                if (item.type === _type) {
                    _select.splice(index, 1);
                }
            });
            render();
        });
    }
    return {
        init() {
            render();
        }
    }
})(jQuery)

filtersModel.init();