const ws = require('nodejs-websocket')
const PORT = 3000
const TYPE_ENTER = 0;
const TYPE_LEAVE = 1;
const TYPE_MSG = 2;

let count = 0
//每次只要有用户连接，回调函数会执行
const server = ws.createServer((concent) => {
    count++
    concent.userName = `用户${count}`
    // 广播消息
    broadcast({
        type: TYPE_ENTER,
        msg: `${concent.userName}进入了聊天室`,
        time: new Date()
            .toLocaleString('chinese', {
                hour12: false
            })
    })
    concent.on('text', (data) => {
        /*   //每当接收到用户传递过来的数据，text事件会被触发
          console.log('接收到数据', data)
          // 返回数据(字符串)
          concent.sendText('返回的数据' + data) */
        broadcast({
            type: TYPE_MSG,
            msg: `${concent.userName}:${data}`,
            time: new Date()
                .toLocaleString('chinese', {
                    hour12: false
                })
        })
    })
    // 只要websocket连接断开，close事件就会触发
    concent.on('close', () => {
        count--
        broadcast({
            type: TYPE_LEAVE,
            msg: `${concent.userName}离开了聊天室`,
            time: new Date()
                .toLocaleString('chinese', {
                    hour12: false
                })
        })
    })

    //注册一个error事件，处理用户的错误信息
    concent.on('error', () => {
        console.log('用户连接异常')
    })
})

// 广播消息，给每个用户发消息
function broadcast(msg) {
    // server.connections所有连接上的用户
    server.connections.forEach(item => {
        item.send(JSON.stringify(msg))
    })
}

server.listen(PORT, () => {
    console.log('服务启动在' + PORT)
})