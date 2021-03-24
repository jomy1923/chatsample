var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const db=require('./config/connection')
var adminRouter = require('./routes/admin');
var usersRouter = require('./routes/users');
var dotenv=require('dotenv').config()
const Handlebars= require('handlebars')
var hbs=require('express-handlebars')

var app = express();
// var server = require('./bin/www')
var server = require('http').Server(app);
const io= require('socket.io')(server)
var session=require('express-session')
app.use(session({
  secret: 'keyboard cat',
  resave: true,
  saveUninitialized: true,
  cookie: {  maxAge: 5000000}
}))

app.use(function(req, res, next){
  res.io = io;
  next();
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
db.connect((err)=>{
  if(err){
    console.log('mongodb err:',err)
  }else{
    console.log('database connected sucessfully')
  }

})

app.use('/admin', adminRouter);
app.use('/', usersRouter);




io.on('connection',(socket)=>{
  console.log('new connection is established')
  socket.on('disconnect',()=>{
    console.log('connnction lost')
  })
  
})

 
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


module.exports = {app: app, server: server};
