let express = require('express');

//执行express创建一个服务:返回的结果app用来操作这个服务
let app = express();
//app.listen 创建一个web服务，监听端口号
app.listen(8082, () => {
    console.log('server success create on port 8082!')
});

//静态资源文件处理
//express.static([PATH]):到指定的目录中查找客户端请求的静态资源文件并返回
app.use(express.static('./client'));
app.use((req, res) => {
    //=>能走到这说明执行static并没有找到对应的资源文件
    //res.status设置响应状态码
    res.status(404);
    res.send('Not Found!');

    //=>还可以重定向处理
    // res.redirect(301, 'http://www.baidu.com')
});

// request对象(req)
// req.params:存储的是请求路径的参数信息
// req.path:存储请求地址的路径名称
// req.query:存储问号传参的相关信息(对象)
// req.body:在配合body-parser中间件的情况下，req.body存储的是请求主体传递过来的信息
// req.method:请求方式
// req.get:获取响应头信息
// req.session:基于express-session中间件处理后，基于这个属性可以操作session
// req.cookies:基于cookie-params中间件处理后，把客户端传递的cookie信息放到这个属性上

// response对象(res)
// res.end:类似于原生的结束响应并返回内容(字符串)
// res.json:返回给客户端的内容，只不过传递的数据可以是JSON对象(内部装换为JSON字符串)
// res.send:最常用的给客户端返回信息的方法(可以传递对象/path/buffer/txt等),基于send是通过响应主体返回信息
// res.status:返回状态码
// res.sendStatus：设置返回的状态码(它会把状态码对应的信息自动返回)
// res.sendFile([PATH]):首先把PATH指定文件中的内容得到，然后把内容返回给客户端，也会自动结束响应
// res.type:返回content-type
// res.set:设置响应头信息 res.set([key],[val]) res.set({key:val,...})
// res.cookie:通过此方法设置一些cookie信息，通过响应头set-cookie返回给客户端，客户端把返回的cookie信息种在本地
// res.redirect:重定向
