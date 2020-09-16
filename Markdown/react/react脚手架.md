### 安装

```shell
$ npm install create-react-app -g
```

### 创建项目

```shell
create-react-app [项目名称]
#项目名称中不能出现大写字母、中文汉字、特殊字符
```

### webpack配置

> 在全局暴露webpack配置

```shell
$npm run eject
#这个操作是不可逆转的，暴露出来就不能隐藏
#如果当前项目基于GIT管理，需要把当前的项目提交到历史区再操作
```

> 配置less

```shell
npm i less less-loader --save-dev
#安装less

```

```javascript
//webpackconfing.js 48行修改
const cssRegex = /\.(css|less)$/;
// 111行加入配置
{
    test: /\.less$/,
    loader: require.resolve('less-loader')
}
```

> 开启https协议模式

```shell
set HTTPS=true&&npm start
```

> 修改端口号

```shell
set PORT=8000&&npm start
```

```shell
set HTTPS=true&&set PORT=8000&&npm start
```



