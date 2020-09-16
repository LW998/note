var config = require('../utils/dbconfig');

let homeData = async (req, res) => {
    let sqlB = `select image,link from goods where type=?`;
    let sqlArrB = ['swiper'];
    //登录成功
    let resultB = await config.SqlConnect(sqlB, sqlArrB);

    let sqlR = `select image,link,title from goods where type=?`;
    let sqlArrR = ['recommend'];
    //登录成功
    let resultR = await config.SqlConnect(sqlR, sqlArrR);
    res.send({
        'banner': resultB,
        'recommend': resultR
    })
}
let goodsData = async (req, res) => {
    let {
        type,
        page
    } = req.query;
    if (type === undefined || page === undefined) {
        res.send({
            'status': 'fail',
            'data': [],
            'msg': "传入的参数不正确"
        })
        return;
    }
    let sql = 'select image,title,price,mlsDiscountPrice,iid from goods where type=? limit ?,?';
    let begin = ((Number(page) - 1) * 20);
    let sqlArr = [type, begin, 20];
    let result = await config.SqlConnect(sql, sqlArr);
    let status = result.length !== 20 ? 'fail' : 'success'
    res.send({
        'status': status,
        'data': result
    })
    console.log(res)
}



module.exports = {
    homeData,
    goodsData,
}