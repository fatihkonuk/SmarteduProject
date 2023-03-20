const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');
const methodOverride = require('method-override'); 
const app = express();

const pageRoute = require('./routes/pageRoute');
const courseRoute = require('./routes/courseRoute');
const categoryRoute = require('./routes/categoryRoute');
const authRoute = require('./routes/authRoute');
const adminRoute = require('./routes/adminRoute');

mongoose.connect('mongodb://127.0.0.1:27017/smartedu-db')
.then(() => {
    console.log('DB Connected');
});

//* Template Engine
app.set('view engine', 'ejs');

//* Global Variable
global.userIN = null;

//* Middlewares
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended:true }));
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({ mongoUrl: 'mongodb://127.0.0.1:27017/smartedu-db' })
}));
app.use(flash());
app.use((req,res,next) => {
    res.locals.flashMessage = req.flash();
    next();
});
app.use(methodOverride('_method', {
    methods: ['POST', 'GET']
}));

//* Routes
app.use('*', (req,res,next) => {
    userIN = req.session.userID;
    next();
})
app.use('/', pageRoute);
app.use('/courses', courseRoute);
app.use('/categories', categoryRoute);
app.use('/users', authRoute);
app.use('/admin', adminRoute);

const port = 3000;
app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});