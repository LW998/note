const events = require('events');

const fsPromise = require('../utils/fsPromise')

// 创建eventEmitter对象
const eventEmitter = new events.EventEmitter();

// 创建事件
eventEmitter.on('success', (EventMsg) => {
    console.log('成功')
    console.log(EventMsg)
})

eventEmitter.on('fail', (EventMsg) => {
    console.log('失败')
    console.log(EventMsg)
})

fsPromise.readFile('hello.txt', 'utf8').then(res => {
    eventEmitter.emit('success', res)
}).catch(err => {
    eventEmitter.emit('fail', err)
})