let http = require('http'),
    url = require('url'),
    path = require('path'),
    fs = require('fs');

//创建web服务
let port = 8180;
let handle = function handle(req, res) {
    //req: request请求对象
    //req.url 存储的是请求资源的路径地址及问号传参
    //req.method 客户端请求的方式
    //req.headers客户端的请求头信息是一个对象

    // let {
    //     url,
    //     method,
    //     headers
    // } = req;
    // console.log(url, method, headers)

    let {
        pathname,
        query
    } = url.parse(req.url, true);
    console.log(pathname, JSON.stringify(query))

    //res: response响应对象
    //res.write 基于这个方法，服务器端可以向客户端返回内容
    //res.end 响应结束
    //res.writeHead 重新响应头

    // res.write('hello world!');

    //设置响应头信息(状态码,修改的信息(对象))
    res.writeHead(200, {
        'content-type': 'text/plan;charset=utf-8;'
    });
    res.end(JSON.stringify({
        name: '你好世界！'
    })); //一般返回都是字符串和buffer格式的数据
}

http.createServer(handle).listen(port, () => {
    //当服务创建成功，并且端口号监听成功触发的回调函数
    console.log(`server is success, listen on ${port}!`);
});