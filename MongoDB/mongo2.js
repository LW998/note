const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/play', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('数据库连接成功');
}).catch(err => {
    console.log(err, '数据库连接失败');
})


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
        //去除空格
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
        required: true,
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

Post.create({
    hot: 10,
    name: '哈哈',
    category: 'jss',
    author: 'aa',
}).then(res => console.log(res)).catch(err => {
    const e = err.errors;
    for (let attr in e) {
        console.log(e[attr]['message']);
    }
});