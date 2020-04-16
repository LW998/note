var express = require('express');
const bodyParser = require('body-parser');
var path = require('path');
var cookieParser = require('cookie-parser');
const config = require('./utils/config'),
  session = require('express-session');

var indexRouter = require('./routes/index');
var homeRouter = require('./routes/home');

var app = express();

//改写
var http = require('http');
var server = http.createServer(app);

//跨域处理
app.use((req, res, next) => {
  const {
    ALLOW_ORIGIN,
    CREDENTIALS,
    HEADERS,
    ALLOW_METHODS
  } = config.CORS;
  res.header("Access-Control-Allow-Origin", ALLOW_ORIGIN);
  res.header("Access-Control-Allow-Credentials", CREDENTIALS);
  res.header("Access-Control-Allow-Headers", HEADERS);
  res.header("Access-Control-Allow-Methods", ALLOW_METHODS);
  if (req.method === 'OPTIONS') {
    res.send('Current services support cross domain requests!');
    return;
  }
  next();
});

//设置session

// app.use(session({
//   secret: 'liw',
//   saveUninitialized: false,
//   resave: false,
//   cookie: {
//     maxAge: 1000 * 60 * 60 * 24
//   }
// }));

app.use(express.urlencoded({
  extended: false
}));
app.use(cookieParser());

//静态资源
app.use(express.static(path.join(__dirname, 'public')));
//post请求处理
app.use(bodyParser.urlencoded({
  extended: true
}));



app.use('/', indexRouter);
app.use('/home', homeRouter);



server.listen(8000)