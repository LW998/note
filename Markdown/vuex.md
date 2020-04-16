## 使用

> 创建

```javascript
import Vue from 'vue';
import Vuex from 'vuex'
//1.安装插件
Vue.use(Vuex)
//2.创建对象
const store = new Vuex.Store({
  state: {
    //保存共享状态
    count: 100
  },
  mutations: {
     //定义操作共享状态的方法
    increment(state) {
      state.count++
    },
    decrement(state) {
      state.count--
    }
  },
  actions: {
      //做一些异步操作
  },
  getters: {
      //类似组件中的计算属性
  },
  modules: {
      //划分模块做保存
  }
})
//3.导出store对象
export default store
```
> 使用

```javascript
import store from './store';
new Vue({
  store,
})
```

## state

> 需要维护的状态信息（单一状态树）

### mutations

> 用来管理同步的state状态操作

> 创建方法

```javascript
const store = new Vuex.Store({
    state: {
        count: 100
    },
    mutations: {
        increment(state) {
            state.count++
        },
        decrement(state) {
            state.count--
        },
        incrementCount(state, count) {
            //1.普通接收方式
            //state.count += count

            //2.对象接收方式
            state.count += count.count
        },
        addStu(state, stu) {
            state.student.push(stu)
        },
        updateStu(state, payload) {
            //响应添加方法
            // Vue.set(state.student[payload.index], 'address', payload.str);
            //响应删除方法
            Vue.delete(state.student[payload.index], payload.str);
        }
    },
})
```

> 使用方法

```vue
<template>
    <button @click="minus">-</button>
    <button @click="add">+</button>
    <button @click="addCount(5)">+5</button>
    <button @click="addStu({id:15,name:'add',age:200})">添加</button>
    <button @click="updateStu">修改信息</button>
</template>
<script>
    export default {
        name: "App", 
        methods: {
            add() {
                this.$store.commit("increment");
            },
            minus() {
                this.$store.commit("decrement");
            },
            addCount(count) {
                //普通提交方式方式
                //this.$store.commit("incrementCount", count);
                //特殊提方式，提交对象
                this.$store.commit({ type: "incrementCount", count: count });
            },
            addStu(stu) {
                this.$store.commit("addStu", stu);
            },
            updateStu() {
                //响应式添加提交方式
                // this.$store.commit({ type: "updateStu", index: 1, str: "湖南" });
                //响应式删除提交方式
                this.$store.commit({ type: "updateStu", index: 1, str: "id" });
            }
        },
    }
</script>
```

## getters

> 获取state里的状态信息

创建方法

```javascript
const store = new Vuex.Store({
  state: {
 student: [{id: 11,name: 'li',age: 18},
      {id: 12,name: 'code',age: 20},
      {id: 13,name: 'vue',age: 15},
      {id: 14,name: 'java',age: 30}]
  },
 getters: {
    stu(state) {
      return state.student.filter(item => item.age >= 20);
    },
    //第一个参数state第二个参数getters本身，无第三个参数
    stuLen(state, getters) {
      return getters.stu.length;
    },
    thanStu(state) {
      // return function (x) {
      //   return state.student.filter(item => item.age >= x);
      // }
      return x => state.student.filter(item => item.age >= x);
    }
  },
})
```

> 使用

```vue
<template>
  	<p>{{$store.getters.stu}}</p>
    <p>{{$store.getters.stuLen}}</p>
    <p>{{$store.getters.thanStu(18)}}</p>
</template>
```

## actions

> 用来异步调用mutations操作state信息

> 创建

```javascript
const store = new Vuex.Store({
    mutations: {
        updateStu(state, payload) {
            // Vue.set(state.student[payload.index], 'address', payload.str);
            Vue.delete(state.student[payload.index], payload.str);
        },
    }，
    actions: {
    acUpdate(context, payload) {
    //回调函数模式
    // setTimeout(() => {
    //   context.commit(
    //       "updateStu", {
    //         index: payload.index,
    //         str: payload.str
    //       });
    //     payload.success();
    // }, 2000)
    //promise模式
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            context.commit(
                "updateStu", {
                    index: payload.index,
                    str: payload.str
                });
            resolve('删除成功');
        }, 2000)
    })
}
},
})
```

> 使用

```vue
<script>
    export default {
        name: "home",
        methods: {
            updateStu() {
                //this.$store.dispatch("acUpdate",{index: 1, str: "湖南" });
                
                //回调函数模式
                // this.$store.dispatch("acUpdate", {
                //   index: 1,
                //   str: "id",
                //   success: () => {
                //     console.log("删除成功");
                //   }
                // });
                
                //promise模式
                this.$store.dispatch("acUpdate", {
                    index: 1,
                    str: "id"}).then(res => {console.log(res)});
            }
        }
    };
</script>
```

> 调用  methods.updateStu--->actions.acUpdate--->mutations.updateStu

## modules

> 定义小模块抽离代码

```javascript
const moduleA = {
    state: {
        name: '张三',
    },
    mutations: {
        updateName(state, str) {
            state.name = str
        }
    },
    actions: {
        acUpdateName(context, str) {
            setTimeout(() => {
                context.commit('updateName', str)
            }, 1000)
        }
    },
    getters: {
        getName(state) {
            return state.name + '123';
        },
        //rootState主模块的State,rootGetter主模块的Getter
        getName2(state, getters, rootState, rootGetter) {
            return getters.getName + '000' + rootState.count + rootGetter.powerCount
        }
    }
}
const store = new Vuex.Store({
    state: {
        count: 100,
    },
    modules: {
        a: moduleA
    },
})
```

> 使用

```vue
<template>
  <div>
    <h3>{{$store.state.a.name}}</h3>
    <h3>{{$store.getters.getName}}</h3>
    <h3>{{$store.getters.getName2}}</h3>
    <button @click="updateName">修改名字</button>
    <button @click="delUpdate">延迟修改</button>
  </div>
</template>

<script>
export default {
  name: "home",
  methods: {
    updateName() {
      this.$store.commit("updateName", "李四");
    },
    delUpdate() {
      this.$store.dispatch("acUpdateName", "王五");
    }
  }
};
</script>
```

