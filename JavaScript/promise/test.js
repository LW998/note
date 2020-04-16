let Promise = require('./myPromise.js')

let p1 = new Promise((resolve, reject) => {
    setTimeout(() => {
        resolve(100);
    }, 10)
});

let p2 = new Promise((resolve, reject) => {
    setTimeout(() => {
        reject(200);
    }, 80)
});
let p3 = new Promise((resolve, reject) => {
    setTimeout(() => {
        resolve(300);
    }, 20)
});

Promise.all(([p1, p2, p3])).then(result => {
    //所有的promise都执行成功才会执行
    //result中分别存放每一个实例的返回值，而且和传入的顺序是一样的
    console.log(result)
}).catch(reason => {
    //只要有一个失败就会执行这个方法，而且不再继续下面的操作
    console.log(reason)
})


/* let p1 = new Promise((resolve, reject) => {
    resolve(100);
    /!*setTimeout(() => {
           Math.random() > 0.5 ? resolve(100) : reject(200);
       }, 1000) *!/
    // throw new Error('ERROR')
});

let p2 = p1.then(res => {
    // throw new Error('error')
    return res += 100;
}, reason => {
    return reason += 100;
});
p2.then(res => {
    console.log(res);
    // throw new Error('error')
}).catch(reason => {
    console.log(reason)
})
console.log(3); */