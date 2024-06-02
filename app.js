const express = require('express')
const cookieParser = require('cookie-parser');
const cors = require('cors')
const ejs = require('ejs');
const rateLimit = require('express-rate-limit');
const path = require('path')
require('dotenv').config()


const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const resetRoutes = require('./routes/resetRoutes');
const authMiddleware = require('./middleware/authMiddleware');
const errorMiddleware = require('./middleware/errorMiddleware');
const userController = require('./controllers/userController');
const connectDB = require('./db/conn');

const app = express()
const PORT = process.env.PORT
connectDB()

app.use(cors());
app.use(express.static('public'));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
    res.setHeader('Referrer-Policy', 'no-referrer');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'deny');
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    next();
});

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
});

app.use('/user/shorten', limiter);
app.use('/user/url/:urlId', limiter);

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');


app.get('/', authMiddleware, (req, res) => {
    res.render('home');
});

app.use('/auth', authRoutes);
app.use('/user', userRoutes);
app.use('/reset', resetRoutes);
app.get('/:urlId', authMiddleware, userController.urlId)

app.use('*', (req, res) => {  
    res.status(404).redirect('/');
});
app.use(errorMiddleware);

app.listen(PORT, () => {
    console.log(`Server running on ${PORT}`)
})