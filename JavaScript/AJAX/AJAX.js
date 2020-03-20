~ function () {
    function AJAX(options) {
        return new init(options);
    }

    let init = function init(options = {}) {
        let {
            url,
            method = 'GET',
            data = null,
            dataType = 'JSON',
            async = true,
            cache = true,
            success,
            error
        } = options;
        //挂载到实例上
        ['url', 'method', 'data', 'dataType', 'async', 'cache', 'success', 'error'].forEach(item => {
            this[item] = eval(item);
        });
        this.method = method.toUpperCase();
        this.sendAJAX();
    }

    AJAX.prototype = {
        //原型链重定，需手动把constructor指向当前函数
        constructor: AJAX,
        init,
        //es6新语法 相当于sendAJAX:function sendAJAX(){}
        //发送AJAX请求
        sendAJAX() {
            //发送前处理Data的值，如果不处理就为null
            this.handlerData();
            //发送请求前处理URL
            this.handlerCache();
            let {
                url,
                method,
                async,
                error,
                success,
                data
            } = this;
            let xhr = new XMLHttpRequest();
            xhr.open(method, url, async, data);
            xhr.onreadystatechange = () => {
                console.log(xhr.readyState, xhr.status, )
                //请求失败
                if (!/^[23]\d{2}$/.test(xhr.status)) {
                    error && error(xhr.statusText, xhr);
                    return;
                }
                //请求成功
                if (xhr.readyState === 4) {
                    //处理DataType
                    let result = this.handlerDataType(xhr);
                    success && success(result, xhr);
                }
            };
            xhr.send(data);
        },
        //处理dataType
        handlerDataType(xhr) {
            let {
                dataType
            } = this;
            dataType = dataType.toUpperCase();
            let result = xhr.responseText;
            switch (dataType) {
                case 'TEXT':
                    break;
                case 'JSON':
                    result = JSON.parse(result);
                    break;
                case 'XML':
                    result = xhr.responseXML;
                    break;
            }
            return result;
        },
        //处理cache
        handlerCache() {
            let {
                url,
                method,
                cache
            } = this;
            if (/^get$/i.test(method) && cache === false) {
                url += `${this.checkUrl()}_=${+(new Date())}`;
                this.url = url;
            }
        },
        //检测URL中是否存在问号
        checkUrl() {
            return this.url.indexOf('?') > -1 ? '&' : '?';
        },
        handlerData() {
            //根据请求方式不一样处理不
            let {
                data,
                method,
                url
            } = this;
            //如果data不传不做处理
            if (!data) return;
            if (typeof data === 'object') {
                //如果是个obj对象，转化成urlencoded格式
                let str = ``;
                for (let key in data) {
                    if (data.hasOwnProperty(key)) {
                        str += `${key}=${data[key]}&`;
                    }
                }
                str.length > 0 ? str = str.substring(0, str.length - 1) : null;
                data = str;
            }
            //处理GET系列请求url传参
            if (/^(GET)|(DELETE)|(HEAD)|(TRACE)|(OPTION)&/.test(method)) {
                url += `${this.checkUrl()}${data}`;
                console.log(url);
                this.url = url;
                //由于是url传参不需要data传参
                this.data = null;
            } else {
                console.log(url);
                //post请求
                this.data = data;
            }
        },
    }
    //让执行AJAX返回实例的prototype指向AJAX.prototype，相当于同时创建了AJAX的实例
    init.prototype = AJAX.prototype;
    window.ajax = AJAX;
}(window);