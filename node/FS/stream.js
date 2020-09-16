const fs = require('fs');


// 1.创建读取流
// 参数:(文件路径，[配置项])
const rs = fs.createReadStream('h.flac')

// 2.创建写入流 
// 参数:(文件路径，[配置项])
const ws = fs.createWriteStream('c.flac');


// console.log(rs)

// 文件打开事件
rs.on('open', () => {
    console.log('打开读取文件')
})

// 文件关闭事件
rs.on('close', () => {
    console.log('读取完成，文件关闭')
})


/* 
let n = 0

// 每一批数据的流入完成
rs.on('data', res => {
    // console.log(res, res.length)

    // 执行写入
    ws.write(res, err => {
        if (err) {
            console.log(err)
        } else {
            console.log(`内容${n++}流入完成`)
        }
    });
}) 

// 文件打开事件
ws.on('open', () => {
    console.log('文件打开')
})

// 文件准备写入状态
ws.on('ready', () => {
    console.log('文件已准备写入')
})

// 文件关闭事件
ws.on('close', () => {
    console.log('写入完成，文件关闭')

    // 写入完成
    ws.end(() => {
        console.log('文件写入完成');
    })
})*/

rs.pipe(ws)