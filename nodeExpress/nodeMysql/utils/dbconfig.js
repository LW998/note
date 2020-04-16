const mysql = require('mysql');
module.exports = {
    //数据库配置
    config: {
        host: 'localhost',
        port: '3306',
        user: 'root',
        password: 'root',
        database: 'test',
    },
    //连接数据库,连接池方式
    //连接池对象
    sqlConnect: function (sql, sqlArr, callBack) {
        var pool = mysql.createPool(this.config);
        pool.getConnection((err, conn) => {
            if (err) {
                console.log('连接失败');
                return;
            }
            console.log('连接成功');
            //事件驱动回调
            conn.query(sql, sqlArr, callBack);
            //释放连接
            conn.release();
        })
    },
    //promise 回调
    SySqlConnect: function (sySql, sqlArr) {
        return new Promise((resolve, reject) => {
            var pool = mysql.createPool(this.config);
            pool.getConnection((err, conn) => {
                if (err) {
                    console.log('连接失败');
                    reject(err);
                } else {
                    conn.query(sySql, sqlArr, (err, data) => {
                        if (err) {
                            reject(err);
                        } else {
                            resolve(data);
                        }
                    });
                    //释放连接
                    conn.release();
                }
            })
        }).catch(err => {
            console.log(err);
        })
    }
}