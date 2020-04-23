const express = require('express'),
    config = require('./config'),
    fs = require('fs');
const {
    pop,
    news,
    sell,
    detail
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
// app.use(session({
//     secret: 'liw',
//     saveUninitialized: false,
//     resave: false,
//     cookie: {
//         maxAge: 1000 * 60 * 60 * 24
//     }
// }));

app.listen(config.PORT, '0.0.0.0');

app.get('/detail', (req, res) => {
    let {
        iid
    } = req.query;
    console.log(iid);
    detail.find({
        iid: iid
    }).select("result").then(result => {
        res.send(result);
    })
})

app.get('/home/data', (req, res) => {
    let {
        type,
        page
    } = req.query;
    if (type == 'pop') {
        pop.find().select('image title mlsDiscountPrice price item_id -_id').skip((page - 1) * 20).limit(100).then(result => {
            fs.writeFile('./pop.json', result, 'utf8', err => {
                if (err) {
                    console.log(err);
                    return;
                }
                console.log('ok');
            })
            res.send(result);
        })
    }
    if (type == 'news') {
        news.find().select('image title mlsDiscountPrice price item_id -_id').skip((page - 1) * 20).limit(100).then(result => {
            fs.writeFile('./news.json', result, 'utf8', err => {
                if (err) {
                    console.log(err);
                    return;
                }
                console.log('ok');
            })
            res.send(result);
        })
    }
    if (type == 'sell') {
        sell.find().select('image title mlsDiscountPrice price item_id -_id').skip((page - 1) * 20).limit(100).then(result => {
            fs.writeFile('./sell.json', result, 'utf8', err => {
                if (err) {
                    console.log(err);
                    return;
                }
                console.log('ok');
            })
            res.send(result);
        })
    }
});