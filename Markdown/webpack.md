##### 前端自动化部署工具

- grunt
- gulp
- fis
- webpack 1.0~4.0

## webpack 安装

为了防止全局安装出现版本冲突，我们一般都把webpack安装在本地项目中

```shell
$npm i webpack webpack-cli --save-dev
```

**webpack打包**

```shell
$ npx webpack  //基于npx实现webpack打包

或者
"scripts": {
    "build": "webpack",
 },
 
 $npm run build
```



**基础打包** 

> src:存储项目开发的源文件
>
> dist:打包后的文件目录



**webpack自定义配置 **

- webpack.config.js 或者 webpackfile.js

```javascript
//编写自定义规则
//导入内置模块path
let path = require('path');
module.exports = {
    //配置环境 development开发环境  production 生产环境 自动压缩
    mode: 'production',
    // 指定入口，从哪个文件开始打包
    entry: './src/index-my.js',
    //出口
    output: {
        //输出的文件名
        filename: 'bundle.min.js',
        //输出目录，必须是绝对目录
        //__dirname:当前文件目录
        //在当前文件夹下创建一个文件夹build
        path: path.resolve(__dirname, 'build')
    }
}
```

> 如果webpack.config.js文件名改变

```shell
$ npx webpack --config (新的文件名)

或者
"scripts": {
    "build": "webpack --config (新的文件名)",
 },
 $npm run build
```



## webpack-dev-server

> 不仅能打包还能启动服务

```shell
$ npm i webpack-dev-server
```



```javascript
//都是写在webpack.config.js文件中module.exports下
//关于webpack server的一些配置
//服务启动后默认是不关闭的，当我们修改src中的文件时，它会自动进行编译，然后刷新浏览器
    devServer: {
        //创建服务指定的端口号
        port: 3000,
        //显示编译的进度
        progress: true,
        //指定当前服务处理资源的目录
        contentBase: './build',
        //编译完成之后自动打开浏览器
        open: true
    }
```

> webpack.config.js文件名未改变

```shell
$ npx webpack-dev-server

Ctrl+C 结束服务

package.json文件配置
"scripts": {
"serve": "webpack-dev-server",
}

$ npm run serve
```

> webpack.config.js文件名改变

```shell
$ npx webpack-dev-server --config (新文件名)

package.json文件配置
"scripts": {
"serve": "webpack-dev-server --config webpack.config.development.js",
}

$ npm run serve
```



## html-webpack-plugin

```shell
$ npm i html-webpack-plugin
```

>webpack.config.js配置

```javascript
let HtmlWebpackPlugin = require('html-webpack-plugin');

plugins: [
    new HtmlWebpackPlugin({
        //不指定模板默认新建一个html引入编译后的js
        //指定需要编译的html文件作为编译后的模板
        template: './src/index.html',
        //输出的文件名
        //index.[hash].html生成的html名字也是带hash的
        filename: 'index.html',
        //让我们引入js后面加入hash戳(清除缓存),真实项目中我们一般都是每次编译生成不同的js文件引入,而不是加上hash戳
        // hash: true,
        //控制html压缩
        minify: {
            //去掉空格和折行
            collapseWhitespace: true,
            //把注释都给删掉
            removeComments: true,
            //去掉对象的双引号
            removeAttributeQuotes: true,
            //去掉没有值的属性
            removeEmptyAttributes: true
        }
    })
]
```



## webpack中的加载器loader （处理样式）

```shell
$  npm i css-loader style-loader less less-loader
```

```javascript
//css需要在入口的my.JS中导入后才可以使用
require('./index.css')
```

> 处理浏览器兼容的loader

```shell
$npm i postcss-loader
```

