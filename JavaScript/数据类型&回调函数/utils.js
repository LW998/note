/*
 *throttle：函数的节流
 * 参数：
 * func: 等待时间间隔后执行的函数
 * wait：等待的时间间隔
 * 返回值：
 * 返回可被调用的函数
 */
function throttle(func, wait) {
    let timer = null,
        result = null,
        previous = 0;
    return function anonymous(...args) {
        //=>windows.onscroll触发的时候执行的是anonymous(约16.7MS触发一次)
        let context = this,
            now = new Date,
            spanTime = wait - (now - previous);
        if (spanTime <= 0) {
            //=>上一次距离本次触发的间隔时间超过等待时间，我们立即执行函数
            result = func.call(context, ...args);
            clearTimeout(timer);
            timer = null;
            previous = now;
        } else if (!timer) {
            timer = setTimeout(() => {
                result = func.call(context, ...args);
                timer = null;
                previous = new Date;
            }, spanTime);
        }
        return result;
    }
}

/*函数的防抖*/
function debounce(func, wait) {
    let timer = null,
        result = null;
    return function anonymous(...args) {
        let context = this;
        clearTimeout(timer);
        timer = setTimeout(() => {
            result = func.call(context, ...args);
            timer = null;
        }, wait);
        return result;
    }
}


/*
*_each:遍历数组、类数组、对象中的每一项
* 参数：
*      obj:需要迭代的数组、类数组、普通对象
*      callback:回调函数(每遍历数组中的一项就把回调函数执行一次，
而且把当前遍历的内容和索引[属性值和属性名]传递给回调函数;接收回调函数的返回值，
如果是false，则结束当前循环，如果是其他值，让返回值替换成数组的当前项，如果没有返回值则什么都不处理...)
*      context：传递的第三个参数，可以改变this的指向，不传递默认是Window
*  返回值：
*返回一个新的数组或对象(原来的数组不改变)
*/
function _each(obj, callback, context = window) {
    //判断是否为数组或者类数组
    let isLikeArray = _type.isArray(obj) || (("length" in obj) && _type.isNumeric(obj.length));
    //判断回调函数类型，如果不是函数类型，让他等于匿名空函数
    typeof callback !== "function" ? callback = Function.prototype : null;

    //数组、类数组处理
    if (isLikeArray) {
        //克隆数组
        let arr = [...obj];
        for (let i = 0; i < arr.length; i++) {
            let item = arr[i],
                //改变this指向传递当前项的值和当前项的索引，接收回调函数返回值。
                res = callback.call(context, item, i);
            //返回值为false退出当前循环
            if (res === false) break;
            //返回值为空跳出当前循环，继续下一轮循环
            if (typeof res === 'undefined') continue;
            //替换当前项
            arr[i] = res;
        }
        //返回替换后的数组
        return arr;
    }
    //对象处理
    let opp = {
        ...obj
    };
    for (key in opp) {
        if (!opp.hasOwnProperty(key)) break;
        let value = opp[key],
            //改变this指向传递当前项的属性值和属性名，接收回调函数返回值。
            res = callback.call(context, value, key);
        //返回值为false退出当前循环
        if (res === false) break;
        //返回值为空跳出当前循环，继续下一轮循环
        if (typeof res === 'undefined') continue;
        //替换当前项
        opp[key] = res;
    }
    return opp;
}

let _type = (function () {
    var _obj = {
        isNumeric: "Number",
        isArray: "Array",
        isBoolean: "Boolean",
        isDate: "Date",
        isFunction: "Function",
        isNull: "Null",
        isUndefined: "Undefined",
        isString: "String",
        isSymbol: "Symbol",
        isPlainObject: "Object",
        isRegExp: "RegExp",
        isWindow: "Window"
    };
    var _toString = _obj.toString,
        _type = {};
    for (var key in _obj) {
        if (!_obj.hasOwnProperty(key)) break;
        _type[key] = (function () {
            var reg = new RegExp("^\\[object " + _obj[key] + "\\]$");
            return function anonymous(val) {
                return reg.test(_toString.call(val));
            }
        })();
    }
    return _type;
})();

~ function () {
    /*
     * formatTime:时间字符串格式化
     *   @params
     *       template:[String] 我们最后希望获取的日期格式
     *       模板规则：{0~5}->年月日时分秒
     *   @return
     *      [String]格式化后的字符串
     */
    function formatTime(template = "{0}年{1}月{2}日 {3}时{4}分{5}秒") {
        let timeAry = this.match(/\d+/g);
        //console.log(timeAry)=>["2019", "12", "23", "16", "06", "05"]
        //取出模板中的数字
        return template.replace(/\{(\d+)\}/g, (...[, $1]) => {
            //console.log($1) //=>0,1,2,3,4,5
            let time = timeAry[$1] || "00";
            /*
            time.length < 2 ? time = '0' + time : null
            return time
            //相当于如下
            */
            return time.length < 2 ? '0' + time : time
        });
    }
    /*
     * queryUrlParameter:获取url的参数信息（可能包括HASH值）
     *   @params
     *   @return
     *      [Object]把所有方式以键值对的方式存储并返回
     */
    function queryUrlParameter() {
        let obj = {};
        decodeURIComponent(this).replace(/\/\/([^?]+)\??/g, (...[, $1]) => obj["address"] = $1);
        decodeURIComponent(this).replace(/([^?=&#]+)=([^?=&#]+)/g, (...[, $1, $2]) => obj[$1] = $2);
        decodeURIComponent(this).replace(/#([^?=&#]+)/g, (...[, $1]) => obj["HASH"] = $1);
        return obj;
    }
    /*
     * millimeter:加千分位符
     *   @params
     *      四舍五入补零后的字符
     *   @return
     *      [String]千分符后的字符串
     */
    function millimeter() {
        return this.replace(/(\d{1,3})(?=(\d{3})+(\.\d{2})?$)/g, content => content + ',')
    }
    //把函数加到String原型上
    ["formatTime", "queryUrlParameter", "millimeter"].forEach(item => {
        String.prototype[item] = eval(item);
    });
}();