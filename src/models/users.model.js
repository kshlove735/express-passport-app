const mongoose = require('mongoose');
const bcrypt = require('bcryptjs')

const userSchema = mongoose.Schema({
    email: {
        type: String,
        trim: true,
        unique: true,
    },
    password: {
        type: String,
        minlength: 5
    },
    googleId: {
        type: String,
        unique: true,
        sparse: true    // unique 속성을 유지하면서 null에 대한 중복은 허용
    }
})

const User = mongoose.model('User', userSchema);
module.exports = User;