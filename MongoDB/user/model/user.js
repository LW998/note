const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 20,
    },
    age: {
        type: Number,
        min: 0,
        max: 100
    },
    password: String,
    email: String,
    hobbies: [String],
});

const User = mongoose.model('User', UserSchema);

module.exports = User;