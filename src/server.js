const express = require('express');
const path = require('path');
const { default: mongoose } = require('mongoose');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));   // HTML INPUT 값 받아오기 위해

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


mongoose.connect('mongodb+srv://kshlove735:Kkjj159159!!@cluster0.swh6vkh.mongodb.net/?retryWrites=true&w=majority')
    .then(() => console.log('mongodb connected'))
    .catch(err => console.log(err));

app.use('/static', express.static(path.join(__dirname, 'public')));

app.get('/login', (req, res) => {
    res.render('login');
})

app.get('/signup', (req, res) => {
    res.render('signup')
})


const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Listening on ${PORT}...`);
})