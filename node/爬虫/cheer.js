const cheerio = require('cheerio')
    //获取html文档的内容
const axios = require('axios')

axios.interceptors.request.use(config => {
    config.headers['Upgrade-Insecure-Requests'] = 1;
    config.headers['User-Agent'] = 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/84.0.4147.105 Safari/537.36';
    return config
}, err => {
    return Promise.reject(err)
})

let httpUrl = 'https://www.fabiaoqing.com/bqb/lists/type/hot/page/1.html'
axios.get(httpUrl).then(res => {
    let $ = cheerio.load(res.data)
    $('#bqblist .bqba').each((index, item) => {
        let pageUrl = $(item).attr('href')
        getPic(pageUrl)
    })
})

async function getPic(url) {
    url = 'https://www.fabiaoqing.com' + url
    let res = await axios.get(url)
    let $ = cheerio.load(res.data)
    $('#bqb .pic-content .pic_swiper .swiper-wrapper .swiper-slide a .bqppdiv1>img').each((index, item) => {
        console.log($(item).attr('src'))
    })

}