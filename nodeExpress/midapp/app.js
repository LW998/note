var createError = require('http-errors')
var express = require('express')
var path = require('path')
var cookieParser = require('cookie-parser')
const fs = require('fs')
const crypto = require('crypto')
const session = require('express-session')
// var logger = require('morgan');

var app = express()


// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

// app.use(logger('dev'));
// app.use(express.json());
app.use(
  express.urlencoded({
    extended: false,
  })
)
app.use(cookieParser('secret'))
app.use(session({
  //密钥
  secret: 'li',
  saveUninitialized: true,
  resave: true,
  cookie: {
    //设置cookie最大存储时间
    maxAge: 1000 * 60 * 60 * 24
  }
}))

app.use(express.static(path.join(__dirname, 'public')))

fs.readdirSync(path.join(__dirname, 'routes'))
  .reverse()
  .forEach((file) => {
    const fileName = file.replace(/\.js$/, '')
    app.use(`/${fileName}`, (req, res, next) => {
      req.query = {
        ...req.query,
        ...req.body,
      }
      const callback = require(`./routes/${fileName}`)
      callback(req, res, next)
    })
  })

let secretCookie = {}

app.get('/setCookies', (req, res) => {
  // 基础设置cookies,有效期为浏览器关闭前
  // res.cookie('isLogin', 'true', {
  //   maxAge: 1000000,
  //   httpOnly: true,
  // })

  let cookie = encryption('123a456');
  res.cookie('login', cookie, {
    maxAge: 1000000,
    httpOnly: true
  })
  secretCookie[cookie] = '123a456'
  // res.cookie('login', cookie, {
  //   signed: true,
  //   maxAge: 1000000,
  //   httpOnly: true
  // })
  res.send('cookies加密成功')
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


// app.get('/getCookies', (req, res) => {
//   console.log(req.signedCookies)
//   res.send(req.signedCookies)
// })

app.get('/getCookies', (req, res) => {
  let obj = {}
  Object.keys(req.cookies).forEach(item => {
    let val = req.cookies[item]
    obj[item] = secretCookie[val]
  })
  res.send(obj)
})

app.get('/setSession', (req, res) => {
  req.session.isLogin = 'true';
  req.session.username = '小明';
  req.session.password = '123456';
  res.send(req.session)
})

app.get('/getSession', (req, res) => {
  console.log(req.session);
  res.send(req.session)
})

app.get('/exitSession', (req, res) => {
  req.session.destroy(() => {
    console.log('销毁完毕')
  })
  res.send('销毁完毕')
})


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

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404))
})

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}
  // render the error page
  res.status(err.status || 500)
  res.render('error')
})

module.exports = app