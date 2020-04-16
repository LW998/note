let express = require('express'),
    bodyParser = require('body-parser'),
    session = require('express-session'),
    config = require('./config');
let {
    readFile,
} = require('./fsPromise'),
    pathDataUser = './json/USER.JSON',
    pathDataVote = './json/VOTE.JSON',
    // port = 8082,
    app = express();

//=>创建服务
app.listen(config.PORT, () => {
    console.log(`server success create on port:${config.PORT} ！`);
});

/* app.use((req, res, next) => {
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
}); */
//=>处理API
app.use(session({
    secret: 'liw',
    saveUninitialized: false,
    resave: false,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24
    }
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(async (req, res, next) => {
    let userData = await readFile(pathDataUser);
    let voteData = await readFile(pathDataVote);
    req.userData = JSON.parse(userData);
    req.voteData = JSON.parse(voteData);
    next();
});
//登录
app.post('/login', (req, res) => {
    let {
        name = '', password = ''
    } = req.body;
    //二次加密
    password = password.substr(4, password.length - 8).split('').reverse().join('');
    let result = req.userData.find(item => (item['name'] === name || item['phone'] === name) && item['password'] === password);
    if (result) {
        //登录成功:记录session(是否等 & 登录用户的id)
        req.session.isLogin = true;
        req.session.userId = parseFloat(result['id']);
        res.send({
            code: 0,
            message: 'OK!'
        })
        return;
    }
    //登录失败
    res.send({
        code: 1,
        message: 'NO!'
    })
});

//检测是否登录
app.get('/checkLogin', (req, res) => {
    let isLogin = req.session.isLogin;
    if (isLogin) {
        res.send({
            code: 1,
            message: 'ok'
        });
        return;
    }
    res.send({
        code: 0,
        message: 'no'
    });
});


//退出登录
app.get('/exitLogin', (req, res) => {
    req.session.isLogin = false;
    req.session.userId = null;
    res.send({
        code: 0,
        message: 'ok'
    });
});

//获取用户的详细信息(没有传递用户id获取当前登录的信息)
app.get('/getUser', (req, res) => {
    let {
        userId = req.session.userId
    } = req.query,
        result = req.userData.find(item => item['id'] === parseFloat(userId));
    if (result) {
        res.send({
            code: 0,
            message: 'ok',
            data: {
                ...result,
                password: null
            }
        })
        return;
    }
    res.send({
        code: 1,
        message: 'NO',
        data: null
    })
});

//获取列表信息
app.get('/getMatchList', (req, res) => {
    let {
        limit,
        page,
        search
    } = req.query;
    let result = req.userData.slice(0);
    result = result.filter(item => item.id !== parseFloat(req.session.userId));
    result = result.filter(item => parseFloat(item['isMatch']) === 1);
    search ? result = result.filter(item => item.name.indexOf(search) > -1) : null;

    if (req.session.userID) {
        result.forEach(item => {
            let id = parseFloat(item['id']),
                flag = 0;
            req.voteData.forEach(voteItem => {
                if (parseFloat(voteItem['voterId']) === req.session.userID && parseFloat(voteItem['participantId']) === id) {
                    flag = 1;
                }
            });
            item['isVote'] = flag;
        });
    }
    let total = result.length,
        pageNum = Math.ceil(total / limit),
        resultData = [];
    if (page <= pageNum) {
        for (let i = (page - 1) * limit; i < page * limit; i++) {
            let item = result[i];
            if (!item) break;
            resultData.push({
                id: parseFloat(item['id']),
                name: item['name'],
                picture: item['picture'],
                sex: parseFloat(item['sex']),
                matchId: parseFloat(item['matchId']),
                slogan: item['slogan'],
                voteNum: parseFloat(item['voteNum']),
                isVote: parseFloat(item['isVote']) || 0
            });
        }
    }

    res.send({
        code: resultData.length === 0 ? 1 : 0,
        message: resultData.length === 0 ? 'NO MATCH ANY-ONE' : 'OK',
        limit: limit,
        page: page,
        pageNum: pageNum,
        total: total,
        list: resultData
    });

})


//=>处理静态资源请求
app.use(express.static('./client'));
app.use((req, res, next) => {
    res.status(404);
    res.redirect(`http://127.0.0.1:${config.PORT}/404.html`)
});