const mysql = require('mysql');
module.exports = {
    //数据库配置
    config: {
        host: 'localhost',
        port: '3306',
        user: 'root',
        password: 'root',
        database: 'super',
        multipleStatements: true
    },
    //promise 回调
    SqlConnect: function (sySql, sqlArr) {
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