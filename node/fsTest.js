let {
    readFile,
    copyFile,
    writeFile,
    readdir,
    unlink
} = require('./utils/fsPromise');

readdir('less').then(res => res.filter(item => /\.css$/i.test(item))).catch(err => {
    console.log(err)
}).then(res => {
    let arg = [];
    res.forEach(item => {
        // 分别用readFile读取less中的文件，赋值给arg数组,传入的是promise实例
        arg.push(readFile(`less/${item}`))
    });
    //Promise.all等待数组中所有的promise实例都执行成功才执行的
    return Promise.all(arg)
}).then(res => {
    // console.log(res)//=>[' body {\r\n     background-color: #f00;\r\n }','.box {\r\n    background-color: #f0f;\r\n}']
    res = res.join('').replace(/( |\n|\r)/g, '');
    return res
}).then(res => {
    writeFile('less/build.min.css', res);
}).then(res => {
    console.log('创建成功')
}).catch(err => {
    console.log(err);
})