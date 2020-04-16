const template = require('art-template');
const path = require('path');

//template是用来拼接字符串的
//模板路径，绝对路径
const views = path.join(__dirname, 'views', 'index.art')
//第一个参数路径，第二个参数要在模板中显示的数据
//返回值拼接好的字符串
const html = template(views, {
    name: '张三',
    age: 20
})

console.log(html);