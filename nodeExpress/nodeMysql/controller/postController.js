var config = require('../utils/dbconfig')
//获取指定分类信息
let getPostCate = (req, res) => {
    let {
        id
    } = req.query;
    var sql = `select * from post where cate_id=?`;
    var sqlArr = [id];
    var callBack = (err, data) => {
        if (err) {
            console.log(err, '连接错误');
        } else {
            res.send({
                'list': data
            })
        }
    }
    config.sqlConnect(sql, sqlArr, callBack)
}

//获取用户信息
let findUser = (req, res) => {
    var sql = "select * from user";
    var sqlArr = [];
    var callBack = (err, data) => {
        if (err) {
            console.log(err, '连接错误');
        } else {
            res.send({
                'list': data
            })
        }
    }
    config.sqlConnect(sql, sqlArr, callBack)
}

module.exports = {
    findUser,
    getPostCate
}