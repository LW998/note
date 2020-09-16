### let 和 var 的区别

`let`

+ let 不存在变量提升（当前作用域中，不能再let申明之前使用变量）
+ 同一个作用域中，let不允许重复申明let 
+ let 解决了typeof的一个暂时性死区问题
+ 全局作用域中，使用let申明的变量并没有给Windows 加上对应的属性
+ let会存在块作用域（除对象以外的大括号都可被看做块级私有作用域）
+ 创建变量的六种方式中：var/function有变量提升而let/const/class/import都不存在这个机制

`var`

+ var允许重复声明，而let不允许
+ var在私有作用域中声明的是变量
+ 如果私有作用域中没有var或者其他的let... 则声明的是全局变量Windows.xxx

###  箭头函数及this问题

> ES6中新增了创建函数的方式：“箭头函数”
>
> 真实项目中是箭头函数和function这种普通函数混合使用

```javascript
//=>箭头函数的创建都是函数表达式方式（变量=函数），这种模式下，不存在变量提升，所以函数只能在创建完成后被执行（也就是创建的代码之后执行）
const fn=([形参])=>{
    //函数体 （return）
}
//执行
fn([实参]);
//=>形参只有一个，小括号可以不加
const fn=n=>{};

//=>函数体中只有一句话，并且是return xxx的，可以省略大括号return等
const fn=n=>n*10;

//普通函数
function fn(n){
    return function(m){
        return m+(++n)
    }
}
//箭头函数
const fn=n=>m=>m+(++n);
```

##### 箭头函数中没有arguments，但是可以基于剩余运算符获取实参集合，而且ES6中是支持给形参设置默认值的

```javascript
let obj = {};
let fn = (context = window, ...args) => {
    console.log(args)
};
// ...args :剩余运算符（把除第一项外的，其他传递的实参信息都存在args这个数组集合中）
fn(obj, 10, 20, 30, 40); //context:obj args:[10,20,30,40]
fn(); //context:window arg:[]
```

##### 箭头函数中没有自己的this，它里面用到的this都是自己所处上级作用域中的this（真实项目中，一旦涉及this问题，箭头函数慎用）

```javascript
window.name = "window"
let fn = n => {
    console.log(this.name)
}
obj = {
    name: "obj",
    fn: fn
}
//fn所处的执行上下文中的this是window
fn(10); //this：window
fn.call(obj, 10) //this：window 不是obj
document.body.onclick = fn; //this：window 不是预期的body
obj.fn(10); //this：window
```

```javascript
let obj = {
    name: 'obj',
    fn: function () {
        let f = () => {
            console.log(this);
        };
        f(); //this:obj
        return f;
    }
};
let f = obj.fn
f(); //this:obj
```

```javascript
let obj = {
    name: 'obj',
    fn: function () {
        //错误方法，改变不了obj中的this
        setTimeout(function () {
            console.log(this);//=>this:Window 
            this.name = "HHHH";
        }, 1000);
        //原始方法，无箭头函数前,用_this记录当前上下文的this
        let _this = this;
        setTimeout(function () {
            console.log(_this);//=>this:obj
            _this.name = "ccc";
        }, 1000);
        //箭头函数方法
        setTimeout(() => {
            console.log(this);//=>this:obj
            this.name = "HHHH";
        }, 1000);
    }
};
obj.fn();
```

### 解构赋值

> 让左侧出现和右侧值相同的结构，以此快速获取到我们需要的内容
>
> 真实项目中最常用的就是对数组和对象的解构赋值

`数组结构赋值`

```javascript
let ary = [10, 20, 30, 40, 50, 60]
//之前的写法
/!*let a = ary[0],
    b = ary[1],
    c = ary.slice(2)*!/
//ES6解构赋值
// let [a, b, ...c] = ary
// console.log(a, b, c) //=>10 20 [30, 40, 50, 60]

//不需要的值可以空出来不取，最后一个不存在的值可以赋值默认值
let [a, , , b, , c = 1] = ary
console.log(a, b, c)
```

```javascript
let ary = [10, 20, 30, 40, 50, 60]
//不需要的值可以空出来不取，最后一个不存在的值可以赋值默认值
let [a, , , b, , c = 1] = ary
console.log(a, b, c)
```

```javascript
let ary = [10, [20, 30, [40, 50]]]
// let n = ary[0],
//     m = ary[1][2][1]
//相当于
let [n, [, , [, m]]] = ary
console.log(n, m)
```

`对象解构赋值`

```javascript
let obj = {
    name: 'LW',
    age: 21,
    sex: '男',
    tip: ['a', 'b', 'c', 'd']
}
//=>创建的变量和对象的属性名一致（默认）
let {
    name,
    age,
    height
} = obj;
console.log(name, age, height) //=>LW 21 undefined
```

```javascript
let obj = {
    name: 'LW',
    age: 21,
    sex: '男',
    tip: ['a', 'b', 'c', 'd']
}
//=>冒号相当于给获取的结果设置了一个别名（变量名）:创建了一个叫做m存储obj.name这个值
//=>原来对象中没有的值可以给他赋默认值
let {
    name: m,
    age: n,
    height: h = '170CM'
} = obj
console.log(m, n, h) //=>LW 21 170CM
```

```javascript
//=>多维对象获取
let {
    name: m,
    tip: [, second, ]
} = obj
console.log(m, second) //=>LW b
```

#####  解构赋值真实案例

```javascript
let data = {
    "code": 0,
    "data": {
        "today": "2019-12-17",
        "data": [{
            "date": "2019-11-26",
            "number": "22",
            "weekday": "星期二"
        		},
                 {
                     "date": "2019-11-27",
                     "number": "24",
                     "weekday": "星期三"
                 },
                 {
                     "date": "2019-11-28",
                     "number": "29",
                     "weekday": "星期四"
                 },
                ]
    },
    "version": "a6abff850daabe5e3d0db84d65f0746d"
}

let {
    code,
    data: {
        today,
        data: eachData
    },
    version,
} = data
console.log(code, today, version) //=>0 "2019-12-17" "a6abff850daabe5e3d0db84d65f0746d"

/*eachData.forEach(item => {
        let {
            date,
            number,
            weekday,
        } = item;
        console.log(date, number, weekday)
    });*/
//真实案例中应用，相当于在箭头函数item中直接解构
eachData.forEach(({
    date,
    number,
    weekday
}) => {
    console.log(date, number, weekday)
})
```

### "..."的作用

+ 拓展运算符（多用在解构赋值中）
+ 展开运算符（多用在传递实参中）
+ 剩余运算符（多用在接收实参中）

```javascript
//=>拓展运算符
//解构赋值
let [n,...m]=[1,2,3,4]
//n:1
//m:[2,3,4]

//=>展开运算符
//传递实参
let ary=[12,23,34,45,25];
let min=Math.min(...ary);

//数组克隆(浅克隆)
let cloneAry=[...ary];

//对象克隆(浅克隆)
let obj={
    name:'LW',
    age:21
};
let cloneObj={...obj,sex:'男',age:22} //=>{name: "LW", age: 22, sex: "男"}

//=>剩余运算符
let fn=(n,...arg)=>{
    //n:10
    //arg:[20,30]
};
fn(10,20,30);
```

### class 创建类

```javascript
//=>传统ES3/ES5中创建类的方法
function fn(){
    this.x=100;
};
fn.prototype.getX=function(){
    console.log(this.x)
};
//prototype中的属性
var f1=new fn();
f1.getX();
//也可以把它当做普通函数执行
fn();
//还可以把fn当做普通对象设置键值对
fn.queryX=function(){}
fn.queryX();
```

```javascript
//=>ES6中类的创建
class fn{
    //等价于之前的构造函数体
    constructor(n,m){
        this.x=n+m;
    }
    //直接写的方法就是加在原型上的 fn.prototype.getX=function()
    getX(){
        console.log(this.x)
    }
    //给f实例设置的私有属性
    y=500;

    //前面设置static的：把当前fn当做普通对象设置键值对
    static queryX(){
        console.log("私有属性")
    }   
	static z=300;
}
//也可以单独写在外面
fn.prototype.getY=function(){
    console.log(this.y)
}
fn.prototype.y=200;
//调用
let f=new fn(10,20);
f.getX();//=>30
f.getY();//=>500
fn.queryX();=>私有属性

fn(); //=>报错，class创建的类只能new执行，不能当做普通函数执行
```
>fn详情

![1576596495341](C:\Users\李威\AppData\Roaming\Typora\typora-user-images\1576596495341.png)

> f详情

![1576596630083](C:\Users\李威\AppData\Roaming\Typora\typora-user-images\1576596630083.png)



> 普通属性

```javascript
fn.queryX();
```


> 使用prototype中的方法需要实例对象

```javascript
let f=new fn(10,20);
f.getX();
```

### ES6中的模板字符串

```javascript
let year = '2019',
    month = '12',
    day = '17'
//${}模板字符串中书写的JS表达式（凡是有输出结果的都可以被称为JS表达式，一般都是一行搞定的）
let res = `今天是${year}年${month}月${day}日`;
console.log(res);//=>今天是2019年12月17日


let ID = "box"
let HTML = `<div id="${ID}"></div>`
console.log(HTML);//=><div id="box"></div>
```

