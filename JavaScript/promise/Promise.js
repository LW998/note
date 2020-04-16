class Promise {
    constructor(exciterCallBack) {
        //存储状态
        this.status = 'pending';
        //存储resolve或者reject传递的值
        this.value = undefined;
        //存储resolve传递的值
        this.fulfilledAry = [];
        //存储reject传递的值
        this.rejectedAry = [];
        let resolveFn = result => {
            //设置定时器是为了把resolve和reject函数执行放到等待队列中
            //如果没有放到等待队列会是的没有执行下面的then直接执行方法导致报错
            let timer = setTimeout(() => {
                clearTimeout(timer);
                if (this.status !== 'pending') return;
                this.status = 'fulfilled';
                this.value = result;
                //item是then后面的resolve函数
                this.fulfilledAry.forEach(item => item(this.value));
            }, 0)
        };
        let rejectFn = reason => {
            let timer = setTimeout(() => {
                clearTimeout(timer);
                if (this.status !== 'pending') return;
                this.status = 'rejected';
                this.value = reason;
                //item是then后面的reject函数
                this.rejectedAry.forEach(item => item(this.value));
            }, 0)
        }
        //捕获异常
        try {
            //把两个函数作为参数给promise实例执行
            //判断exciter函数中是否抛出异常
            exciterCallBack(resolveFn, rejectFn)
        } catch (err) {
            //有异常信息按reject处理
            rejectFn(err);
        }
    }
    //fulfilledCallBack,rejectedCallBack是then里面成功失败执行的方法
    then(fulfilledCallBack, rejectedCallBack) {
        //=>处理不传递的状况
        //如果resolve不传(传NULL)，直接把上一次resolve的值给返回给下一次执行的参数
        typeof fulfilledCallBack !== 'function' ? fulfilledCallBack = result => result : null;
        //如果reject不传(传NULL)，把错误信息承接给下一个reject
        typeof rejectedCallBack !== 'function' ? rejectedCallBack = reason => {
            throw new Error(reason instanceof Error ? reason.message : reason);
        } : null;

        //=>返回一个新的PROMISE实例
        return new Promise((resolve, reject) => {
            //用一个匿名函数来保存传递进来的fulfilledCallBack和rejectedCallBack并push到相应的队列中
            this.fulfilledAry.push(() => {
                try {
                    //x接收上一次执行resolve的返回值的结果传入fulfilledCallBack的执行结果
                    let x = fulfilledCallBack(this.value);
                    //判断传递进来的是不是promise实例
                    x instanceof Promise ? x.then(resolve, reject) : resolve(x);
                } catch (err) {
                    reject(err);
                }
            });
            this.rejectedAry.push(() => {
                try {
                    //x接收上一次执行reject的返回值的结果传入fulfilledCallBack的执行结果
                    let x = rejectedCallBack(this.value);
                    //判断传递进来的是不是promise实例
                    x instanceof Promise ? x.then(resolve, reject) : resolve(x);
                } catch (err) {
                    reject(err);
                }
            });
        });
        //把then里面传入的函数作为形参赋值给方法数组
        // this.fulfilledAry.push(fulfilledCallBack);
        // this.rejectedAry.push(rejectedCallBack);
    }
    catch (rejectedCallBack) {
        return this.then(null, rejectedCallBack);
    }
    static all(promiseAry = []) {
        return new Promise((resolve, reject) => {
            //记录成功的个数
            let index = 0,
                //存储结果集
                result = [];
            for (let i = 0; i < promiseAry.length; i++) {
                //每一个需要处理的promise实例
                promiseAry[i].then(val => {
                    index++;
                    //索引需要和promiseAry对应上，保持结果和数组顺序一致
                    result[i] = val;
                    //结果集的长度
                    if (index === promiseAry.length) {
                        resolve(result)
                    }
                }, reject);
            }
        })
    }
}
module.exports = Promise;