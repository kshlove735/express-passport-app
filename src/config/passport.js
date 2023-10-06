const passport = require('passport');
const User = require('../models/users.model');
const LocalStrategy = require('passport-local').Strategy;

// req.login(user) 진행 시 세션 데이터 생성
passport.serializeUser((user, done) => {
    done(null, user.id);
})

// client에서 세션 데이터로 요청을 보내면 req.user=user 설정
passport.deserializeUser((id, done) => {
    User.findById(id)
        .then(user => {
            done(null, user);;
        })
})



// ! 2
passport.use('local', new LocalStrategy({ usernameField: 'email', passwordField: 'password' },
    (email, password, done) => {
        // DB에 저장된 계정있는지 email로 확인
        User.findOne({ email: email.toLocaleLowerCase() })
            .then(user => {
                // 회원 가입된 계정(email)이 없는 경우
                if (!user) return done(null, false, { msg: `Email ${email} not found` });

                // ! 3
                // 계정이 있는 경우 비밀번호 동일한지 비교
                user.comparePassword(password, (err, isMatch) => {
                    if (err) return done(err);

                    // ! 5
                    // 비밀번호 동일한 경우
                    if (isMatch) return done(null, user);

                    // 비밀번호 동일하지 않는 경우
                    return done(null, false, { msg: 'Invalid email or password.' });
                })

            })
            .catch((err) => {
                return done(err);
            })




    }
))