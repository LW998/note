~ function (window) {
    class Subscribe {
        constructor() {
            this.pond = [];
        }
        add(fn) {
            if (typeof fn !== 'function') return;
            let {
                pond
            } = this;
            if (pond.length === 0) {
                pond.push(fn);
                return;
            }
            let isExist = false;
            for (let i = 0; i < pond.length; i++) {
                let item = pond[i];
                fn === item ? isExist = true : null;
            };
            !isExist ? pond.push(fn) : null;
        }
        remove(fn) {
            if (typeof fn !== 'function') return;
            let {
                pond
            } = this;
            if (pond.length === 0) return;
            for (let i = 0; i < pond.length; i++) {
                let item = pond[i];
                if (fn === item) {
                    // pond.splice(i,1);//=>我们不能基于SPLICE删除，因为这种删除方式会改变原有的数组，

                    //例如：我们通知方法执行，当执行到FN3的时候（FIRE循环索引是2），但是基于SPLICE把FN1 / FN2删除后，
                    //原始数组后面的项都向前提取两位，此时FIRE中继续遍历下一个方法（索引3），已经找不到和他匹配的那一项了

                    //=>让当前项赋值为NULL即可(这样函数移除掉了,但是此时的数组结构没有改变，不会出现数组塌陷的问题)
                    pond[i] = null; //=>item=null是不行的
                };
            }
        }
        fire(...arg) {
            let {
                pond
            } = this;
            for (let i = 0; i < pond.length; i++) {
                let item = pond[i];
                //=>REMOVE机制处理了,此时ITEM不一定都是函数了,还有可能是NULL
                //NULL的话不执行，而且最好是把这一项删除掉
                if (item === null) {
                    pond.splice(i, 1);
                    i--;
                    continue;
                }
                item(...arg);
            }
        }
    }
    window.Subscribe = Subscribe;
}(window)