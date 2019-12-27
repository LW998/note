```javascript
let str = "a=123&b=456&c=789";
let ary = str.split('&');
let result = {};
ary.forEach(item => {
    //当前循环这一项 a=123
    let n = item.split('=');
    let key = n[0];
    let val = n[1];
    result[key] = val;
});
console.log(result);//=>{a: "123", b: "456", c: "789"}
```

```javascript
function queryUrlParameter(url) {
    let askIn = url.indexOf('?'),
        wellIn = url.indexOf('#'),
        askText = '',
        wellText = '';
    //#不存在，让#号索引为url最末尾，否则什么都不做
    wellIn === -1 ? wellIn = url.length : null;
    //？存在，从问号索引开始截取到#号索引
    //经过上面的判断无需判断，直接截取到#号，#号不存在截取到末尾
    askIn >= 0 ? askText = url.substring(askIn + 1, wellIn) : null;
    //#号的文本等于#号索引到末尾，不必考虑#好是否为空，为空取初值，截取的也为空
    wellText = url.substring(wellIn + 1);
    //2.获取每一部分的值
    let result = {};
    //如果wellText不为空说明#后面有值在数组中添加一个HASH对象，值为wellText
    wellText !== '' ? result['HASH'] = wellText : null;
    //如果askText不为空，用split分隔&左右的值进数组
    if (askText !== '') {
        let ary = askText.split('&');
        //循环数组中的每一项用item取数组中的每一项
        ary.forEach(item => {
            //用=分隔，让分隔后前面的值作为key后面的值为value加入对象数组
            let itemAry = item.split('=');
            result[itemAry[0]] = itemAry[1];
        });
    }
    return result;
}
```

>正则

```javascript
let url = "http://www.baidu.com?a=123&b=456&c=789#box";
let parameter = queryUrlParameter(url);
console.log(parameter);
function queryUrlParameter(url) {
    let result = {},
        //全局匹配等号左右两边没有?=&#
        reg1 = /([^?=&#]+)=([^?=&#]+)/g,
        reg2 = /#([^?=&#]+)/g;
    url.replace(reg1, (n, x, y) => result[x] = y);
    url.replace(reg2, (n, x) => result['HASH'] = x);
    return result;
}
```

