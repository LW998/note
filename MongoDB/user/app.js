const http = require('http');
const url = require('url');
const fs = require('fs');
const qs = require('querystring');
require('./model/index');
const User = require('./model/user');

const app = http.createServer();
//为服务添加请求对象
app.on('request', async (req, res) => {
    const method = req.method;
    const {
        pathname,
        query
    } = url.parse(req.url, true);
    if (method === 'GET') {
        //呈现用户列表页面
        if (pathname === '/list') {
            let users = await User.find();

            let list = `<!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>用户列表</title>
                <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@3.3.7/dist/css/bootstrap.min.css">
            </head>
            <body>
                <div class="container">
                    <h6>
                        <a href="/add" class="btn btn-primary">添加用户</a>
                    </h6>
                    <table class="table table-striped table-bordered">
                        <tr>
                            <th>用户名</th>
                            <th>年龄</th>
                            <th>爱好</th>
                            <th>邮箱</th>
                            <th>操作</th>
                        </tr>
                        `;
            users.forEach((item => {
                list += `
                <tr>
                <td>${item.name}</td>
                <td>${item.age}</td>
                <td>
                ${item.hobbies.map(val => `<span>${val}</span>`).join(' ')}
                </td>
                <td>${item.email}</td>
                <td><a href="/remove?id=${item._id}" class="btn btn-danger btn-xs">删除</a>
                    <a href="/modify?id=${item._id}" class="btn btn-success btn-xs">修改</a>
                </td>
            </tr>
                `;
            }))
            list += `</table>
            </div>
            </body>
            </html>`
            res.end(list)
        } else if (pathname === '/add') {
            let add = `<!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>用户列表</title>
                <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@3.3.7/dist/css/bootstrap.min.css">
            </head>
            <body>
                <div class="container">
                    <h3>添加用户</h3>
                    <form method="POST" action="/add">
                        <div class="form-group">
                            <label>用户名</label>
                            <input name="name" type="text" class="form-control" placeholder="请填写用户名">
                        </div>
                        <div class="form-group">
                            <label>密码</label>
                            <input name="password" type="text" class="form-control" placeholder="请输入密码">
                        </div>
                        <div class="form-group">
                            <label>年龄</label>
                            <input name="age" type="text" class="form-control" placeholder="请填写年龄">
                        </div>
                        <div class="form-group">
                            <label>邮箱</label>
                            <input name="email" type="text" class="form-control" placeholder="请填写邮箱">
                        </div>
                        <div class="form-group">
                            <label>请选择爱好</label>
                            <div>
                                <label class="checkbox-inline">
                                    <input type="checkbox" value="足球" name="hobbies">足球
                                </label>
                                <label class="checkbox-inline">
                                    <input type="checkbox" value="篮球" name="hobbies">篮球
                                </label>
                                <label class="checkbox-inline">
                                    <input type="checkbox" value="橄榄球" name="hobbies">橄榄球
                                </label>
                                <label class="checkbox-inline">
                                    <input type="checkbox" value="敲代码" name="hobbies">敲代码
                                </label>
                                <label class="checkbox-inline">
                                    <input type="checkbox" value="抽烟" name="hobbies">抽烟
                                </label>
                                <label class="checkbox-inline">
                                    <input type="checkbox" value="喝酒" name="hobbies">喝酒
                                </label>
                                <label class="checkbox-inline">
                                    <input type="checkbox" value="烫头" name="hobbies">烫头
                                </label>
                            </div>
                        </div>
                        <button type="submit" class="btn btn-primary">添加用户</button>
                    </form>
                </div>
            </body>
            </html>`;
            res.end(add);
        } else if (pathname === '/modify') {
            let user = await User.findOne({
                _id: query.id
            });
            let hobbies = ['足球', '篮球', '橄榄球', '敲代码', '吃饭', '睡觉', '玩游戏'];
            let modify = `<!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>用户列表</title>
                <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@3.3.7/dist/css/bootstrap.min.css">
            </head>
            <body>
                <div class="container">
                    <h3>修改用户</h3>
                    <form method="POST" action="/modify?id=${user._id}">
                        <div class="form-group">
                            <label>用户名</label>
                            <input name="name" type="text" class="form-control" placeholder="请填写用户名" value="${user.name}">
                        </div>
                        <div class="form-group">
                            <label>密码</label>
                            <input name="password" type="text" class="form-control" placeholder="请输入密码" value="${user.password}">
                        </div>
                        <div class="form-group">
                            <label>年龄</label>
                            <input name="age" type="text" class="form-control" placeholder="请填写年龄" value="${user.age}">
                        </div>
                        <div class="form-group">
                            <label>邮箱</label>
                            <input name="email" type="text" class="form-control" placeholder="请填写邮箱" value="${user.email}">
                        </div>
                        <div class="form-group">
                            <label>请选择爱好</label>
                            <div>
                            ${hobbies.map(item => {
                                if (user.hobbies.includes(item)) {
                                    return `<label class="checkbox-inline">
                                    <input type="checkbox" value="${item}" name="hobbies" checked>${item}
                                    </label>`
                                }
                                return ` <label class="checkbox-inline">
                                <input type="checkbox" value="${item}" name="hobbies">${item}
                            </label>`
                            }).join(' ')}
                        </div>
                            </div>
                            <button type="submit" class="btn btn-primary">修改用户</button>
                        </form>
                    </div>
                </body>
                </html>`;
            res.end(modify);
        }else if (pathname === '/remove') {
            await User.findOneAndDelete({ _id: query.id });
            res.writeHead(301, {
                Location: '/list'
            });
            res.end();
        }
    } else if (method === 'POST') {
        if (pathname === '/add') {
            let formData = '';
            req.on('data', result => {
                formData += result;
            });
            req.on('end', async() => {
                let data = JSON.parse(JSON.stringify(qs.parse(formData)));
                await User.create(data);
                res.writeHead(301, {
                    location: '/list'
                });
                res.end();
            })
        } else if (pathname === '/modify') {
            let formData = '';
            req.on('data', result => {
                formData += result;
            });
            req.on('end', async() => {
                let data = JSON.parse(JSON.stringify(qs.parse(formData)));
                await User.updateOne({_id:query.id},data);
                res.writeHead(301, {
                    Location: '/list'
                });
                res.end();
            })
        }
    }
})
//监听端口
app.listen(8000, () => {
    console.log('success create on 8000')
});