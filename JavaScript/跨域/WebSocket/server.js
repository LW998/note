let express = require('express'),
    app = express(),
    socket = require('socket.io'),
    i = 0;

//监听socket连接 listen参数为创建的服务
socket.listen(app.listen(8000, () => {
    console.log('server create on 8000');
})).on('connection', function (client) {
    //接收到信息
    client.on('message', function (msg) {
        client.send(msg + i++);
    })
    //断开连接
    client.on('disconnect', function () {
        console.log('client socket has closed!');
    })
})