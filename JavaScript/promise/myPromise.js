class myPromise {
    constructor(excitorCallBack) {
        this.status = 'pending';
        this.value = undefined;
        this.fulfilledAry = [];
        this.rejectedAry = [];
        let resolveFn = res => {
            let timer = setTimeout(() => {
                clearTimeout(timer);
                if (this.status !== 'pending') return;
                this.status = 'resolve';
                this.value = res;
                this.fulfilledAry.forEach(item => item(this.value));
            }, 0)
        }
        let rejectFn = reason => {
            let timer = setTimeout(() => {
                clearTimeout(timer);
                if (this.status !== 'pending') return;
                this.status = 'reject';
                this.value = reason;
                this.rejectedAry.forEach(item => item(this.value));
            }, 0)
        }
        try {
            excitorCallBack(resolveFn, rejectFn);
        } catch (err) {
            rejectFn(err);
        }

    }
    then(fulfilledCallBack, rejectedCallBack) {
        typeof fulfilledCallBack !== 'function' ? fulfilledCallBack = res => res : null;
        typeof rejectedCallBack !== 'function' ? rejectedCallBack = reason => {
            throw new Error(reason instanceof Error ? reason.message : reason)
        } : null;

        return new myPromise((resolve, reject) => {
            this.fulfilledAry.push(() => {
                try {
                    let x = fulfilledCallBack(this.value);
                    x instanceof myPromise ? x.then(resolve, reject) : resolve(x);
                } catch (err) {
                    reject(err)
                }
            })
            this.rejectedAry.push(() => {
                try {
                    let x = rejectedCallBack(this.value);
                    x instanceof myPromise ? x.then(resolve, reject) : resolve(x);
                } catch (err) {
                    reject(err)
                }
            })
        })
    }
    catch (rejectedCallBack) {
        return this.then(null, rejectedCallBack);
    }
    static all(promiseAry = []) {
        return new myPromise((resolve, reject) => {
            let index = 0,
                result = [];
            for (let i = 0; i < promiseAry.length; i++) {
                promiseAry[i].then(val => {
                    index++;
                    result[i] = val;
                    if (index === promiseAry.length) {
                        resolve(result)
                    }
                }, reject)
            }
        })
    }
}

module.exports = myPromise;