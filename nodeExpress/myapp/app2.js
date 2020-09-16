const express = require('express')

let app = express();

// 字符串的路由模式
app.get('/', (req, res) => {
    res.send('首页')
})

// 类字符的正则模式
// 例如匹配2个路径abcd或者acd
app.get('/ab?cd', (req, res) => {
    res.send(`这是${req.url.substr(1)}`)
})

//正则路径模式
app.get(/^\/a[1-9A-Z]*$/, (req, res) => {
    res.send(`这是${req.url.substr(1)}`)
})

//动态路由
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


module.exports = app;