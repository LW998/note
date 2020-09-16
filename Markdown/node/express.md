## 安装express

```shell
npm install express -g
npm install express-generator -g
express --version
```

## 创建应用

> 创建一个名为myapp的项目，选择需要使用的ejs模板引擎(默认jade)

```shell
express --view=ejs myapp
```

## 路由

#### 1.字符串的路由模式

```javascript
app.get('/', (req, res) => {
    res.send('首页')
})
```

#### 2.类似字符正则的模式

```javascript
// 例如匹配2个路径abcd或者acd
app.get('/ab?cd', (req, res) => {
    console.log(req.url)
    res.send(`这是${req.url.substr(1)}`)
})
//ab+cd 可以是 abbcd/abcd....
//ab*cd 可以是 acd/abbbcd....
```

#### 3.正则路径模式

```javascript
// http://localhost:3000/a123A
app.get(/^\/a[1-9A-Z]*$/, (req, res) => {
    res.send(`这是${req.url.substr(1)}`)
})
//这是a123A
```

####  4.动态路由

```javascript
// http://localhost:3000/news/123/c456
app.get('/news/:id/c:cid', (req, res) => {
    console.log(req.params)
    res.send(`新闻${JSON.stringify (req.params)}页面`)
})
//新闻{"id":"123","cid":"456"}页面
```

#### 5.动态路由中间件

```javascript
// http://localhost:3000/news/123/c789
app.get('/news/:id/c:cid', (req, res, next) => {
    console.log(req.params.id)
    req.person = "li"
    next()
}, (req, res, next) => {
    console.log(req.params.cid)
    next()
}, (req, res) => {
    res.send(`新闻${JSON.stringify (req.params)}页面,${req.person}`)
})
//新闻{"id":"123","cid":"789"}页面,li
```

## request对象(req)
| 方法        | 描述                                                         |
| ------------------------------ | ---- |
| req.params  | 存储的是请求路径的参数信息                                   |
| req.path    | 存储请求地址的路径名称                                       |
| req.query   | 存储问号传参的相关信息(对象)，(GET请求参数) |
| req.body | 在配合bodyParser中间件的情况下，存储的是请求主体传递过来的信息（POST请求参数） |
| req.method | 请求方式 |
| req.get | 获取响应头信息 |
| req.session | 基于express-session中间件处理后，基于这个属性可以操作session |
| req.cookies | 基于cookie-params中间件处理后，把客户端传递的cookie信息放到这个属性上 |

## response对象(res)

| 方法                 | 描述                                                         |
| -------------------- | ------------------------------------------------------------ |
| res.end              | 类似于原生的结束响应并返回内容(字符串)                       |
| res.send             | 最常用的给客户端返回信息的方法(可以传递对象/path/buffer/txt等),基于send是通过响应主体返回信息 |
| res.render           | 渲染视图模板，需要配置view模板引擎，或者手写html             |
| res.json             | 返回给客户端的内容，只不过传递的数据可以是JSON对象(内部装换为JSON字符串) |
| res.jsonp            | 发送带有jsonp支持的json响应                                  |
| res.status           | 返回状态码                                                   |
| res.sendStatus       | 设置返回的状态码(它会把状态码对应的信息自动返回)             |
| res.sendFile([PATH]) | 首先把PATH指定文件中的内容得到，然后把内容返回给客户端，也会自动结束响应 |
| res.type             | 返回content-type                                             |
| res.set              | 设置响应头信息 res.set([key],[val]) res.set({key:val,...})   |
| res.cookie           | 通过此方法设置一些cookie信息，通过响应头set-cookie返回给客户端，客户端把返回的cookie信息种在本地 |
| res.redirect         | 重定向请求                                                   |
| res.download         | 提示要下载的文件                                             |

## 中间件

#### 1.应用层中间件

```javascript
// 添加中间件
app.use((req, res, next) => {
  res.addNum = (a, b) => {
    return a + b
  }
  console.log('访问之前都会被调用')
  next()
})

app.get('/', (req, res) => {
  res.send('首页' + res.addNum(1, 2))
})
```

> 跨域处理

```javascript
app.use((req, res, next) => {
    //允许请求的源
    //写 "*" 允许多源
    //允许所有源后不能携带cookie
    res.header("Access-Control-Allow-Origin", "http://127.0.0.1:8000");
    //是不是允许携带cookies
    res.header("Access-Control-Allow-Credentials", true);
    //允许的请求头
    res.header("Access-Control-Allow-Headers", 'Content-Type,Content-Length,Authorization,Accept,X-Requested-With');
    //允许请求方式
    res.header("Access-Control-Allow-Methods", 'PUT,POST,GET,DELETE,OPTIONS,HEAD');
     //试探性请求
    if (req.method === 'OPTIONS') {
        res.send('Current services support cross domain requests!');
        return;
    }
    next();
});
```

#### 2.路由中间件

```javascript
//index.js
var express = require('express');
var router = express.Router();

router.get('/index', function(req, res, next) {
  res.render('首页');
});

module.exports = router;
```

```javascript
//app.js
var indexRouter = require('./routes/index');
app.use('/i', indexRouter);
//调用路由
//http://localhost:3000/i/index
```

> 快捷注册路由

```javascript
fs.readdirSync(path.join(__dirname, 'routes')).reverse().forEach(file => {
  const fileName = file.replace(/\.js$/, '')
  app.use(`/${fileName}`, (req, res, next) => {
    req.query = {
      ...req.query,
      ...req.body,
    };
    const callback = require(`./routes/${fileName}`);
    callback(req, res, next);
  })
})
```

#### 3.错误处理中间件

> 当上面的操作都没有执行成功时执行，一般在最后面

```javascript
var createError = require('http-errors');
// 创建一个404异常
app.use(function (req, res, next) {
  next(createError(404));
});
// 异常处理方法
app.use(function (err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  // 渲染错误页面
  res.status(err.status || 500);
  res.render('error');
});
```

#### 4.内置中间件

> 静态资源处理中间件，唯一的内置中间件

```javascript
app.use(express.static(path.join(__dirname, 'public')));
```

## cookies

```javascript
//需要先引入cookies中间件
var cookieParser = require('cookie-parser')
app.use(cookieParser())
```

####  1.设置cookies

| 值         | 含义                                                         |
| ---------- | ------------------------------------------------------------ |
| domain     | 域名                                                         |
| name=value | 键值对，可以设置要保存的key和value，注意不能和其他属性项的名字一样 |
| Expires    | 过期时间（秒），在设置的某个时间点后该cookies就会失效        |
| maxAge     | 最大失效时间（毫秒）,设置在多长时间后失效                    |
| secure     | 当secure值为true时，cookies在HTTP中是无效的，在HTTPS中才有效 |
| Path       | 表示在那个路由下可以访问到cookie                             |
| httpOnly   | 是微软对cookie做的扩展，设置后无法通过程序读取cookie信息,防止XSS攻击 |
| singed     | 为TRUE对cookie进行签名，这样就需要用res.signedCookies进行访问。被篡改的签名cookie会被服务器拒绝，并且重置为原始值 |

```javascript
app.get('/setCookies', (req, res) => {
  res.cookie('isLogin', 'true',{maxAge:900000,httpOnly:true})
  res.send('cookie设置成功')
})
```

#### 2.获取cookies

```javascript
app.get('/getCookies', (req, res) => {
  console.log(req.cookies)
  res.send(req.cookies)
})
```

#### 3.cookies加密

```javascript
app.use(cookieParser('secret'))
app.get('/setCookies', (req, res) => {
    //加密cookies
    let cookie = {
        a: 100,
        t: 10086,
        c: 'li',
    }
    res.cookie('login', cookie, { signed: true, maxAge: 1000000, httpOnly: true })
    res.send('cookie设置成功')
})
```
#### 4.获取加密cookies

```javascript
app.get('/getCookies', (req, res) => {
  console.log(req.signedCookies)
  res.send(req.signedCookies)
})
```

#### 5.md5加密

```javascript
const crypto = require('crypto')
//设置对象保存加密的cookie键值对
let secretCookie = {}
app.get('/setCookies', (req, res) => {
  //调用加密方法
  let cookie = encryption('123a456');
  //设置cookies
  res.cookie('login', cookie, {
    maxAge: 1000000,
    httpOnly: true
  })
  //保存cookies方便解密
  secretCookie[cookie] = '123a456'
  res.send('cookie加密成功')
})
// 加密
function encryption(str) {
  // 需要加密的字符串
  let cookie = str
  // 使用加密算法
  let md = crypto.createHash('md5')
  // 对字符串进行加密
  md.update(JSON.stringify(cookie))
  // 加密的二进制数据以字符串的形式
  let content = md.digest('hex');
  return content
}
```

#### 6.md5解密

```javascript
app.get('/getCookies', (req, res) => {
  let obj = {}
  Object.keys(req.cookies).forEach(item => {
    let val = req.cookies[item]
    obj[item] = secretCookie[val]
  })
  res.send(obj)
})
```

## session

```javascript
const session = require('express-session')
app.use(session({
    //配置加密字符串，它会在原有的基础上再和secret的值去拼接加密
    secret: 'li',
    //无论是否使用session,默认只要对页面发起请求，都会给客户端一个cookie
    saveUninitialized: true,
    //是否强制保存
    resave: true,
    cookie: {
        //设置cookie最大存储时间
        maxAge: 1000 * 60 * 60 * 24
    }
}))
```

#### 1.设置session

```javascript
app.get('/setSession', (req, res) => {
  req.session.isLogin = 'true';
  req.session.username = '小明';
  req.session.password = '123456';
  // 重置有效时间
  req.session.cookie.maxAge=10000;
  res.send(req.session)
})
// 设置完成后会在cookie中加入connect.sid
```

#### 2.获取session

```javascript
app.get('/getSession', (req, res) => {
  console.log(req.session);
  res.send(req.session)
})
```

#### 3.销毁session

```javascript
app.get('/exitSession', (req, res) => {
  //注销session
  req.session.destroy(() => {
    console.log('销毁完毕')
  })
  res.send('销毁完毕')
})
```

## 文件上传

> 安装multer中间件

```shell
npm install multer --save
```

```javascript
//引入上传模块
const multer = require('multer')
//初始化上传对象
const upload = multer({
  //文件保存目录
  dest: './uploads',
  //文件限制
  limits: {
    //文件大小
    fileSize: 1024 * 1024 * 20,
    //文件数量
    files: 5,
  },
})
```

| 值            | 描述                  | 默认      |
| ------------- | --------------------- | --------- |
| fieldNameSize | 名字最大长度          | 100 bytes |
| fieldSize     | field值的最大值       | 1 MB      |
| fields        | 非文件field的最大数量 | 无限制    |
| fileSize      | 文件最大值            | 无限制    |
| files         | 文件最大数量          | 无限制    |
| parts         | part传输的最大数量    | 无限制    |
| headerPairs   | 键值对最大组数        | 2000      |

```javascript
//如果上传单个文件调用 upload.single(name)方法，上传的信息在req.file里
//上传多个文件夹调用 upload.array(name,maxCount),上传的信息在req.files里
// upload.any() 接受一切上传文件
// upload.none() 只接受文本
// upload.fields([{name,maxCount},{name,maxCount}]) 接受复杂类型的文件上传
router.post('/', upload.array('picFile', 4), (req, res) => {
  let flag = true
  req.files.forEach((item) => {
    let targetPath = item.path + '.' + mime.getExtension(item.mimetype)
    //因为上传的文件为随机名且无后缀，需要重命名
    fs.rename(
      path.join(process.cwd(), '/' + item.path),
      path.join(process.cwd(), targetPath),
      function (err) {
        if (err) {
          flag = false
        }
      }
    )
  })
  if (flag) {
    res.send('上传成功')
  } else {
    res.send('上传失败')
  }
})
```

## 文件下载

```javascript
router.get('/', (req, res, next) => {
    //只能写本地路径
    res.download('./uploads/0bfcc290931fd971d1f4f4eb742d7ed2.png')
});
```

