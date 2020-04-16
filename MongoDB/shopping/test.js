const express = require('express'),
    session = require('express-session'),
    config = require('./config');
const {
    slide,
    category,
    recommend,
    hot,
    floor
} = require('./model/index');
const app = express();

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

app.use(session({
    secret: 'liw',
    saveUninitialized: false,
    resave: false,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24
    }
}));



app.listen(config.PORT, () => {
    console.log(`server success create on port:${config.PORT} ！`);
});

app.get('/slides', (req, res) => {
    slide.find().then(result => {
        res.send(result);
    })
})

app.get('/category', (req, res) => {
    category.find().then(result => {
        res.send(result);
    })
})

app.get('/recommend', (req, res) => {
    recommend.find().then(result => {
        res.send(result);
    })
})

app.get('/hotgoods', (req, res) => {
    hot.find().then(result => {
        res.send(result);
    })
})

app.get('/floor', (req, res) => {
    floor.find().then(result => {
        res.send(result);
    })
})