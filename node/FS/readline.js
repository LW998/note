const readline = require('readline');

const fsPromise = require('../utils/fsPromise')
    // 实例化接口对象
const r1 = readline.createInterface({
    input: process.stdin,
    output: process.stdout
})

// //question方法
// r1.question('你的名字是?', res => {
//     console.log(res);
//     r1.close()
// })


function lcQuestion(title) {
    return new Promise((resolve, reject) => {
        r1.question(title, res => {
            resolve(res);
        })
    })
}

async function createPackage() {
    let name = await lcQuestion('包的名字是什么?');
    let description = await lcQuestion('文件描述?');
    let author = await lcQuestion('作者是谁?')
        // console.log(name, description, author)
    let content = `{
        "name": "${name}",
        "version": "1.0.0",
        "description": "${description}",
        "main": "index.js",
        "scripts": {
          "test": "echo \\"Error: no test specified\\" && exit 1"
        },
        "keywords": [],
        "author": "${author}",
        "license": "ISC"
      }`
    fsPromise.writeFile('aa.json', content).then(res => {
        // console.log(res)
        r1.close()
    }).catch(err => {
        console.log('err: ', err);
    })
}

createPackage()

//close事件监听
r1.on("close", () => {
    process.exit(0);
})