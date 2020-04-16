import qs from 'qs';

let baseURL = '';
let baseURLArr = [{
    type: 'development',
    url: 'http://127.0.0.1:9000'
}, {
    type: 'test',
    url: 'http://127.0.0.1:8000'
}, {
    type: 'production',
    url: 'http://www.baidu.com'
}];
baseURLArr.forEach(item => {
    if (process.env.NODE_ENV === item.type) {
        baseURL = item.url;
    }
});
export default function request(url, options = {}) {
    url = baseURL + url;
    //get请求处理
    !options.method ? options.method = 'GET' : null;
    if (options.hasOwnProperty('params')) {
        if (/^(GET|DELETE|HEAD|OPTIONS)$/i.test(options.method)) {
            const ask = url.include('?') ? '&' : '?';
            url += `${ask}${qs.stringify(params)}`;
        }
        //fetch不支持params需要删除
        delete options.params;
    }
    //合并配置项
    options = Object.assign({
        //允许跨域携带资源凭证 same-origin同源可以 omit都拒绝 include都可以
        credentials: 'include',
        //设置请求头
        headers: {}
    }, options)
    options.headers.Accept = 'application/json';

    //token的校验
    const token = localStorage.getItem('token');
    token && (options.headers.Authorization = token);

    //post请求处理
    if (/^(POST|PUT)$/i.test(options.method)) {
        !options.type ? options.type = 'urlencoded' : null;
        if (options.type === 'urlencoded') {
            options.headers['Content-Type'] = 'application/x-www-form-urlencoded';
            options.body = qs.stringify(options.body);
        }
        if (options.type === 'json') {
            options.headers['Content-Type'] = 'application/json';
            options.body = JSON.stringify(options.body);
        }
    }
    return fetch(url, options).then(response => {
        //返回结果是非200的状态码
        if (!/^(2|3)\d{3}$/.test(response.status)) {
            switch (response.status) {
                case 401: //权限不足，需要登录
                    break;
                case 403: //服务器拒绝执行(token或者session过期)
                    break;
                case 404: //找不到页面
                    break;
            }
            return Promise.reject(response);
        }
        //把服务器返回的数据都转化为JSON格式数据
        return response.json();
    }).catch(error => {
        //服务器结果都没返回
        if (!window.navigator.online) {
            //断网处理:跳转到断网页面
            return;
        }
        return Promise.reject(error);
    });
};