var config = require('../utils/dbconfig');

let getRecommend = async (req, res) => {
    let sql = `SELECT image,title,mlsDiscountPrice,iid FROM goods where type in ('news','pop','sell') order by iid desc limit 12,18`;
    let sqlArr = [];
    let result = await config.SqlConnect(sql, sqlArr);
    res.send({
        'data': result
    })
}
module.exports = {
    getRecommend
}