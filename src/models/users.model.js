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

userSchema.pre('save', function (next) {
    let user = this;
    // 비밀번호 변경될 때만
    if (user.isModified('password')) {
        // salt 생성
        bcrypt.genSalt(Number(process.env.SALTROUNDS), function (err, salt) {
            if (err) return next(err);

            bcrypt.hash(user.password, salt, function (err, hash) {
                if (err) return next(err);
                user.password = hash;
                next();
            })
        })
    }
})


// ! 4
userSchema.methods.comparePassword = function (plainPassword, cb) {
    // bcrypt compare 비교
    // plain password  => client, this.password => DB에 있는 비밀번호
    bcrypt.compare(plainPassword, this.password, function (err, isMatch) {
        if (err) return cb(err);
        console.log(isMatch);
        cb(null, isMatch);
    })
}

const User = mongoose.model('User', userSchema);



module.exports = User;