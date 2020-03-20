~ function () {
    let utils = function () {
        //获取CSS
        let getCss = (ele, attr) => {
            let val = null,
                //检测带单位的属性值
                reg = /^-?\d+(\.\d+)?(px|rem|em)?$/;
            if ('getComputedStyle' in window) {
                val = window.getComputedStyle(ele)[attr];
                //获取的属性值带单位
                if (reg.test(val)) {
                    //去除单位
                    val = parseFloat(val);
                }
            }
            return val;

        }
        //设置CSS
        let setCss = (ele, attr, value) => {
            //判断需要设置的值是否有效
            if (!isNaN(value)) {
                //如果要设置的属性非opacity或者zIndex就加上px
                if (!/^(opacity|zIndex)$/.test(attr)) {
                    value += 'px';
                }
            }
            //设置对应的属性
            // box.style.top = curT;
            ele['style'][attr] = value;
        }
        //批量设置CSS
        let setGroupCss = (ele, options) => {
            //循环传入的对象
            for (let attr in options) {
                if (!options.hasOwnProperty) break;
                //把对象中的值取出，分别设置进元素
                setCss(ele, attr, options[attr]);
            }
        }
        //css整合
        let css = (...arg) => {
            let len = arg.length,
                //默认getCss
                fn = getCss;
            //三个参数setCss
            if (len >= 3) {
                fn = setCss;
            }
            //如果第二个参数是对象，执行setGroupCss
            if (len === 2 && typeof arg[1] === 'object') {
                fn = setGroupCss;
            }
            return fn(...arg);
        }
        return {
            css
        };
    }();
    //公式
    let Effect = {
        Linear: (t, d, c, b) => {
            //console.log('time:' + t + 'duration:' + d + 'change:' + c + 'begin:' + b);
            return t / d * c + b
        }
    }
    window.utils = utils;
    //动画方法
    window.animate = function (ele, target = {}, duration = 1000, callback = Function.prototype) {
        let begin = {},
            change = {},
            time = 0;
        if (typeof duration === 'function') {
            callback = duration;
            duration = 1000;
        }
        //循环target设置begin和change
        for (let attr in target) {
            if (!target.hasOwnProperty(attr)) break;
            begin[attr] = utils.css(ele, attr);
            change[attr] = target[attr] - begin[attr];
        }
        //在给当前元素设置新的动画之前先把原来的动画清除掉(防止多动画共存,把动画的返回值赋值给当前元素的自定义属性，
        //这样不管什么时候在哪执行都可以清除元素的动画)
        clearInterval(ele.animateTimer);
        ele.animateTimer = setInterval(() => {
            time += 17;
            //边界判断
            if (time >= duration) {
                //设置元素属性为目标值
                utils.css(ele, target);
                clearInterval(ele.animateTimer);
                //动画完成后执行回调函数callback,并且让元素中的this改为当前元素本身
                callback.call(ele)
                return;
            }
            let cur = {};
            //循环target利用公式获取当前元素位置存入cur
            for (let attr in target) {
                if (!target.hasOwnProperty(attr)) break;
                cur[attr] = Effect.Linear(time, duration, change[attr], begin[attr]);
            }
            ///设置元素属性为当前应该在的位置
            utils.css(ele, cur);
        }, 17)
    }
}();