### GET请求

```javascript
let promise = axios.get('http://127.0.0.1:8080/users',{
    params: {
        name: 'aa',
        g: 1
    }
});
//获取的结果是个对象，
    //data：从服务器获取的响应主体内容
    //headers：响应头信息
    //request：创建的ajax实例
    //config:基于axios发送请求后做的配置项
promise.then(res => {
    console.log(res.data); //=>从服务器获取的响应主体内容
}).catch(msg => {
    console.log(msg); //=>请求失败的原因
})
```

### POST 请求

```javascript
axios.post('json/data.json',{
    name: 'aa',
    g: 1
}).then(res => {
    console.log(res);
}).catch(msg => {
    console.log(msg);
})
```

### 发送多次请求

```javascript
axios.get('json/data.json').then(res => {
    let {data,headers: {date,etag}} = res;
    console.log(data, date);
    return axios.get('json/shop.json');
}).then(res => {
    let {data} = res;
    console.log(data);
    return axios.head('json/data.json')
}).then(res => {
    let {headers: {date}} = res;
    console.log(date);
})
```

### 同时发送多个请求

```javascript
//sendAry存放三个ajax请求的promise实例
let sendAry = [
    axios.get('json/shop.json'),
    axios.get('json/data.json'),
    axios.head('json/data.json')
]
axios.all(sendAry).then(axios.spread((resA, resB, resC) => {
    //resA,resB,resC三次请求的结果
    console.log(resA.data, resB.data, resC.headers.date);
}));
//也可以结构出三次的结果
axios.all(sendAry).then(
    res => {
        let {
            0: {data},
            1: {data: data1},
            2: {headers: {date}}
        } = res;
        console.log(data, data1, date);
    }
) 
```

### 拦截器

```javascript
//默认请求地址
axios.defaults.baseURL = 'http://127.0.0.1:8080';

//跨域访问需要发送cookie
axios.defaults.withCredentials = true;

//设置请求中基于请求主体向发送内容的格式，默认是RAW，项目中常用的是UrlEncoded格式
axios.defaults.headers['Content-Type'] = 'application/x-www-form-urlencoded'

//响应拦截器
axios.interceptors.response.use(response=>{
    return respomse.data;
},error=>{
    ler{
        response
    }=error;
    if(response){
        //服务器返回结果了
        switch(response.status){
            case 401: //权限不足，需要登录
                break;
            case 403: //服务器拒绝执行(token或者session过期)
                break;
            case 404: //找不到页面
                break;
        }
    }else{
        //服务器结果都没返回
        if(!window.navigator.online){
            //断网处理:跳转到断网页面
            return;
        }
        return Promise.reject(error);
    }
});

//默认状态码
//默认只有2开头的走成功，其他走失败，所以需要设置
axios.defaults.validateStatus = status => /^(2|3)\d{2}$/.test(status);

//请求拦截器把传递的data装换格式
axios.defaults.transformRequest = data => {
    //data：请求主体中需要传递给服务器的内容
    let str = ``;
    for (let key in data) {
        if (data.hasOwnProperty(key)) {
            str += `${key}=${data[key]}&`;
        }
    }
    return str.substring(0, str.length - 1);
}

//设置最大请求时间
axios.defaults.timeout = 3000;
```

### 使用单独配置

```javascript
const instance1 =axios.create({
    baseURL:"http://127.0.0.1:8000",
    timeout:5000
})

instance1({
    //默认get请求
    url:'/home/mutildata'
}).then(res=>{
    console.log(res);
})

instance1({
    //默认get请求
    url:'/home/data',
    //参数
    params:{
        type:'pop',
        page:1
    }
}).then(res=>{
    console.log(res);
});

const instance2=axios.create({
    baseURL:'http://127.0.0.1:3000',
    timeout:10000,
    headers:{}
})

instance2({
    url:'/cart/data',
    method:'post'
    //参数
    data:{
        type:'aaa',
        page:1
    }
})

```

### axios封装

**封装方法一**

```javascript
import axios from 'axios'
export function request(config,success,failure){
    //创建实例
    const instance1 =axios.create({
        baseURL:"http://127.0.0.1:8000",
        timeout:5000
    })
    //发送请求
    instance(config).then(res=>{
        success(res);
    }).catch(err=>{
        failure(err);
    })
}
```

> 使用

```javascript
import {request} from './api/ruquest'
request({
    url:'/home/data',
    //参数
    params:{
        type:'pop',
        page:1
    },
},res=>{
    //传给success函数
    console.log(res);
},err=>{
    //传给failure函数
    console.log(err);
})
```

**封装方法二**

```javascript
import axios from 'axios'
export function request(config){
    return new Promise((resolve,reject)=>{
        //创建实例
        const instance1 =axios.create({
            baseURL:"http://127.0.0.1:8000",
            timeout:5000
        })
        //发送请求
        instance(config).then(res=>{
            resolve(res)
        }).catch(err=>{
            reject(err)
        })
    })
}
```

> 使用

```javascript
import {request} from './api/ruquest'
request({
    url:'/home/data',
    //参数
    params:{
        type:'pop',
        page:1
    },
}).then(res=>{
    console.log(res);
}).catch(err=>{
    console.log(err);
})
```

**封装方法三**

```javascript
import axios from 'axios'
export function request(config){
    //创建实例
    const instance1 =axios.create({
        baseURL:"http://127.0.0.1:8000",
        timeout:5000
    });
    //使用拦截器
    instance1.interceptors.ruquest.use(req=>{
        console.log(req)
        return req
    },err=>{
         console.log(err)
    })
    instance1.interceptors.response.use(function onFulfilled(response) {
        return response.data;
    }),
        function onRejected(reason) {
        return Promise.reject(reason);
    };
    //发送请求
    return instance(config)
}
```

> 使用

```javascript
import {request} from './api/ruquest'
request({
    url:'/home/data',
    //参数
    params:{
        type:'pop',
        page:1
    },
}).then(res=>{
    console.log(res);
}).catch(err=>{
    console.log(err);
})
```

