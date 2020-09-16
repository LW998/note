let axios = require('axios')

axios.interceptors.request.use(config => {
    config.headers['Upgrade-Insecure-Requests'] = 1;
    config.headers['User-Agent'] = 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/84.0.4147.105 Safari/537.36';
    return config
}, err => {
    return Promise.reject(err)
})

let HttpUrl = 'https://www.1905.com/vod/list/n_1/o3u1p1.html'

// 获取页面起始页面的分类地址
function get(url, params) {
    let reg = /<p class="search-index-R">(.*?)<\/p>/ig;
    let reg1 = /<a .*?href=(?:'|")(http.*?html).*?>(.*?)<\/a>/ig;
    let ary = [];
    return new Promise((resolve, reject) => {
        axios.get(url, {
            params
        }).then(res => {
            // res.data.replace(reg, arr => {
            //     arr.replace(reg1, (...[, $1, $2]) => {
            //         let obj = {
            //             className: $2,
            //             url: $1
            //         }
            //         ary.push(obj)
            //     })
            // })
            let arr = res.data.match(reg);
            arr[0].replace(reg1, (...[, $1, $2]) => {
                let obj = {
                    className: $2,
                    url: $1
                }
                ary.push(obj)
            })
            resolve(ary)
        }).catch(err => {
            reject(err)
        })
    })
}

get(HttpUrl).then((res) => {
    console.log(res)
})