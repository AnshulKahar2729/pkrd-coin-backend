var createError = require('http-errors');
const i18n = require('./i18n');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');
const cors = require('cors');

// var admin = require('firebase-admin');
var dotenv = require('dotenv');
dotenv.config();

var app = express();

const http = require('http').Server(app);
//socket
var io = require('socket.io')(http);

//call routes
const adminRouter = require('./src/admin/admin.routes')(io);
const commonRouter = require('./src/common/common.routes');
const apiRouter = require('./src/app/app.routes');

const { APP_DEFAULT_PORT } = require('./utils/constants/app.constants');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(fileUpload({
  useTempFiles: true,
  tempFileDir: '/tmp/'
}));

app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors());
app.use(i18n);

app.use(bodyParser.json({ limit: '100mb' }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

//routes path
require('./socket')(io);
app.use(adminRouter);
app.use(commonRouter)
app.use(apiRouter)

//cluster sticky session
const clusterSession = require('./utils/constants/cluster.sticky.session');
clusterSession.clusterStickySession(http, APP_DEFAULT_PORT)

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

require('./utils/constants/db.config').dbConnection()

module.exports = app;
