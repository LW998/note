const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/supermail', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    // console.log('数据库连接成功');
}).catch(err => {
    // console.log(err, '数据库连接失败');
})

const detailSchema = mongoose.Schema({
    iid: String,
    result: Object
})

const detail = mongoose.model('Detail', detailSchema)

module.exports = {
    detail
}