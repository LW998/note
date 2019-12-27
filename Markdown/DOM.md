## DOM及其基础操作

#### 获取DOM元素的方法

`document.getElementById('')`

>通过id获取页面元素
>
>上下文只能指定在文档中，基于元素id或者这个元素对象

`[contex].getElementsByTagName('')`

>在指定上下文(容器)中，通过标签名获取一组元素集合
>
>contex可以为div或者通过id获取来的元素等

`[contex].getElementsByClassName('')`

>在指定上下文中，通过样式类获取一组元素集合(不兼容IE6~8)

```html
<div class="one">123456</div>
```

```javascript
//如果formBox是通过getElementById获取的，那么他下面不能再接formBox.getElementById
//getElementsByClassName获取的是一个集合，需要在后面加[0]才能去除当前元素
//获取div里的值用innerText
let one = formBox.getElementsByClassName('one')[0];
console.log(one.innerText);
```

`document.getElementByName('')`

> 在整个文档当中通过标签的name属性值获取一组节点集合（在IE中只有表单元素的name才能识别，所以一般只应用于表单元素的处理）
```javascript
//基于 getElementsByTagName / getElementsByClassName 获取的都是元素的集合
//想要操作某一个元素需要在集合中根据索引取出来
let tabBox = document.getElementsByClassName('tabBox')[0];
console.log(tabBox)
```

`document.head / document.body / document.documentElement`

> 获取页面中的 head/body/html 三个元素及其内容

`[contex].querySelector([selector])`

>在指定上下文中，通过选择器获取到指定的元素对象（一个

`[contex].querySelectorAll([selector])`

> 在指定上下文中，通过选择器获取到指定的元素集合（多个）

```javascript
//=>querySelector / querySelectorAll 不兼容IE6~8
//获取id=box
let box = document.querySelector('#box');
//获取box里所有的a元素
let a = box.querySelectorAll('a');
//获取box里所有的a元素
let a = document.querySelectorAll('#box a');
//获取box里所以的类
let ass = box.querySelectorAll('.class');
```

```javascript
//let tabBox = document.querySelector("#tabBox");
//相当于
//querySelectorAll获取的是一个节点集合，就算只有一个元素也是一个集合
let tabBox = document.querySelectorAll("#tabBox")[0];
console.log(tabBox);
```

```javascript
//jQuery获取元素的方法
var $tabList = $('#tabBox li'); //获取tabBox下所有的li
var $divList = $('#tabBox>div'); //获取tabBox子元素中所有的div，不包括子元素下面的div
```

> 获取值radio的值

```html
<div id="formBox">
    <input type="radio" name="sex" value="男" checked>男
    <input type="radio" name="sex" value="女">女
    <input type="radio" name="sex" value="未知">未知
    <br />
    <button id="getValue">获取值</button>
</div>
```

```javascript
var formBox = document.querySelector('#formBox');
var inpList = formBox.querySelectorAll('[name=sex]');
//getElementsByName不支持上下文，只能document
//var inpList = document.getElementsByName('sex');
var value = formBox.querySelector('#getValue');

value.onclick = function () {
    var result = null;
    for (var i = 0; i < inpList.length; i++) {
        var item = inpList[i];
        if (item.checked) {
            res = item.value;
            alert(res);
            break;
        }
    }
}
```

> 获取下拉列表的值

```html
<div id="formBox">
    <select name="sex" id="sex">
        <option value="男">男</option>
        <option value="女">女</option>
        <option value="未知">未知</option>
    </select>
    <br />
    <button id="submit">获取值</button>
</div>
```

```javascript
let formBox = document.getElementById('formBox');
let sex = document.getElementById('sex');
let sexList = sex.getElementsByTagName('option');
let sub = document.getElementById('submit');
sub.onclick = function () {
    let res = null;
    for (var i = 0; i < sexList.length; i++) {
        if (sexList[i].selected) {
            res = sexList[i].value;
            alert(res);
            break;
        }
    }
}
```

****

#### js盒子模型属性

>基于一些属性和方法，让我们能够获取到当前元素的样式信息，列如：
>
>clientWidth、offsetWidth等
>
>- clent
>  + Width / Height
>  + Top / Left
>- offset
>  - Width / Height
>  - Top / Left
>  - Parent
>- scroll
>  - Width / Height
>  - Top / Left
>
>方法： window.getComputedStyle([ELEMENT],[伪类])/
>
>[ELEMENT].currentStyle

`client`

```javascript
let box= document.getElementById('box')

//获取盒子可视区域的宽高（内容宽度+内边距）（不包括边框）
//1.内容溢出对他无影响
//2.获取的结果无单位（其余盒子模型也是）
//3.获取的结果是整数，它会自己四舍五入（其余盒子模型也是）
box.clientWidth
box.clientHeight

//获取当前页面整个屏幕的高度
document.documentElement.clientHeight || document.body.clientHeight (兼容问题)
//获取当前页面整个屏幕的宽度
document.documentElement.clientWidth || document.body.clientWidth (兼容问题)

//获取盒子上和左边框的大小
box.clientTop
box.clientLeft
```

> js盒子居中案例

```javascript
//js居中:(屏幕的宽度-盒子的宽度 || (盒子可视宽度+盒子左边的宽度*2))/2 ==left
//(屏幕的高度-盒子的高度 || (盒子可视高度+盒子左边的高度*2))/2 ==top
let winW = document.documentElement.clientWidth,
    //获取窗口可视宽高
    winH = document.documentElement.clientHeight,
    box = document.getElementById('box'),
    boxW = box.clientWidth,
    //获取盒子可视宽高
    boxH = box.clientHeight,
    boxT = box.clientTop,
    //获取盒子上边框宽度
    boxL = box.clientLeft;
//获取盒子左边框宽度
box.style.position = 'absolute';
// 当盒子边框对称的时候可以使用此(winW - (boxW + boxL * 2))
// box.style.left = (winW - (boxW + boxL * 2)) / 2 + 'px';
// offsetWidth盒子的总高度，相当于新盒子模型的盒子高度 
box.style.left = (winW - box.offsetWidth) / 2 + 'px';
// box.style.top = (winH - (boxH + boxT * 2)) / 2 + 'px';
box.style.top = (winH - box.offsetHeight) / 2 + 'px';
```

`offset`

```javascript
let box= document.getElementById('box')

//在client的基础上加上边框 == 新盒子模型盒子本身的宽高
//1.内容溢出对他无影响
//2.获取的结果无单位（其余盒子模型也是）
//3.获取的结果是整数，它会自己四舍五入（其余盒子模型也是）
box.offsetWidth
box.offsetHeight

//父参照物和它的父元素没有必然的联系，父参照物查找：同一个平面中最外层元素是所有后代元素的父参照物（body），而基于position：relative、absolute、fixed可以让元素脱离文档流（一个新的平面），从而改变元素的父参照物
//body的父参照物为null
document.body.offsetParent === null
//获取他的父参照物（不一定是父元素）
box.offsetParent
//获取其父参照物的上偏移 
box.offsetTop
//获取其父参照物的左偏移（当前元素的外边框到父参照物的里边框）
box.offsetLeft
```
```javascript
//计算当前元素距离body的偏移
function offset(curEle) {
    //获取当前元素的父参照物
    let par = curEle.offsetParent,
        //获取当前元素的左偏移
        l = curEle.offsetLeft,
        //获取当前元素的上偏移
        t = curEle.offsetTop;
    //判断当前元素是否存在，或者是否为body
    //par.tagName !== 'BODY' 少做一次加body边框的操作
    while (par && par.tagName !== 'BODY') {
        //当前元素加上父参照物的边框宽度
        if (!/MSIE 8\.0/.test(navigator.userAgent)) {
            //IE8中偏移值自己就算了边框，不需要再加上边框的值
            //navigator.userAgent获取当前浏览器的版本信息
            l += par.clientLeft;
            t += par.clientTop;
        }
        //当前元素加上父参照物的偏移
        l += par.offsetLeft;
        t += par.offsetTop;
        //获取到父参照物的参照物
        par = par.offsetParent;
    }
    return {
        left: l,
        top: t
    }
}
```

`scroll`

```javascript
let box= document.getElementById('box')

//在没有内容溢出的情况下，获取的结果和client一样
//在有内容溢出的情况下，获取的结果约等于真实内容的宽高（上/或者左padding + 真实内容的高度 / 宽度）
//1.不同浏览器获取的结果不尽相同
//2.设置overflow属性对最后的结果会产生一定的影响，各个浏览器影响不同，值不同
box.scrollWidth
box.scrollHeight

//获取整个页面真实的高度
document.documentElement.scrollWidth || document.body.scrollWidth
document.documentElement.scrollHeight || document.body.scrollHeight

//垂直滚动条卷去的高度
//水平滚动条卷去的宽度
//边界值:最小0，最大是整个的高度scrollHeight-clientHeight
box.scrollTop
box.scrollLeft

//13个盒子模型属性，只有这两是可读写的属性（既可以获取也可以设置对应的值），其余的都是只读属性（不能设置值，只能获取）
```

```javascript
//快速到底部
box.scrollTop=box.scrollHeight-box.clientHeight
//快速到顶部
box.scrollTop=0
```

`getComputedStyle`

> 获取当前元素所有经过浏览器计算过的样式
>
> + 只要元素在页面中呈现出来，那么所有的样式都是经过浏览器计算的即使是没有设置和见过的样式都计算了
> + 不管写或者不写，也不论写在哪，样式都在这，可以直接获取
>
> 在IE6~8浏览器中不兼容，需要基于currentStyle来获取

```javascript
// 第一个参数是元素  第二个参数是伪类 :after/:before(不写也可)
let styleObj=window.getComputedStyle([element],null)
styleObj["backgroundColor"]
styleObj.display
// IE6~8
styleObj = [element].currentStyle;
```

