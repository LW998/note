var config = require('../utils/dbconfig')


//生成验证码
function rand(min, max) {
    return Math.floor(Math.random() * (max - min)) + min
}
//验证码临时数组
ValidatePhoneCode = [];
//检测是否已经发送过验证码
let send = (phone) => {
    for (var item of ValidatePhoneCode) {
        if (phone === item.phone) {
            return true
        }
    }
    return false
}
//发送验证码
let sendCode = (req, res) => {
    let {
        phone
    } = req.query;
    if (send(phone)) {
        res.send({
            'code': 400,
            'msg': '已经发送过验证码了'
        })
        return;
    }
    let code = rand(0, 999999);
    ValidatePhoneCode.push({
        'phone': phone,
        'code': code,
    })
    console.log(code);
    res.send({
        'code': 200,
        'msg': 'success'
    });
}

//验证验证码
let findCodeAndPhone = (phone, code) => {
    for (var item of ValidatePhoneCode) {
        if (phone === item.phone && Number(code) === item.code) {
            return 'login'
        }
        return 'error';
    }
}
//验证码登录
let codePhoneLogin = async (req, res) => {
    let {
        phone,
        code
    } = req.query;

    if (send(phone)) {
        //验证码和手机号是否匹配
        let status = findCodeAndPhone(phone, code);
        if (status === 'login') {
            //登录成功
            let user = await phoneLoginBind(phone);
            res.send({
                'code': 200,
                'msg': '登录成功',
                'data': user[0]
            })
        } else if (status === 'error') {
            res.send({
                'code': 200,
                'msg': '登录失败'
            })
        }
    } else {
        res.send({
            'code': 400,
            'msg': '未发送验证码'
        })
    }
}

//检测验证码是否第一次登陆
let phoneLoginBind = async (phone) => {
    let sql = "select * from user where name=? or phone=?";
    let sqlArr = [phone, phone];
    let res = await config.SySqlConnect(sql, sqlArr);
    if (res.length) {
        //用户不是第一次注册
        res[0].userInfo = await getUserInfo(res[0].id);
        return res
    } else {
        //用户第一次注册，绑定表,用户注册
        let res = await regUser(phone);
        //获取用户详情
        res[0].userInfo = await getUserInfo(res[0].id);
        return res
    }
}

//用户注册
let regUser = async (phone) => {
    let pic = "https://gw.alicdn.com/tps/i3/TB1yeWeIFXXXXX5XFXXuAZJYXXX-210-210.png_50x50.jpg";
    let sql = `insert into user(name,pic,phone,create_time) value (?,?,?,?)`;
    let sqlArr = [phone, pic, phone, new Date()];
    let res = await config.SySqlConnect(sql, sqlArr);
    //res.affectedRows  SQL执行成功返回1，不成功返回-1
    if (res.affectedRows === 1) {
        //执行成功，获取用户信息
        let user = await getUser(phone);
        //创建用户副表
        let userInfo = await createUserInfo(user[0].id);
        if (userInfo.affectedRows == 1) {
            return user;
        } else {
            return false;
        }
    } else {
        return false;
    }
}

//获取用户信息
let getUser = (name) => {
    let sql = `select * from user where id=? or phone=? or name=?`;
    let sqlArr = [name, name, name];
    return config.SySqlConnect(sql, sqlArr);
}

//创建用户附表
let createUserInfo = (user_id) => {
    let sql = `insert into userinfo (user_id,age,sex,job) values(?,?,?,?)`;
    let sqlArr = [user_id, 28, "女", "电竞大师"];
    return config.SySqlConnect(sql, sqlArr);
}
//获取注册用户详情
let getUserInfo = (user_id) => {
    let sql = `select age,sex,job,path,birthday from userinfo where user_id=?`;
    let sqlArr = [user_id];
    return config.SySqlConnect(sql, sqlArr);
}



//用户名、手机号登录
let login = (req, res) => {
    let {
        name,
        password
    } = req.query;
    let phoneReg = /^1[3-9]\d{9}$/;
    let emailReg = /^\w+((-\w+)|(\.\w))*@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/;
    if (phoneReg.test(name)) {
        //手机号码登录
        let sql = `select * from user where phone=? and password=?`;
        let sqlArr = [name, password];
        let callBack = async (err, data) => {
            console.log(data);
            if (err) {
                console.log(err);
                res.send({
                    'code': 400,
                    'msg': '错误'
                })
            } else if (data.length === 0) {
                res.send({
                    'code': 400,
                    'msg': '手机号码或者密码错误',
                    'data': []
                })
                return;
            } else {
                let user_id = data[0].id;
                let result = await getUserInfo(user_id);
                data[0].userInfo = result[0];
                res.send({
                    'code': 200,
                    'msg': '登录成功',
                    'data': data[0]
                })
            }
        }
        config.sqlConnect(sql, sqlArr, callBack);
    } else if (emailReg.test(name)) {
        //邮箱登录
        let sql = "select * from user where email=? and password=?"
        let sqlArr = [name, password];
        let callBack = async (err, data) => {
            if (err) {
                console.log(err);
                res.send({
                    'code': 400,
                    'msg': '错误'
                })
            } else if (data.length === 0) {
                res.send({
                    'code': 400,
                    'msg': '邮箱或者密码错误',
                    'data': []
                })
            } else {
                let user_id = data[0].id;
                let result = await getUserInfo(user_id);
                data[0].userInfo = result[0];
                res.send({
                    'code': 200,
                    'msg': '登录成功',
                    'data': data[0]
                })
            }
        }
        config.sqlConnect(sql, sqlArr, callBack);
    } else {
        //用户名登录
        let sql = `select * from user where name=? and password =?`;
        let sqlArr = [name, password];
        let callBack = async (err, data) => {
            if (err) {
                console.log(err);
                res.send({
                    'code': 400,
                    'msg': '错误'
                })
            } else if (data.length === 0) {
                res.send({
                    'code': 400,
                    'msg': '用户名或者密码错误',
                    'data': []
                })
            } else {
                let user_id = data[0].id;
                let result = await getUserInfo(user_id);
                data[0].userInfo = result[0];
                console.log(data, result);
                res.send({
                    'code': 200,
                    'msg': '登录成功',
                    'data': data[0]
                })
            }
        }
        config.sqlConnect(sql, sqlArr, callBack);
    }
}

module.exports = {
    sendCode,
    codePhoneLogin,
    login
}