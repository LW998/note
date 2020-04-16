const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/test', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('数据库连接成功');
}).catch(err => {
    console.log(err, '数据库连接失败');
})


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
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}));
//创建用户
// User.create({name: 'lw'}).then(res => console.log(res));
// Post.create({title: 'javascript',author:'5e8c3d4875d1c013acccf4d5'}).then(res => console.log(res));

Post.find().populate('author').then(res => console.log(res));