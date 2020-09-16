var express = require('express')
var router = express.Router()
const fs = require('fs')
const path = require('path')
const mime = require('mime')

//引入上传模块
const multer = require('multer')
//初始化上传对象
const upload = multer({
  dest: './uploads',
  limits: {
    //
    fileSize: 1024 * 1024 * 20,
    files: 5,
  },
})

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource')
})

//处理post请求
//如果上传单个文件调用 upload.single(name)方法，上传的信息在req.file里
//上传多个文件夹调用 upload.array(name,最大上传数),上传的信息在req.files里
router.post('/', upload.array('picFile', 4), (req, res) => {
  let flag = true
  req.files.forEach((item) => {
    let targetPath = item.path + '.' + mime.getExtension(item.mimetype)
    //因为上传的文件为随机名且无后缀，需要重命名
    fs.rename(
      path.join(process.cwd(), '/' + item.path),
      path.join(process.cwd(), targetPath),
      function (err) {
        if (err) {
          flag = false
        }
      }
    )
  })
  if (flag) {
    res.send('上传成功')
  } else {
    res.send('上传失败')
  }
})

module.exports = router
