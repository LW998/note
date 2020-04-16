### Node

> 基于V8引擎(谷歌浏览器的引擎)渲染JS的工具或环境

### commonJS

```
   1.CommonJS规定，每一个JS都是一个单独的模块（模块是私有的：里面涉及的值和变量以及函数等都是私有的，和其它JS文件中的内容是不冲突的）

   2.CommonJS中可以允许模块中的方法互相的调用
     B模块中想要调取A模块中的方法
       =>A导出
       =>B导入

   [导出]
     CommonJS给每一个模块（每个JS）中都设置了内置的变量/属性/方法
       module：代表当前这个模块[object]
       module.exports：模块的这个“属性”是用来导出当前模块的属性和方法的 [object]
       exports：是内置的一个“变量”，也是用来导出当前模块属性方法的，虽然和module.exports不就是一个东西，但是对应的值是同一个(module.exports=exports 值都是对象)

   [导入]
     require：CommonJS提供的内置变量，用来导入模块的（其实导入的就是module.exports暴露出来的东西）；导入的值也是[object]类型的；


   CommonJS特点：
     1. 所有代码都运行在模块作用域，不会污染全局作用域（每一个模块都是私有的，包括里面所有的东西也都是私有的，不会和其它模块产生干扰）

     2. 模块可以多次加载，但是只会在第一次加载时运行一次，然后运行结果就被缓存了，以后再加载，就直接读取缓存结果。要想让模块再次运行，必须清除缓存。（为了保证性能，减少模块代码重复执行的次数）

     3. 模块加载的顺序，按照其在代码中出现的顺序。CommonJS规范加载模块是同步的，也就是说，只有加载完成，才能执行后面的操作。
```

 ```
require导入规则
      require('./xxx') 或者 ../xxx 再或者 /xxx，这种自己制定路径的模式，都是为了导入自定义的模块，换句话说，想要导入自定义的模块，必须加路径

      require('xxx') 首先到当前项目的node_modules中查找是否存在这个模块，不存在找node提供的内置模块（导入第三方或者内置的）
 ```

## FS模块

`fs.mkdir / fs.mkdirSync`

> 创建文件夹，有sync的是同步创建，反之是异步

```javascript
fs.mkdir('./a', err => {
    if (err) {
        //err有值说明是失败了
        console.log(err);
        return
    }
    console.log('OK'); 
})
console.log(1); //=>1 OK
```

`fs.readdir / fs.readdirSync`

> 读取文件夹中的文件名，有sync的是同步创建，反之是异步

```javascript
//同步
// let result = fs.readdirSync('./')
// console.log(result)

//异步
fs.readdir('./', (err, result) => {
    if (err) {
        console.log(err);
        return;
    }
    console.log(result) //=>[ 'a', 'fs.js' ]
})
```

`fs.rmdir/fs.rmdirSync`

> 删除文件夹

```javascript
fs.rmdir('./a', err => {//必须保证文件夹是空的
    if (err) {
        console.log(err);
        return;
    }
    console.log('ok');
})
```

`fs.readFile / fs.readFileSync`

> 读取文件中的内容

```javascript
fs.readFile('./a/a.less', 'utf8', (err, result) => {
    if (err) {
        console.log(err);
        return;
    }
    console.log(result);
})
```

`fs.writeFile / fs.writeFileSync`

> 向文件中写入内容(写入新内容会覆盖原有内容)

```javascript
fs.writeFile('./a/a.less', 'hhh', 'utf8', err => {
    if (err) {
        console.log(err);
        return;
    }
    console.log('ok');
})
```

`fs.appendFile/fs.appendFileSync`

> 追加写入新内容，原有内容还在

```javascript
//文件名，内容，文件格式（默认buffer）
fs.appendFile('./a/a.less', 'aaa', 'utf8', err => {
    if (err) {
        console.log(err);
        return
    }
    console.log('ok');
})
```

`fs.copyFile / fs.copyFileSync`

> 拷贝文件到新的位置

```javascript
//当前路径，新路径
fs.copyFile('./a/a.less', './b.less', err => {
    if (err) {
        console.log(err);
        return;
    }
    console.log('ok');
})
```

`fs.unlink / fs.unlinkSync`

> 删除文件

```javascript
fs.unlink('./a/a.less', err => {
    if (err) {
        console.log(err);
        return
    }
    console.log('ok');
})
```

## Path模块

`path.resolve()`

> 1.返回当前模块的绝对地址(不包含模块名称)
>
> 2.可以把一个相对路径拼接到一个绝对路径后面（如果两个都是绝对路径，以后一个为主）

```javascript
console.log(path.resolve()); //C:\Users\李威\Desktop\node\Path

console.log(path.resolve(__dirname, 'a/aa.js')) 
=>//C:\Users\李威\Desktop\node\Path\a\aa.js
```

## URL模块

 `url.parse()`

> 把url的各个部分进行解析，第二个参数默认false，设置为true会把query的各个值解析出来

```javascript
let url = require('url');

console.log(url.parse('https://www.baidu.com/s?cl=3&tn=baidutop10&fr=top1000&rsv_idx=2&hisfilter=1#news',true))

/* Url {
  protocol: 'https:', //协议
  slashes: true, //是否有双斜线
  auth: null, //作者
  host: 'www.baidu.com',//域名+端口
  port: null, //端口
  hostname: 'www.baidu.com', //域名
  hash: '#news', //hash值
  search: '?cl=3&tn=baidutop10&fr=top1000&rsv_idx=2&hisfilter=1', //?传递的参数
 query: [Object: null prototype] {
      cl: '3',
      tn: 'baidutop10',
      fr: 'top1000',
      rsv_idx: '2',
      hisfilter: '1'
    }, //传递的参数
  pathname: '/s',          //请求资源的路径名称
  path: '/s?cl=3&tn=baidutop10&fr=top1000&rsv_idx=2&hisfilter=1',//pathname+search
  href: 'https://www.baidu.com/s?cl=3&tn=baidutop10&fr=top1000&rsv_idx=2&hisfilter=1#news' //原始URL
} */
```

## HTTP模块

`http.createServer()`

> 创建服务

`http.createServer().linsten()`

> 监听端口

```javascript
//创建web服务
let port = 8180;
http.createServer(() => {
    //当服务创建成功，并且客户端向当前服务发送了请求才会执行回调函数，并且发送一次请求回调函数就会执行一次
    console.log('hello world!');
    //请求本机服务需要对应好协议、域名、端口号
    //http://localhost:8180 || http://127.0.0.1:8180
}).listen(port, () => {
    //当服务创建成功，并且端口号监听成功触发的回调函数
    console.log(`server is success, listen on ${port}!`);
});
```

#### req:request请求对象

`req.url`

> 存储的是请求资源的路径地址及问号传参


`req.method`

> 客户端请求的方式

`req.headers`

> 客户端的请求头信息是一个对象

```javascript
http.createServer((req,res)=>{
    let {
        url,
        method,
        headers
    } = req;
    console.log(url, method, headers)
    let {
        pathname,
        query
    } = url.parse(req.url, true);
    //防止出现[Object :not prototype]需要JSON.stringify
    console.log(pathname, JSON.stringify(query))
})
```

#### res: response响应对象

`res.write`

> 基于这个方法，服务器端可以向客户端返回内容

`res.end`

> 响应结束,每个响应必须加

```javascript
http.createServer((req,res)=>{
   res.write('hello world!');
   res.end();
})

http.createServer((req,res)=>{
   res.end('hello world!');
})
```

`res.writeHead`

> 重写响应头，自定义响应信息

```javascript
http.createServer((req,res)=>{
   //设置响应头信息(状态码,修改的信息(对象))
    res.writeHead(200, {
        'content-type': 'text/plan;charset=utf-8;'
    });
    res.end(JSON.stringify({name: '你好世界！'})); //一般返回都是字符串和buffer格式的数据
})
```

