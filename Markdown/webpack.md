##### 前端自动化部署工具

- grunt
- gulp
- fis
- webpack 1.0~4.0

## webpack 安装

为了防止全局安装出现版本冲突，我们一般都把webpack安装在本地项目中

```shell
npm i webpack webpack-cli --save-dev
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
npm i webpack-dev-server --save-dev
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
 npm i html-webpack-plugin --save-dev
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
npm i css-loader style-loader less less-loader --save-dev
```

```javascript
//css需要在入口的my.JS中导入后才可以使用
require('./index.css')
```

> 处理浏览器兼容自动加前缀的loader

```shell
npm i autoprefixer postcss-loader --save-dev
```

```javascript
//使用加载器loader处理规则
module: {
    rules: [{
        //通过正则表达式匹配当前加载器处理那些文件
        test: /\.(css|less)$/i,
        //控制使用哪一个加载器
        //顺序从下到上执行
        use: [
            //把编译好的css插入到页面的head中(内嵌式样式)
            "style-loader",
            //编译@import/url()这种语法的
            "css-loader",
            //设置前缀
            {
                loader: "postcss-loader",
                options: {
                    ident: "postcss",
                    plugins: [
                        require('autoprefixer')
                    ]
                }
            },
            //编译less
            "less-loader",
        ]
    }]
}
```

## mini-css-extract-plugin 抽离css内容

```shell
npm i mini-css-extract-plugin optimize-css-assets-webpack-plugin uglifyjs-webpack-plugin --save-dev
```

> webpack.config.js

```javascript
//抽离css插件
let MiniCssExtractPlugin = require('mini-css-extract-plugin');
//压缩css插件
let OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin');
//压缩JS插件
let UglifyjsWebpackPlugin = require('uglifyjs-webpack-plugin');

//配置优化规则
optimization: {
    //=>压缩优化
    minimizer: [
        //压缩CSS
        new OptimizeCssAssetsWebpackPlugin(),
        //配置后production环境不再自动压缩JS,需要引入UglifyjsWebpackPlugin压缩JS
        new UglifyjsWebpackPlugin({
            //是否使用缓存
            cache: true,
            //是否并发编译
            parallel: true,
            //启动源码映射(方便调试)
            sourceMap: true
        }),
    ]
},
    plugins:[ new MiniCssExtractPlugin({ //=>抽取CSS
        //指定输出的文件名
        filename: 'main.min.css',
    })
            ]
```

## 基于babel实现ES6的转换和ESLint语法检测

```shell
npm i babel-loader @babel/core @babel/preset-env @babel/plugin-proposal-class-properties @babel/plugin-proposal-decorators @babel/plugin-transform-runtime --save-dev
```

```shell
处理兼容ES7语法
npm i --save @babel/runtime @babel/polyfill
```

```shell
检测语法规范
npm i eslint eslint-loader --save-dev
```

## 暴露全局loader

```shell
npm i expose-loader --save-dev
```

```javascript
//内联加载器
import jquery from 'expose-loader?$!jquery';
console.log(window.$)
```

> webpack.config.js

```javascript
new webpack.ProvidePlugin({ //=>向每一个模块中注入全局变量
            '$': 'jquery'
        })
```

## 图片处理

```shell
npm i file-loader url-loader html-withimg-loader --save-dev
```

```javascript
import img1 from './static/2.jpg';
let img2 = require('./static/2.jpg');
//在webpack打包编译的环境下需要先把图片导入进来，然后使用(相对地址需要导入，绝对地址不用)
let img = new Image();
img.src = img1;
document.body.appendChild(img);
```

> webpack.config.js

```javascript
module: {
    rules: [{
        // //图片处理
        test: /\.(jpg|png|jpeg|gif|ico|webp|bmp)$/i,
        use: [{
            loader: 'url-loader',
            options: {
                //只要是图片是小于200kb的，在处理的时候直接给转化成BASE64
                limit: 200 * 1024,
            }
        }]
    }, {
        //处理HTML文件中导入的img图片
        test: /\.(html|htm|xml)$/i,
        use: ["html-withimg-loader"]
    }}
            }]
}
```

## 实现文件分目录发布

```javascript
output: {publicPath: './'}
module: {
    rules: [{
        // //图片处理
        test: /\.(jpg|png|jpeg|gif|ico|webp|bmp)$/i,
        use: [{
            loader: 'url-loader',
            options: {
                // //只要是图片是小于200kb的，在处理的时候直接给转化成BASE64
                limit: 1 * 1024,
                //控制打包后图片所在的目录
                outputPath: 'images'
            },
        }]
    }]
}
```

## 处理VUE

```shell
npm i vue-loader vue-template-compiler --save-dev
```
> webpack.config.js

```javascript
let VueLoaderPlugin = require('vue-loader/lib/plugin');

```

