const mysql = require('mysql')

let options = {
  host: 'localhost',
  //   port: '3306',
  user: 'root',
  password: 'root',
  database: 'super',
}

// 创建连接
let con = mysql.createConnection(options)

con.connect((err) => {
  // 建立连接失败
  if (err) {
    console.log('连接失败', err)
  } else {
    console.log('连接成功')
  }
})

// 执行查询
let strSql = 'select * from goods where type="swiper" '
con.query(strSql, (err, result, fields) => {
  console.log('err: ', err)
  console.log('result: ', result)
  console.log('fields: ', fields)
})

// 删除表
/* let sql2 = 'drop table user'
con.query(sql2, (err, result) => {
  console.log('err: ', err)
  console.log('result: ', result)
}) */
