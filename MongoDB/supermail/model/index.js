const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/supermail', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('数据库连接成功');
}).catch(err => {
    console.log(err, '数据库连接失败');
})

const popSchema = mongoose.Schema({
    item_wx_url: String,
    timeLimitCutPrice: String,
    discountPrice: String,
    shopName: String,
    title: String,
    duration: String,
    itemSale: String,
    limit_image: String,
    price: String,
    shop_url: String,
    camp_image: String,
    mlsDiscountPrice: String,
    startTime: Number,
    item_h5_url: String,
    image: String,
    itemTag: String,
    item_id: String,
    shop_xcx_url: String,
    shopLogo: String,
    shopImage: String,
    shop_h5_url: String,
    _system_data_set_row_id: Number,
    itemImage: String,
    shop_wx_url: String,
    shopTag: String,
    shop_id: String,
    item_url: String,
    endTime: String,
    item_xcx_url: String,
    acm: String
});

const detailSchema = mongoose.Schema({
    iid: String,
    result:Array
})



const pop = mongoose.model('Pop', popSchema)
const news = mongoose.model('New', popSchema)
const sell = mongoose.model('Sell', popSchema)
const detail=mongoose.model('Detail',detailSchema)

module.exports = {
    pop,
    news,
    sell,
    detail
}