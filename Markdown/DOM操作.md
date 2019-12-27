### 在js中动态增删改元素

`createElement`

>创建元素对象

```javascript
//动态创建一个div元素对象，把他赋给box
let box = document.createElement('div');
box.id = 'boxAct';
box.style.width = '200px';
box.style.height = '200px';
box.className = 'R';
```

`createTextNode`

>创建文本对象

```javascript
//动态创建一个文本
let text = document.createTextNode('JavaScript');
```

`appendChild`

>把元素添加到元素的末尾

```javascript
//添加 容器.appendChild（元素）
box.appendChild(text);
//把box容器添加到body容器的末尾
document.body.appendChild(box);
```

`insertBefore`

>把元素添加到指定容器中指定元素的前面

```javascript
let first = document.getElementById('first');
//放到指定元素前：容器.insertBefore([需要放在前面的元素],[容器中有的元素])
//document.body是现有的元素，也可以是通过id获取的
document.body.insertBefore(box, first);
```

`cloneNode(true/false)`

>克隆元素或节点
>
>true/false 深克隆/浅克隆

```javascript
let box1 = document.querySelector('.box');
//深克隆 克隆当前的box，同时克隆box下所有的子元素
let box2 = box1.cloneNode(true);
box2.firstChild.innerText = "2222";
//浅克隆 只克隆当前的box，不克隆box下面的子元素
let box3 = box1.cloneNode(false);
box3.innerHTML = "<span>3333</span>";
document.body.appendChild(box2);
document.body.appendChild(box3);
```

`removeChild`

>移除容器中的某个元素

```javascript
document.body.removeChild(box2);
```

`setAttribute/getAttribute/removeAttribute`

> 设置/获取/移除元素的自定义属性
>
> 这种方法是把自定义属性放在元素结构上

```html
<button>按钮1</button>
<button>按钮2</button>
<button>按钮3</button>
```

```javascript
var btnList = document.querySelectorAll('button');
for (var i = 0; i < btnList.length; i++) {
    //设置自定义属性：基于setAttribute是吧属性信息写到元素标签的结构上在结构中可见,没有放到堆内存中
    btnList[i].setAttribute('index', i + 1);
    btnList[i].onclick = function () {
        //获取自定义属性：基于getAttribute可以把结构上存储的自定义属性值获取到
        alert(this.getAttribute('index'));
    }
    //删除自定义属性 btnList[i].removeAttribute('index')
}
```

![1574606752149](C:\Users\李威\AppData\Roaming\Typora\typora-user-images\1574606752149.png)

> 基于堆栈内存的自定义属性

```javascript
var btnList = document.querySelectorAll('button');
for (var i = 0; i < btnList.length; i++) {
    //设置自定义属性：元素对象.属性名=属性值（原理是向元素对象对应的堆内存中添加了一个属性）
    btnList[i].myIndex = i + 1;
    btnList[i].onclick = function () {
        //获取自定义属性：元素对象.属性名（原理是从对应的堆内存中获取到对应的属性值）
        alert(this.myIndex);
    }
    console.dir(btnList);
    //删除自定义属性 delete btnList[i].myIndex
}
```

