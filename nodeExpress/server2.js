let express = require('express'),
    fs = require('./fsPromise'),
    bodyParser = require('body-parser'),
    session = require('express-session');

let app = express();
app.listen(8080, () => {
    console.log('server success create on port 8080!')
});
/* app.use((req, res, next) => {
    let chunk = '';
    req.on('data', chart => {
        chunk += chart;
    });
    req.on('end', () => {
        let qs = require('qs');
        req.body = qs.parse(chunk);
        next(); //=>一定要执行，不执行不再往下走了
    })
}) */
//通过执行不同的方法，把客户端传递的内容转化为对象存放在req.body上
app.use(bodyParser.urlencoded({
    extended: true
}));
// app.use(bodyParser.json());
// app.use(bodyParser.raw());
//是操作session的，可以设置cookie过期时间，当中间件执行完成后会在req上挂载一个session的属性，用来操作session
app.use(session({
    //密钥
    secret: 'li',
    saveUninitialized: '',
    resave: false,
    cookie: {
        //设置cookie最大存储时间
        maxAge: 1000 * 60 * 60 * 24
    }
}))

//数据API请求处理
app.get('/list', (req, res) => {
    let {
        lx = 'pro'
    } = req.query;
    fs.readFile('./package.json').then(result => {
        result = JSON.parse(result);
        console.log(result.dependencies)
        result = lx === 'dev' ? result.devDependencies : result.dependencies;
        res.status(200).type('application/json').send(result);

    }).catch(err => {
        res.status(500).type('application/json').send(err);
    })
})

//中间件:在创建完服务和处理数据或文件请求之前我们提前做一些事情(公共的事情)
//app.use((req,res,next)=>{}):使用中间件 next执行是让其继续执行下面该做的事情

app.post('/add', (req, res) => {
    res.status(200).type('application/json');
    fs.writeFile('./aa.json', req.body).then(() => {
        res.send({
            code: 0,
            codeText: 'ok'
        })
    }).catch(err => {
        res.send({
            code: 1,
            codeText: err
        })
    });
});



//静态资源文件处理
app.use(express.static('./client'));
app.use((req, res) => {
    res.status(404);
    res.send('Not Found!');
});