const express = require('express');
const usersRouter = express.Router();
const passport = require('passport');
const sendMail = require('../mail/mail');
const User = require('../models/users.model');

usersRouter.post('/login', (req, res, next) => {
    //! 1
    passport.authenticate('local', (err, user, info) => {
        if (err) return next(err);

        if (!user) return res.json({ msg: info });
        // ! 6
        // 세션 생성 및 req.user에 user 정보 설정
        req.logIn(user, function (err) {
            if (err) { return next(err) }
            res.redirect('/');
        })
    })(req, res, next)    // 미들웨어 안의 미들웨어를 실행시키기 위해서 마지막에 (req, res, next) 필요
})

usersRouter.post('/logout', (req, res, next) => {
    req.logOut(function (err) {
        if (err) return next(err);
        res.redirect('/login');
    })
})

usersRouter.post('/signup', async (req, res) => {
    // user 객체 생성
    const user = new User(req.body);

    try {
        // user 컬랙션에 유저를 저장
        await user.save();
        // 이메일 보내기
        sendMail('kshlove735@naver.com', '김승현', 'welcome')
        res.redirect('/login');
    } catch (error) {
        console.error(error);
    }
})


usersRouter.get('/google', passport.authenticate('google'));
usersRouter.get('/google/callback', passport.authenticate('google', {
    successReturnToOrRedirect: '/',
    failureRedirect: '/login',
}));

usersRouter.get('/kakao', passport.authenticate('kakao'));
usersRouter.get('/kakao/callback', passport.authenticate('kakao', {
    successReturnToOrRedirect: '/',
    failureRedirect: '/login',
}));

module.exports = usersRouter;