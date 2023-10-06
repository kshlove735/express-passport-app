const mongoose = require('mongoose');
const bcrypt = require('bcryptjs')

const userSchema = mongoose.Schema({
    // 일반 로그인을 위한 설정
    email: {
        type: String,
        trim: true, // 양 끝 공백 제거
        unique: true,
    },
    password: {
        type: String,
        minlength: 5
    },
    // Goolge Login을 위한 설정
    googleId: {
        type: String,
        unique: true,
        sparse: true    // unique 속성을 유지하면서 null에 대한 중복은 허용
    }
})


// ! 4
userSchema.methods.comparePassword = function (plainPassword, cb) {
    // TODO bcrypt compare 비교
    // plain password  => client, this.password => DB에 있는 비밀번호
    if (plainPassword === this.password) {
        cb(null, true);
    } else {
        cb(null, false);
    }

    return cb({ error: 'error' });
}

const User = mongoose.model('User', userSchema);



module.exports = User;