const express = require('express');
const path = require('path');
const { default: mongoose } = require('mongoose');
const passport = require('passport');
const User = require('./models/users.model');
const cookieSession = require('cookie-session');
const { checkAuthenticated, checkNotAuthenticated } = require('../middlewares/auth');
require("dotenv").config();

const app = express();

app.use(cookieSession({
    name: 'cookie-session-name',
    keys: [process.env.COOKIE_ENCRYPTION_KEY1, process.env.COOKIE_ENCRYPTION_KEY2]
}))


// TypeError: req.session.regenerate is not a function 해결
// register regenerate & save after the cookieSession middleware initialization
app.use(function (request, response, next) {
    if (request.session && !request.session.regenerate) {
        request.session.regenerate = (cb) => {
            cb()
        }
    }
    if (request.session && !request.session.save) {
        request.session.save = (cb) => {
            cb()
        }
    }
    next()
})


// passport 설정
app.use(passport.initialize());
app.use(passport.session());
require('./config/passport');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));   // HTML INPUT 값 받아오기 위해

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


// DB 연결
mongoose.connect(process.env.DB_URI)
    .then(() => console.log('mongodb connected'))
    .catch(err => console.log(err));

// 라우터 설정

// 정적 파일 제공
app.use('/static', express.static(path.join(__dirname, 'public')));
app.get('/', checkAuthenticated, (req, res) => {
    res.render('index');
})

app.get('/login', checkNotAuthenticated, (req, res) => {
    res.render('login');
})

app.post('/logout', (req, res, next) => {
    req.logOut(function (err) {
        if (err) return next(err);
        res.redirect('/login');
    })
})

app.get('/signup', checkNotAuthenticated, (req, res) => {
    res.render('signup')
})

app.post('/login', (req, res, next) => {
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

app.post('/signup', async (req, res) => {
    // user 객체 생성
    const user = new User(req.body);

    try {
        // user 컬랙션에 유저를 저장
        await user.save();
        return res.status(200).json({
            success: true,
        })
    } catch (error) {
        console.error(error);
    }
})

app.get('/auth/google', passport.authenticate('google'));
app.get('/auth/google/callback', passport.authenticate('google', {
    successReturnToOrRedirect: '/',
    failureRedirect: '/login',
}));

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Listening on ${PORT}...`);
})