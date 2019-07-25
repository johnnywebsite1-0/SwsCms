let createError = require('http-errors');
let express = require('express');
let path = require('path');
let cookieParser = require('cookie-parser');
let logger = require('morgan');

let loginRouter = require('./routes/login');
let indexRouter = require('./routes/index');
let usersRouter = require('./routes/users');
let userEditRouter = require('./routes/userEdit');
let modulesRouter = require('./routes/modules');
let moduleDetailRouter = require('./routes/moduleDetail');
let moduleResourcesRouter = require('./routes/moduleResources');
let singleDetailRouter = require('./routes/singleDetail');
let singleDetailEditRouter = require('./routes/singleDetailEdit');
let newsRouter = require('./routes/news');
let newsEditRouter = require('./routes/newsEdit');

let app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//登录拦截器
app.use(function (req, res, next) {
  let url = req.originalUrl;
  if (url !== '/' && req.cookies['swsLoginUser'] === undefined) {
    return res.redirect("/");
  }
  next();
});

app.use('/', loginRouter);
app.use('/index', modulesRouter);
app.use('/users', usersRouter);
app.use('/user/edit', userEditRouter);
app.use('/modules', modulesRouter);
app.use('/modulesDetail', moduleDetailRouter);
app.use('/moduleResources', moduleResourcesRouter);
app.use('/singleDetail', singleDetailRouter);
app.use('/singleDetailEdit', singleDetailEditRouter);
app.use('/news', newsRouter);
app.use('/news/edit', newsEditRouter);

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
