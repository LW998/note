## 连接数据库

> 如果没有这个数据库会自动创建，但是localhost不能写错

```javascript
mongoose.connect('mongodb://localhost/[数据库地址]', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('数据库连接成功')
}).catch(err => {
    console.log(err, '数据库连接失败')
})
```

> 创建数据库集合规则

```javascript
//创建集合规则
const courseSchema = new mongoose.Schema({
    name: String,
    author: String,
    isPublish: Boolean,
})
//使用规则创建集合,首字母大写创建的数据库名称是courses
const Course = mongoose.model('Course', courseSchema) //courses
```

### 插入数据

+ 方式1

```javascript
const cou = new Course({
    name: 'nodejs基础',
    author: '李威',
    isPublish: true
});
cou.save();
```

+ 方式2

```javascript
Course.create({
    name: 'javascript',
    author: 'lw',
    isPublish: false
}, (err, res) => {
    console.log(err);
    console.log(res);
})
```

+ 方式3

```javascript
Course.create({
    name: 'javascript',
    author: 'lw',
    isPublish: false
}).then(res => {
    console.log(res)
}).catch(err => {
    console.log(err);
})
```

#### mongoDB 导入数据

```shell

mongoimport -d 数据库名称 -c 集合名称 -file 要导入的数据文件路径

导入JSON数据
mongoimport -d play  -c shop --jsonArray ./shop.json

mongoimport -d play -c user -file ./user.json
```

### 查询数据

> 查询全部

```javascript
const ShopSchema = new mongoose.Schema({
    id: Number,
    hot: Number,
    img: String,
    price: Number,
    time: String,
    title: String
})
//使用规则创建集合
const Shop = mongoose.model('Shop', ShopSchema)

Shop.find().then(res => console.log(res));
```

> 查询单条数据 返回数组

```javascript
Shop.find({_id:'5e8b1a09fc74ba4c44a86cf8'}).then(res => console.log(res));
//模糊查询
Shop.find({title: /寻$/}).then(res => console.log(res));
```

```javascript
//不传递默认返回第一条数据
//返回的是一个对象
Shop.findOne({_id:'5e8ab42f0947a92654009a17'}).then(res => console.log(res));
```

> 查询大于小于某个条件的数据

```javascript
//$gt 大于 $lt:小于
//$gte（大于或等于）与 $lte（小于或等于）
Shop.find({ hot: { $gt: 100, $lt: 1000 } }).then(res => console.log(res));
```

> 查询包含某个条件的数据

```javascript
Shop.find({title: {$in: ['千与千寻','肖申克的救赎']}}).then(res => console.log(res));
```

> 查询指定字段

```javascript
//不想查询的字段在前面加 -
Shop.find().select('img title -_id').then(res=>console.log(res))
```

> 根据字段升降序排序

```javascript
//升序
Shop.find().sort('hot').then(res=>console.log(res))
//降序
Shop.find().sort('-hot').then(res=>console.log(res))
```

> limt 和 skip

```javascript
//skip跳过几条数据  limit 显示几条数据
Shop.find().skip(5).limit(3).then(res=>console.log(res))
```

### 删除数据

> 删除单个

```javascript
Shop.findOneAndDelete({id:1}).then(res => console.log(res));
//res删除的值
```

> 删除多个

```javascript
Shop.deleteMany({hot:{$lt:200}}).then(res => console.log(res))

//res=>{ n: 1, ok: 1, deletedCount: 1 }
```

### 更新数据

> 更新单个数据

```javascript
//第一个参数更新的条件，第二个参数更新的值
Shop.updateOne({ id: 7 }, { title: '千与千寻2' }).then(res => console.log(res));
//res=>{ n: 1, nModified: 1, ok: 1 }
```

> 更新多个数据

```javascript
//第一个参数更新的条件，第二个参数更新的值
Shop.updateMany({id:{$lt:5}},{hot:1280}).then(res => console.log(res));
//res=>{ n: 3, nModified: 3, ok: 1 }
```

### 验证规则

```javascript
const postSchema = new mongoose.Schema({
    hot: {
        type: Number,
        //required设置必传值
        //第二个参数自定义提示信息
        required: [true, '请输入数据'],
        //设置最小值
        min: [100, '不能小于100'],
        //设置最大值
        max: [200, '不能大于200'],
    },
    name: {
        //设置类型
        type: String,
        required: [true, '请输入数据'],
        //设置最小长度
        minlength: [3, '长度不能小于3'],
        //设置最大长度
        maxlength: [8, '长度不能大于8'],
        //去除首尾空格
        trim: true
    },
    time: {
        type: Date,
        //默认值
        default: Date.now
    },
    category: {
        type: String,
         //枚举 列出当前字段可以拥有的值
        enum: {
            values: ['html', 'css', 'js'],
            message: '分类需要是html、css或者js'
        }
    },
    author: {
        type: String,
        required:true,
        validate: {
            //设置验证规则
            validator: v => {
                //返回布尔值 true验证成功，false验证失败 ，v要验证的值
                return v && v.length > 4
            },
            //自动义错误信息
            message: '传入的值不符合验证规则'
        }
    }
})
const Post = mongoose.model('Post', postSchema);

Post.create({hot: 100,name: '哈哈哈',category: 'js',author:'aaaaa'}).then(res => console.log(res)).catch(err => {
    const e = err.errors;
    for (let attr in e) {
        console.log(e[attr]['message']);
    }
});
```

### 集合关联

```javascript
//用户集合
const User = mongoose.model('User', mongoose.Schema({
    name: {
        type: String,
        required: true
    }
}));
//文章集合
const Post = mongoose.model('Post', mongoose.Schema({
    title: {
        type: String,
    },
    author: {
        //定义关联
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}));
//创建用户
User.create({name: 'lw'}).then(res => console.log(res));
//创建文章
Post.create({title: 'javascript',author:'5e8c3d4875d1c013acccf4d5'}).then(res => console.log(res));
//关联查询
Post.find().populate('author').then(res => console.log(res));
// author: { _id: 5e8c3d4875d1c013acccf4d5, name: 'lw', __v: 0 },
```

### art-template模板引擎

```javascript
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
```

```html
<body>
    {{name}}
    {{age}}
</body>
```

