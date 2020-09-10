const createError = require('http-errors');
const path = require('path');
const express = require('express');
const router = express.Router();
const app = express();
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const expressEjsLayout = require('express-ejs-layouts');
const sassMiddleware = require('node-sass-middleware');
const logger = require('morgan');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');

require("./config/passport")(passport)

// mongoose
mongoose.connect('mongodb://localhost/test',{useNewUrlParser: true, useUnifiedTopology : true})
.then(() => console.log('connected to mongodb'))
.catch((err)=> console.log(err));

app.set('view engine','ejs');
app.use(expressEjsLayout);
app.use(express.urlencoded({extended : false}));

// session
app.use(session({
 secret : 'secret',
 resave : true,
 saveUninitialized : true
}));

// Passport setup
app.use(passport.initialize());
app.use(passport.session());

// use flash
app.use(flash());
app.use((req,res,next)=> {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error  = req.flash('error');
next();
})

// Routes
app.use('/',require('./routes/index'));
app.use('/users',require('./routes/users'));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(sassMiddleware({
  src: path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  indentedSyntax: true, // true = .sass and false = .scss
  sourceMap: true
}));
app.use(express.static(path.join(__dirname, 'public')));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
