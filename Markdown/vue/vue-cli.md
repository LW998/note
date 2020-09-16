## VUE-CLI 2.x

``` shell
vue init webpack (项目名字，无中文无大写)
```

### runtimeonly和runtimecompiler的区别

> runtimecompiler运行，template--->ast(抽象语法树)--->render(函数)--->virtual(虚拟) dom--->UI
>
> runtimeonly运行，render(函数)--->virtual(虚拟) dom--->UI
>
> 如果JS文件里需要引用template就用runtimecompiler，如果用.vue文件用runtimeonly
>
> runtimeonly比runtimecompiler性能更好，代码编译后更少

## VUE-CLI 3.X

```shell
$ npm install npm install @vue/cli -g
```

```shell
vue create (项目名字，无中文无大写)
```

```shell
修改配置的三种方案
1.node_modules-->@vue-->cli-service(lib-->Service.js)
2.vue ui 打开配置UI界面
3.创建vue.config.js
```

