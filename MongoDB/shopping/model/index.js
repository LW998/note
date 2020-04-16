const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/shopping', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('数据库连接成功');
}).catch(err => {
    console.log(err, '数据库连接失败');
})

const slideSchema = new mongoose.Schema({
    image: String,
    goodsId: String
});

const CategorySchema = new mongoose.Schema({
    mallCategoryId: String,
    mallCategoryName: String,
    bxMallSubDto: [{
        mallSubId: String,
        mallCategoryId: String,
        mallSubName: String,
    }],
    image: String
})

const recommendSchema = new mongoose.Schema({
    image: String,
    mallPrice: Number,
    goodsId: String,
    price: Number,
    goodsName: String
})

const floorSchema = new mongoose.Schema({
    goodsId: String,
    image: String
})

const hotSchema = new mongoose.Schema({
    mallPrice: String,
    image: String,
    goodsId: String,
    price: Number,
    name: String
})

const hot = mongoose.model('hot', hotSchema)
const floor = mongoose.model('floor', floorSchema)
const recommend = mongoose.model('Recommend', recommendSchema)
const category = mongoose.model('Category', CategorySchema);
const slide = mongoose.model('Slide', slideSchema);

module.exports = {
    slide,
    category,
    recommend,
    floor,
    hot
}