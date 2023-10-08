const express = require('express');
const path = require('path');
const { default: mongoose } = require('mongoose');
const passport = require('passport');
// const User = require('./models/users.model');
const cookieSession = require('cookie-session');
require("dotenv").config();
const config = require('config');
const serverConfig = config.get('server');

const mainRouter = require('./routes/main.router');
const usersRouter = require('./routes/users.router');

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

app.use('/', mainRouter);
app.use('/auth', usersRouter);



const PORT = serverConfig.port
app.listen(PORT, () => {
    console.log(`Listening on ${PORT}...`);
})