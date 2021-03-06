var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
// var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var childProcess = require('child_process');
var http = require('http');
var isIPv6 = require('net').isIPv6;

var routes = require('./routes/index');
var users = require('./routes/users');

var devFinder = require('./devFinder');

var app = express();

// var server = require('http').Server(app);
var server = http.createServer(app);;
var io = require('socket.io')(server);

server.listen(80);

//websocket
app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});

io.on('connection', function (socket) {
  socket.emit('news', { hello: 'world' });
  socket.on('my other event', function (data) {
    console.log(data);
  });
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
// app.use(cookieParser());   express-session require not using it 

app.use(session({
  genid: function(req) {
    function genuuid() {
      var id = setTimeout('0');  
      clearTimeout(id);  
      return id + ""; //必须是字符串，调了很久  
    }

    return genuuid();
  },
  secret: '12345',
  name: 'user_info',  //cookie name 
  cookie: {secure: false, httpOnly:false},
  resave: false,
  saveUninitialized: true
}));

app.use(express.static(path.join(__dirname, 'public')));
app.use('/', routes);

// devFinder.initDevFind();

app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
