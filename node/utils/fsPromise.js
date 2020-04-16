let fs = require('fs'),
    path = require('path');
//=>存储的是当前模块执行所在的绝对路径(!==__dirname)
let dirname = path.resolve();

['mkdir', 'rmdir', 'readdir', 'readFile', 'copyFile', 'unlink'].forEach(item => {
    module.exports[item] = function (PathName, copyPath = '') {
        PathName = path.resolve(dirname, PathName);
        copyPath = path.resolve(dirname, copyPath);
        return new Promise((resolve, reject) => {
            let arg = [(err, result) => {
                if (err) {
                    reject(err);
                    return;
                }
                //如果res为undefined传空字符串
                resolve(result || '');
            }];
            if (item === 'readFile') {
                //非图片或者音视频等资源设置utf-8
                if (!/\.(jpg|jpeg|png|gif|svg|ico|bmp|eot|ttf|woff|mp3|mp4|ogg|wav|m4a|wmv|avi)$/i.test(PathName)) {
                    arg.unshift('utf8');
                }
            }
            item === 'copyFile' ? arg.unshift(copyPath) : null;
            fs[item](PathName, ...arg)
        })
    }
});

['writeFile', 'appendFile'].forEach(item => {
    exports[item] = function (PathName, content) {
        PathName = path.resolve(dirname, PathName);
        if (typeof content !== 'string') {
            //写入的内容必须是字符串
            content = JSON.stringify(content);
        }
        return new Promise((resolve, reject) => {
            fs[item](PathName, content, 'utf8', err => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve();
            });
        });
    };
});



// let readFile = function (PathName) {
//     //__dirname:当前模块的绝对路径和模块在哪执行无关
//     //path.resolve():绝对路径是执行当前模块的路径
//     PathName = path.resolve(dirname, PathName);
//     return new Promise((resolve, reject) => {
//         fs.readFile(path, 'utf8', (err, result) => {
//             if (err) {
//                 reject(err);
//                 return;
//             }
//             resolve(result);
//         })
//     });
// }