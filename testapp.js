var express         = require('express');
var path            = require('path');
var favicon         = require('serve-favicon');
var logger          = require('morgan');
// var cookieParser = require('cookie-parser');
var bodyParser      = require('body-parser');
var session         = require('express-session');
var http            = require('http');
var routes          = require('./routes/index');
var users           = require('./routes/users');

var models          = require('./models');
var?User            = models.User;
var?BrowseCount     = models.BrowseCount;
var?getHostNameByIp = require('./util').getHostNameByIp;
var devFinder       = require('./devFinder');

var app    = express();
var server = http.createServer(app);
var io     = require('socket.io')(server);

server.listen(3000);

// session.store.length;
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

// index file
app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});

// only in memory and init from BrowseCount when app start
var g_totalAccessCount = 0; 

BrowseCount.get(function(err, docs) {
  if (err) {
    console.log('err');
    return;
  }

  for (var i = 0; i < docs.length; i++) {
    g_totalAccessCount += docs[i].count;
  }
});

io.on('connection', function (socket) {
  console.log(socket);
  // console.log(socket.conn.request);
  var clientIp = socket.client.conn.remoteAddress;
  // console.log(clientIp);

  g_totalAccessCount++;

  getHostNameByIp(clientIp, function(hostname) {
    socket.emit('news', {count: g_totalAccessCount});
    socket.on('my other event', function (data) {
      console.log(data);
    });

    var userObj = {
      id:       hostname,
      name:     hostname,
      ip:       clientIp,
      email:    "",
      password: ""
    };

    User.add(userObj, function (err, doc) {});

    // var sess = session.store.get(socket.handshake.sessionID, function (err, data) {
    //         if (err || !data) {
    //             console.log('no session data yet');
    //         } else {
    //             socket.emit('views', data);
    //         }
    //       });

    // if (!sess.user) {
    //   sess.user = userObj;
    //   sess.save(function(err) {
    //           // session saved
    //           console.log(sess);
    //         });

    //   BrowseCount.get({userId: sess.user.id}, function(err, doc) {
    //     if (err) {
    //       console.log('err');
    //       return;
    //     }

    //     var browse = {
    //       userId: sess.user.id,
    //       lastAccess: Date.now(),              
    //     };

    //     if (!doc || doc.length <= 0) {
    //       browse.count = 1;
    //     }
    //     else {
    //       browse.count = doc.count + 1;
    //     }

    //     BrowseCount.set(browse, function(err, doc) {}); 
    //   });
    // }

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
