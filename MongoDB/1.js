const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/pla', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('数据库连接成功');
}).catch(err => {
    console.log(err, '数据库连接失败');
})

const ShopSchema = new mongoose.Schema({
    name: String,
    author: String,
    isPublish: Boolean
})

//使用规则创建集合
const re = mongoose.model('floor', ShopSchema)


re.create({
    name: 'javascript',
    author: 'lw',
    isPublish: false
}, (err, res) => {
    console.log(res);
})

re.find().then(res => console.log(res));