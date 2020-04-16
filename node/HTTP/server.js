let http = require('http'),
    url = require('url'),
    path = require('path'),
    fs = require('fs');

let port = 8082;
let {
    readFile,
    writeFile
} = require('./utils/fsPromise'),
    mime = require('mime'),
    qs = require('qs');

//公共方法
let responseRes = function responseRes(res, returnVal) {
    res.writeHead(
        200, {
            'content-type': 'application/json;charset=utf-8;'
        }
    )
    res.end(JSON.stringify(returnVal))
};
let readUser = function readUser() {
    return readFile('./json/USER.JSON').then(result => {
        return JSON.parse(result);
    })
};
let readVOTE = function readVOTE() {
    return readFile('./json/VOTE.JSON').then(result => {
        return JSON.parse(result);

    })
}

let handle = function handle(req, res) {
    let {
        method,
        headers: reqHeaders
    } = req, {
        pathname,
        query
    } = url.parse(req.url, true),
        pathReg = /\.([a-z0-9]+)$/i;
    query = JSON.parse(JSON.stringify(query));
    //静态资源请求处理
    if (pathReg.test(pathname)) {
        readFile(`./static${pathname}`).then(result => {
            //读取成功，设置响应头的MIME类型
            let suffix = pathReg.exec(pathname)[1];
            res.writeHead(200, {
                'content-type': `${mime.getType(suffix)};charset=utf-8;`
            });
            res.end(result);

        }).catch(err => {
            //读取失败：客户端请求地址错误,我们响应的内容
            res.writeHead(404, {
                'content-type': 'text/plan;charset=utf-8;'
            })
            res.end('404 Not Found!');
        })
        return;
    }


    //API接口请求处理
    //判断请求路径是否为getUser
    if (pathname === '/getUser' && method === 'GET') {
        let {
            userId = 0
        } = query;
        let returnVal = {
            code: 1,
            message: 'no data!',
            data: null
        };
        console.log(query);
        // readUser().then(result => {
        //     //result 已经是JSON格式的对象了
        //     let data = result.find(item => parseFloat(item['id']) === parseFloat(userId));
        //     if (data) {
        //         returnVal = {
        //             code: 0,
        //             message: 'ok',
        //             data,
        //         }
        //         responseRes(res, returnVal);
        //         return;
        //     }
        //     throw new Error('');//目的是没有数据的时候，让其执行catch中的操作
        // }).catch(err => responseRes(res, returnVal))

        readUser().then(result => {
            //result 已经是JSON格式的对象了
            let data = result.find(item => {
                // console.log(parseFloat(item['id']), parseFloat(userId))
                return parseFloat(item['id']) === parseFloat(userId)
            });

            data ? returnVal = {
                code: 0,
                message: 'ok',
                data,
            } : null;
            //最后都会走finally,如果成功了就把returnVal改了传递，如果查询失败就返回原数据
        }).finally(() => responseRes(res, returnVal))
        return;
    }

    if (pathname === '/register' && method === 'POST') {
        //接收客户端请求主题传递的内容
        let pass = ``,
            returnVal = {
                code: 1,
                message: 'no'
            };
        req.on('data', chunk => {
            //正在接收请求主体的内容，可能执行多次chunk获取的都是本次接收的buffer格式数据
            //console.log('' + chunk); //name=测试&password=670b14728ad9902aecba32e22fa4f6bd&phone=12345678911&sex=0&bio=x
            pass += chunk;
        });
        req.on('end', () => {
            //已经接收完请求主体了
            // console.log(JSON.parse(JSON.stringify(url.parse('/test?' + pass, true))));
            pass = qs.parse(pass);
            readUser().then(result => {
                let flag = result.some(item => {
                    return item['name'] == pass.name
                });
                if (!flag) {
                    let maxID = result.length <= 0 ? 0 : parseFloat(result[result.length - 1]['id']);
                    pass.password = pass.password.substr(4, pass.password.length - 8).split('').reverse().join('');
                    let newData = {
                        id: maxID + 1,
                        name: '',
                        picture: `img/${pass.sex!==0?'woman':'man'}.png`,
                        phone: "12791881467",
                        sex: 0,
                        password: '',
                        bio: '',
                        time: new Date().getTime(),
                        isMatch: 0,
                        matchId: '',
                        slogan: "",
                        voteNum: 0,
                        ...pass
                    };
                    //把newData追加到result默认
                    result.push(newData);
                    //把最新的result写入到文件
                    return writeFile('./json/USER.JSON', result)
                }
                throw new Error('');
            }).then(result => {
                returnVal = {
                    code: 0,
                    message: 'ok'
                };
            }).catch(err => {
                returnVal = {
                    code: 1,
                    message: '用户名已存在'
                }
            }).finally(() => {
                responseRes(res, returnVal)
            })
        })
        return;
    }
    //请求的不是API接口或者静态资源
    res.writeHead(404);
    res.end('请求资源不存在');
};

http.createServer(handle).listen(port, () => {
    console.log(`server is success,listen on ${port}`)
})