```shell
//创建本地仓库
$git init 
//放入暂存区
$git add .
$git add -A
//放入历史区
$git commit -m'描述信息'
//查看提交记录
$git log
//查看所有历史记录(包括历史区回滚后的信息)
$git reflog
//查看状态 红色:工作区 绿色：暂存区 看不见文件信息:历史区
$git status
//从暂存区删除
$git rm <file>

//历史版本回退
$git reset --hard 版本号前7位
```

```shell
//创建远程仓库
$git remote add mingzi https://github.com/....
//查看仓库
$git remote -v
//上传远程仓库
$git push mingzi master
//下拉远程仓库
$git pull mingzi master
```

```shell
//真实项目克隆远程仓库
$git clone https://github.com/.... bieming[可以不设置，默认远程仓库名]
```

### NPM

```shell
$ npm install xxx 把模块安装在当前项目中（node_models）
$ npm install xxx -g 把模块安装在全局环境中
$ npm i xxx@1.0.0 安装指定版本号的模块
$ npm view xxx versions >xxx.version.json 查看某个模块的版本信息（输出在JSON文件中）
$ npm init -y 初始化当前项目的配置依赖清单（项目文件名不能中文和大写字母和特殊符号）
//创建成功后在当前项目中生成package.json 清单文件
dependencies：生产依赖模块（开发和项目部署的时候都需要）
$ npm i xxx -save 把模块保存在清单生产依赖中
$ npm i xxx -save-dev 把模块保存在清单开发依赖中
$ npm install 跑环境，按照清单所需的模块

//安装在全局可以使用命令对任何的项目进行操作
//安装在本地不能基于DOS窗口命令操作
$ npm root -g 查看全局按照模块的目录
$ npm unistall xxx
$ npm unistall xxx -g 卸载安装过的模块
```

### 一个项目的开始流程：

>1.创建项目文件夹
>
>2.把他作为一个新的仓库进行代码管理（可以基于$ git clone 把远程仓库克隆下来即可）
>
>3.初始化模块配置清单package.json：$npm init -y
>
>4.安装所需要的模块：$npm install jquery bootstrap....
>
>5.正常开发
>
>6.开发中：可能需要在本地配置命令去完成一些功能（例如：LESS可以在package.json中的“scripts”中配置 ："less": "lessc 12.less 12.css -x"）
>
>```json
>"scripts": {
>"LW": "lessc 12.less 12.css -x"
>},
>```
>
>需要编译的时候执行
>
>```shell
>$ npm run LW
>```
>7.开发中我们需要基于git把文件进行管理，生成对应的历史版本，提交到暂存区、历史区。在上传远程仓库的时候项目中有很多内容是不需要提交的，例如：node_models....,不需要提交，我们生成一个.gitignore忽略文件。
>
>由于每次git提交的时候，我们都不去提交node_models，所以团队协作开发中，我们每次拉下来程序后，都需要“跑环境”：执行  $npm install,按照项目中的package.json中的依赖信息，把缺失的模块都安装一遍
>
>

### yran

```shell
$ yarn init -y
//添加模块
$ yarn add xxx
//移除模块
$ yarn remove xxx
```

### nrm

> 基于nrm切源 淘宝镜像下载模块，速度更快

```shell
//查看当前有哪些源
$ nrm ls
//切换源镜像
$ nrm use xxx
```





