const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/play', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('数据库连接成功');
}).catch(err => {
    console.log(err, '数据库连接失败');
})



//创建集合规则
const ShopSchema = new mongoose.Schema({
    id: Number,
    hot: Number,
    img: String,
    price: Number,
    time: String,
    title: String
})



//使用规则创建集合
const Shop = mongoose.model('Shop', ShopSchema) //courses





// Course.find().then(res => console.log(res));

// Course.find({ _id: '5e8ab42f0947a92654009a17' }).then(res => console.log(res));

// Shop.findOne({ _id: '5e8b1a09fc74ba4c44a86cf8' }).then(res => console.log(res)).catch(err => {
//     console.log(err)
// })

// Shop.find({ hot: { $gt: 100, $lt: 1000 } }).then(res => console.log(res));

// Shop.find({title: {$in: ['千与千寻','肖申克的救赎']}}).then(res => console.log(res));

// Shop.find().select('img title -_id').then(res=>console.log(res))

// Shop.find().sort('-hot').select('hot img title -_id').then(res => console.log(res));

// Shop.find().skip(5).limit(3).sort('id').select('id img title -_id').then(res => console.log(res));

// Shop.findOneAndDelete({id:1}).then(res => console.log(res));

// Shop.deleteMany({hot:{$lt:200}}).then(res => console.log(res))

// Shop.updateOne({ id: 7 }, { title: '千与千寻2' }).then(res => console.log(res));

// Shop.updateMany({id:{$lt:5}},{hot:1280}).then(res => console.log(res));

// Shop.find({title: /寻$/}).then(res => console.log(res));

//插入数据
/* const cou = new Course({
    name: 'nodejs基础',
    author: '李威',
    isPublish: true
});

cou.save(); */

//插入数据
/* Course.create({
    name: 'javascript',
    author: 'lw',
    isPublish: false
}, (err, res) => {
    console.log(err);
    console.log(res);
}) */
//插入数据  promise方式
/* User.create({
    name: 'javascript',
    author: 'lw',
    isPublish: false
}).then(res => {
    console.log(res)
}).catch(err => {
    console.log(err);
}) */