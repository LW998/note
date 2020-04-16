let fs = require('fs');
// fs.mkdir('./a', err => {
//     if (err) {
//         //err有值说明是失败了
//         console.log(err);
//         return
//     }
//     console.log('OK');
// })
// console.log(1);

// let result = fs.readdirSync('./')
// console.log(result)

// fs.readdir('../commonJS', (err, result) => {
//     if (err) {
//         console.log(err);
//         return;
//     }
//     console.log(result)
// })

// fs.rmdir('./a', err => {
//     if (err) {
//         console.log(err);
//         return;
//     }
//     console.log('ok');
// })

// fs.readFile('./a/a.less', 'utf8', (err, result) => {
//     if (err) {
//         console.log(err);
//         return;
//     }
//     console.log(result);
// })

// fs.appendFile('./a/a.less', 'aaa', 'utf8', err => {
//     if (err) {
//         console.log(err);
//         return
//     }
//     console.log('ok');
// })

// fs.unlink('./a/a.less', err => {
//     if (err) {
//         console.log(err);
//         return
//     }
//     console.log('ok');
// })


fs.copyFile('./a/a.less', './b.less', err => {
    if (err) {
        console.log(err);
        return;
    }
    console.log('ok');
})