#### 	 jQuery 中常用的方法

> 1.获取DOM元素

```javascript
//JQ选择器(根据选择器类型快速获取需要的元素)
$([selector],[context])

$('#box')
$('.imgBox')
//获取类名为box下所有的a标签
$('.box a' ) //=>或者 $('a',box)

/*JQ支持的选择器:传统css3中的大部分都支持、还支持例如
	*:eq(n)	获取集合中索引为n的
	*:gt(n)	大于这个索引的
	*:lt(n)	小于这个索引的
	*/

//获取list中的第3个li
$('.list>li:eq(3)')
---------------------------

//节点之间关系的属性
//=>可以进行二次筛选
let $box = $('.box');
$box.children('a');//获取对应的子元素
$box.find('a');//获取对应的后代元素
$('a').filter('.active')//=>同级筛选(在所有的a中筛选出具备CLASS='active'样式类的A)

$box.prev();     //上一个哥哥节点
$box.prev('p');  //找到上一个哥哥节点中的p
$box.prevAll();  //找到所有的哥哥节点
$box.next();     //找到下一个弟弟节点
$box.nextAll();  //找到所有的弟弟节点
$box.siblings(); //获取所有的兄弟
$box.index();    //获取索引(兄弟节点中排第几个)
$box.parent();   //=>获取父元素
$box.parents();  //=>获取所有的祖先元素，一直到document

```

> 2.DOM增删改

 ```javascript
let str=`<div id='box'></div>`
//追加到容器的末尾
$('body').append(str)

//整体替换等价于innerHTML
$('body').html(str)
//$('body').html()不传参是获取body中html内容
$('body').text(str) //不识别标签，纯文本写入body中

//追加到指定元素之前
//insertBefore和insertAfter只能移动页面上已经存在的元素
//把$a放到$b前面
$a.insertBefore($b)
//把$a放到$b后面
$a.insertAfter($b)

$a.appendTo($b) //=>$b.append($a) 在$b容器的末尾追加$a
$a.prependTo($b) //=>$b.prepend($a) 在$b容器开头追加$a

$a.clone();//实现元素的克隆
$a.remove();//实现元素的删除

//=>操作表单元素内容
$inp.val() //获取表单元素内容
$inp.val('AAA') //设置表单元素内容

//动态添加新元素
$(`<div id='box'>aaa</div>`).insertBefore($a) //=>把新增的元素放到$a前面

 ```

> 3.操作自定义属性

```javascript
//非标单元素
$box.attr('data-type')       //获取自定义属性值
$box.attr('data-type','B')  //设置自定义属性值
//<div id='box' data-type='A'>aaa</div>
$box.attr({
    'type':1,
    'name':'aa'
}); //批量设置
$box.removeAttr('data-type') //移除自定义属性
-----------------------------------------------------
    
//表单元素操作内置或者自定义属性一般使用prop和removeProp
    $radio.prop('checked') //获取选中的元素
	$radio.prop('checked',true) //给元素添加选中
```

>4.操作css样式

```javascript
//设置样式
$box.css('width',200) //设置行内样式
//批量设置，写的值不加单位，方法会帮我们自动加上px单位
$box.css({
    width:200,
    height:200
})

$box.addClass('active')//=>设置样式类(原理是对ClassName操作)，removeClass是移除，hasClass验证是否存在某个样式类，toggleClass之前有就是移除，没有就是新增

//获取样式
$box.css('width'); //=>不设置值的时候就是获取

$box.offset(); //=>当前元素距离body的左偏移和上偏移
$box.position(); //=>当前元素距离父参照物的左偏移和上偏移
$box.innerWidth/.innerHight/.outerWidth/.outerHeight()
//=>等价于clientWidth/Height  offsetWidth/Height

$(document).scrolltop([val]); //=>可以获取或者设置scrollTOP的信息，对应的方法 .scrollLeft

```

##### 除了操作DOM，JQ中还提供了其他有助于项目的方法

```JavaScript
//=>事件处理
//绑定=> $元素.on([event type],[function])
//解除绑定=>  $元素.off([event type],[function])
//$元素.bind $元素.unbind $元素.delegate
//$元素.click() .mouseover .mouseout ...等常用事件的快捷绑定
$box.on('click',function(){});
$box.click(function(){});

//=>动画处理
//.animate([目标样式],[总时间],[运动方式],[运动完做的事情])
//.stop / .finish
$box.stop().animate({
    top:100,
    left:200
},1000,'linear',function(){});

//=>AJAX请求处理
$.ajax({
    url:'json/product.json',
    method:'GET',
    async:false,
    dataType:'json',
    success:result=>{
        //result:当前请求成功执行success函数，result就是从服务器获取的结果
        _DATA=result;
    }
});

//=>常用的工具方法
$.each([数组、类数组、对象]，function(index,item){
    //=>遍历数组中的每一项 index:索引 item:当前循环的这一项(对象：index是属性名 item属性值)
});

$('A').each(function(index,item){});

//$.toArry()		转化为数组
//$.merge()			数组合并
//$.makeArray() 	把类数组转化为数组
//$.uniqueSort() 	去重加排序
//$.type()			数据类型检测
```

#### jQuery选项卡

```javascript
$(function () {
    $tabBox = $('.tabBox'),
        $navList = $tabBox.find('.navBox>li'),
        $divList = $tabBox.children('div');
    //JQ特性：内置循环处理机制（基于JQ集合去操作某个方法，我们无需循环集合中的每一项单独操作，JQ内部自动帮我们循环处理了）
    $navList.on('click', function () {
        //this=>当前点击操作的元素=>$(this)才能调取JQ方法
        //获取当前点击元素的索引
        let n = $(this).index();
        //JQ特性:链式写法
        $(this).addClass('active').siblings().removeClass('active');
        //根据点击LI的索引，在div集合找到对应那一项选中，然后这一项选中，他的兄弟项都移除选中
        $divList.eq(n).addClass('active').siblings().removeClass('active');
    });

    //基于jQuery中的each遍历集合中的每一项，绑定点击事件
    //$navList.each(function (index, $item) {
    //参数顺序和内置foreach是相反的
    //index:当前循环的这一项的索引
    //$item：当前循环的这一项
    //this===$item:当前方法中的this也是循环的这一项
    //$item.on('click', function () {
    //绑定点击事件

    //});
    //});

    // $navList.each((index, $item) => {
    // this不在是循环的这一项（箭头函数中没有this）
    // });
});
```

```javascript
$('.tabBox>.navBox>li').click(function () {
    let $this = $(this),
        n = $this.index();
    $this.addClass('active')
        .siblings().removeClass('active')
        .parent()
        .nextAll('div').eq(n).addClass('active')
        .siblings().removeClass('active')
});
```

#### JQ对象与JS对象转换

```javascript
let tabBox=document.querySelectorAll('.tabBox')
let $tabBox=$('.tabBox')
//JS转JQ
$(tabBox)
//JQ转JS
$tabBox[0]
$tabBOX.get(-1)//真实项目建议使用这个，因为支持负数
```

#### JQ选择器 $()

![11](C:\Users\李威\Desktop\11.PNG)



