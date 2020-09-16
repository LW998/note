## 静态路由

> 配置路由相关信息(router/index.js)

```javascript
import VueRouter from 'vue-router'
import Vue from 'vue'
//导入组件
import home from '../components/home'

//通过vue.use 安装插件
Vue.use(VueRouter)

//定义路由映射表
const routes = [{
  path: '/',
  //路由重定向
  redirect: '/home'
}, {
  path: '/home',
  component: home,
}]

//注册路由
const router = new VueRouter({
  //配置路由和组件之间的映射关系
  routes,
  //设置history路由
  mode: 'history',
  linkActiveClass: "active"
})
//导出路由
export default router
```

> 配置main.js

```javascript
import Vue from 'vue'
import App from './App'
import router from './router'

Vue.config.productionTip = false

new Vue({
  el: '#app',
  //引入注册路由
  router,
  render: h => h(App)
})
```

> 定制组件 components/home.vue

```vue
<template>
  <div>
    <h2>首页</h2>
  </div>
</template>

<script>
export default {
  name: "home"
};
</script>

<style>
</style>
```

> App.vue中引入组件

```vue
<template>
  <div id="app">
    <!-- replace不允许返回 active-class="a" 设置选中样式 -->
    <!-- <router-link to="/home" tag="button" replace >首页</router-link>-->
    <button @click="homeClick">首页</button>
    <!-- 路由对应的组件显示的位置 -->
    <router-view></router-view>
  </div>
</template>
```

## 动态路由

> 配置路由相关信息(router/index.js)

```javascript
const routes = [{
  path: '/user/:userId',
  component: user
}]
```

> App.vue绑定数据

```vue
<template>
  <div id="app">
     <router-link :to="'/user/'+userId" tag="button">用户</router-link>
    <router-view></router-view>
  </div>
</template>
export default {
  name: "App",
  data() {
    return {
         userId:'lisi'
    };
  }
}
```

> user.vue显示用户数据

```vue
<template>
  <div>
    <h2>用户界面</h2>
    <p v-text="userId"></p>
    <p>{{msg}}</p>
  </div>
</template>

<script>
export default {
  name: "user",
  data() {
    return {
      msg: this.$route.params.userId
    };
  },
  computed: {
    userId() {
      //$route当前页面显示的路由
      return this.$route.params.userId;
    }
  }
};
```

##  路由懒加载

> 方式1：结合Vue的异步组件和webpack

```javascript
const home=resolve=>{
    requite.ensure(['../components/home.vue'],()=>{
        resolve(require('../components/home.vue'))
    })
}
```

> 方式2：AMD写法

```javascript
const home=resolve=>require(['../components/home.vue'],resolve)
```

> 方式3：现在常用

```javascript
const home=()=>import('../components/home')
```

## 路由嵌套

> router index.js配置

```javascript
const homeNews = () => import('../components/homeNews')
const homeMsg = () => import('../components/homeMsg')

const routes=[{
  path: '/home',
  //路由懒加载
  component: home,
  //路由嵌套
  children: [{
    //news前面不能加 /
    path: 'news',
    component: homeNews,
  }, {
    path: 'msg',
    component: homeMsg,
  }]
}]
```

> home.vue配置

```vue
 <div>
    <h2>首页</h2>
    <router-link to="/home/news" tag="button">新闻</router-link>
    <router-link to="/home/msg" tag="button">消息</router-link>
    <router-view></router-view>
  </div>
```

## 路由传递参数

> 方式1：动态路由形式

> 方式2：通过url query方式传递

```vue
//App.vue
<template>
     <router-link :to="{path:'/Profile',query:{name:'zhangsan',age:20,height:170}}" tag="button">档案</router-link>
</template>
```

```vue
//profile.vue
<template>
  <div>
    <h2>profile组件</h2>
    <p v-once>{{$route.query.name}}</p>
    <p v-once>{{$route.query.age}}</p>
    <p v-once>{{$route.query.height}}</p>
  </div>
</template>
```

> 方式3

```vue
//App.vue
<template>
<button @click="profileClick">档案</button>
</template>
<script>
    methods:{
        profileClick() {
            this.$route.path !== "/Profile" ? this.$router.push({
                path: "/Profile",
                query: { name: "zhangsan", age: 20, height: 170 }}): null;
        }
    }
</script>
```

## 路由守卫

> 全局导航守卫

```javascript
//(router/index.js)
routers=[{
  path: '/home',
  component: home,
  meta: {
    title: '首页'
  }
}]
//全局守卫
//前置钩子(进入路由指定页面前)
router.beforeEach((to, from, next) => {
  //from:上一个路由信息
  //to:当前路由信息
  document.title = to.matched[0].meta.title;
  // console.log(from, to);
  //必须调用next执行
  next();
})

//后置钩子(hook)(进入路由指定页面后)
router.afterEach((to, from) => {

})
```

> 路由独享守卫

```javascript
routers=[{
    path: '/about',
    component: about,
    meta: {
        title: '关于'
    },
    //路由独享守卫(路由跳转前)
    beforeEnter: (to, from, next) => {
        console.log('about beforeEnter')
    }]
```

> 组件内守卫

```javascript
 beforeRouteEnter(to, from, next) {
    console.log("beforeRouteEnter");
    // 在渲染该组件的对应路由前调用
    //不能获取组件实例this
    //因为当守卫执行前，组件还未创建
    next();
  },
  beforeRouteUpdate(to, from, next) {
    //在当前路由改变，但是该组件被复用时调用
    //举例来说，对于一个带有动态参数的路径 /user/:userId,在/user/1和user/2之间跳转的时候
    //渲染同样的foo组件因此会被调用
    //可以访问组件实例this
    console.log("beforeRouteUpdate");
    next();
  },
  beforeRouteLeave(to, from, next) {
    console.log("beforeRouteLeave");
    //导航离开该组件的对应路由时被调用
    //可以访问组件实例this
    next();
  }
```

> 地址：https://router.vuejs.org/zh/guide/advanced/navigation-guards.html
>
> 调用顺序
>
> 正常点击：全局守卫before--->独享守卫beforeEnter-->组件守卫beforeRouteEnter-->全局守卫after
>
> 正常离开：组件守卫beforeRouteLeave-->全局守卫before-->全局守卫after
>
> 修改URL parms:全局守卫before-->组件守卫beforeRouteUpdate-->全局守卫after

## keep-alive

> <keep-alive include="home" exclude="user,profile">
>
> include:只有匹配的组件会被缓存
>
> exclude:匹配的组件都不会被缓存