var express      = require('express');
var path         = require('path');
var favicon      = require('serve-favicon');
var logger       = require('morgan');
var cookie       = require('cookie');
var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser');
var session      = require('express-session');
var http         = require('http');
var routes       = require('./routes/index');
var users        = require('./routes/users');
var childProcess = require('child_process');

/* self module */
var models          = require('./models');
var User            = models.User;
var BrowseCount     = models.BrowseCount;
var getHostNameByIp = require('./util').getHostNameByIp;
// var devFinder       = require('./devFinder');

var app    = express();
var server = http.createServer(app);
var io     = require('socket.io')(server);

server.listen(3000);

// var sessionStore = new session.MemoryStore();

var COOKIE_SECRET = '12345';
var COOKIE_NAME = 'user_info';

// session.store.length;
app.use(session({
  // genid: function(req) {
  //   function genuuid() {
  //     var id = setTimeout('0');  
  //     clearTimeout(id);  
  //     return id + ""; //必须是字符串，调了很久  
  //   }

  //   return genuuid();
  // },
  secret: COOKIE_SECRET,
  // store: sessionStore,
  name: COOKIE_NAME,
  cookie: {
    secure:   false, 
    httpOnly: false,
    maxAge: null
  },
  resave: false,
  saveUninitialized: true,
}));

// only in memory and init from BrowseCount when app start
var g_totalAccessCount = 0; 
var g_onlineCount = 0;

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
  var clientIp = socket.client.conn.remoteAddress;
  // console.log(clientIp);

  g_totalAccessCount++;
  g_onlineCount++;

  getHostNameByIp(clientIp, function(hostname) {
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

    /* add user if new commer */
    User.add(userObj, function (err, doc) {});

    /* save user access info */
    BrowseCount.get({id: userObj.id}, function(err, docs) {
      if (err) {
        console.log(err);
        return;
      }

      var browse = {
        id: userObj.id,
        count: 1,
        lastAccess: Date.now(),
      };

      if (!docs || docs.length <= 0) {
        console.log('add browse count');
        BrowseCount.add(browse, function() {});
      }
      else {
        browse.count = docs[0].count + 1;    /* user access time +1 */
        browse.lastAccess = Date.now();

        console.log('set browse count');

        BrowseCount.set(browse, function() {});
      }
    });

    /* save session */
    // var sess = socket.request.session;
    // console.log(socket.request);

    // if (!sess.user) {
    //   sess.user = userObj;
    //   sess.save(function(err) {
    //     // session saved
    //     console.log(sess);
    //   });
    // }

    // socket.userId = userObj.id;

    // var data = socket.handshake || socket.request;
    // if (! data.headers.cookie) {
    //     // return next(new Error('Missing cookie headers'));
    //     console.log('Missing cookie headers');
    //     return;
    // }
    // console.log(data);
    // // console.log('cookie header ( %s )', JSON.stringify(data.headers.cookie));
    // var cookies = cookie.parse(data.headers.cookie);
    // console.log('cookies parsed ( %s )', JSON.stringify(cookies));
    // if (!cookies[COOKIE_NAME]) {
    //     var sid = session.genid();

    //     sessionStore.set(sid, userObj, function(err, session) {
    //       console.log('add session of user: ' + userObj.id);
    //       data.sid = sid;
    //       data.session = session;
    //     });
    // }
    // else {
    //   var sid = cookieParser.signedCookie(cookies[COOKIE_NAME], COOKIE_SECRET);
    //   if (!sid) {
    //     console.log('Cookie signature is not valid');
    //     return;
    //   }

    //   console.log('session ID ( %s )', sid);
    //   data.sid = sid;
    //   sessionStore.get(sid, function(err, session) {
    //     if (err) {
    //       console.log(err);
    //       return;
    //     }

    //     if (!session) {
    //       console.log('session not found');

    //       sessionStore.set(sid, userObj, function(err, session) {
    //         console.log('add session of user: ' + userObj.id);
    //         data.sid = sid;
    //         data.session = session;
    //       });

    //       return;
    //     }

    //   });
    // }

    socket.emit('hostname', hostname);      //use socket.emit to peer

    io.emit('browse', {
      total: g_totalAccessCount,
      online: g_onlineCount,
    });  //use io.emit to all

    socket.on('disconnect', function(){ 
      g_onlineCount--;

      io.emit('browse', {
        total: g_totalAccessCount,
        online: g_onlineCount,
      });
    });
  });
});


// index file
app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'public/index.html'));
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

var child = childProcess.fork('./devFinder');

setInterval(function(){      
    child.kill();
    child = childProcess.fork('./devFinder');
}, 1000 * 60 * 10); //10 minutes refresh

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
