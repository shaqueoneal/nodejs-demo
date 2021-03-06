var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var childProcess = require('child_process');
var session = require('express-session');
var isIPv6 = require('net').isIPv6;

// var app =  require('../app');

var models = require('../models');
var getHostNameByIp = require('../util').getHostNameByIp;

var User = models.User;
var Theme = models.Theme;
var Vote = models.Vote;
var UserMsg = models.UserMsg;
var BrowseCount = models.BrowseCount;

mongoose.connect('mongodb://localhost/user_vote');

/* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('index', { title: 'Voting' });
// });

var g_candidates = [
  {
    id: 1,
    name: "有容乃大",
    author: "zhaoshenglu",
    url: "http://UIS-SERVER2:7042/index-200px.html",
    description: "",
  },
  {
    id: 2,
    name: "中庸之道",
    author: "zhaoshenglu",
    url: "http://UIS-SERVER2:7042/index-160px.html",
    description: "",
  },
  {
    id: 3,
    name: "走马观花",
    author: "zhaoshenglu",
    url: "http://UIS-SERVER2:7042/index-120px.html",
    description: "",
  },
  {
    id: 4,
    name: "小巧玲珑",
    author: "zhaoshenglu",
    url: "http://UIS-SERVER2:7042/index-100px.html",
    description: "",
  },
  {
    id: 5,
    name: "顾名思义",
    author: "fangqingyun",
    url: "http://UIS-SERVER2:7042/index-now.html",
    description: "",
  },
  {
    id: 6,
    name: "人不如故",
    author: "fangqingyun",
    url: "http://UIS-SERVER2:7042/index-old.html",
    description: "",
  },
];

var g_candidates1 = [
  {
    id: 1,
    name: "数据中心",
    author: "zhaoshenglu",
    url: "../images/dataCenter.jpg",
    description: "",
  },
  {
    id: 2,
    name: "合作伙伴",
    author: "zhaoshenglu",
    url: "../images/partner-logo.png",
    description: "",
  },
  {
    id: 3,
    name: "背景大图",
    author: "zhaoshenglu",
    url: "../images/large_bg_image.jpg",
    description: "",
  },
];


var themeObj = {
  id: 1,
  name: 'UIS首页',    
  begin: Date.now(),  
  end: new Date(2015, 4, 30), //lasts 10 days 
  votesPerUser: 1, 
  maxUser: -1,  
  maxVotes: -1, 
  description: 'UIS 登陆页面评选 火热进行中，动动您的手指，选出心中所爱吧！ \n \
               无需注册，直接点击下方按钮参与投票',
  imgUrl: "images/slides/slide1.jpg",
  candidates: g_candidates, 
};

var themeObj1 = {
  id: 2,
  name: '图片展示',    
  begin: Date.now(),  
  end: new Date(2015, 5, 30), //lasts 10 days 
  votesPerUser: 1, 
  maxUser: -1,  
  maxVotes: -1, 
  description: '都是图片',
  imgUrl: "images/slides/slide2.jpg",
  candidates: g_candidates1, 
};

Theme.set(themeObj, function(err, doc) {
  if (err) {
    console.log(err);
    return;
  }
});

Theme.set(themeObj1, function(err, doc) {
  if (err) {
    console.log(err);
    return;
  }
});

router.get('/user_vote', function(req, res, next) {
  var sess = req.session;

  // console.log(req);
  if ("all" == req.query.themes) {
    Theme.get(function(err, docs) {
      if (err) {
        console.log('err');
        return;
      }
      
      // console.log(docs);
      res.send(docs);
    });    
  }

  getHostNameByIp(req.ip, function(hostname) { 
    if (!sess.user) {
      var userObj = {
        id: hostname,
        name : hostname,
        ip : req.ip,
        email : "",
        password : ""
      };

      sess.user = userObj;
      sess.save(function(err) {
        // session saved
        console.log(sess);
      });
    }
  });
});

// router.get('/', function(req, res, next) { 
//   res.sendFile('.public/index.html'); 
// });


/* GET user vote page. */
// router.get('/user_vote', function(req, res, next) {
//   // res.render('user_vote', { title: 'user_vote' });

//   if (g_candidates[0].themeId == req.query.theme) {
//     res.type('json');
//     res.send(g_candidates);
//   }

// });

/* POST user vote . */
router.post('/user_vote', function(req, res, next) {
    // console.log(req.body);  
    if ("getActiveThemes" == req.body.method) {
      if ("all" == req.query.themes) {
        Theme.get(function(err, docs) {
          if (err) {
            console.log('err');
            return;
          }
          
          // console.log(docs);
          res.send(docs);
        });    
      }
      
      var userObj = {
        id: req.ip,
        name : req.ip,
        ip : req.ip,
        email : "",
        password : ""
      };

      User.add(userObj, function (err, doc) {
        if (err) {
          return;
        }
      });
    }
    else if ("getResult" == req.body.method) {   
      Theme.get({id: req.body.themeId},  function(err, docs) {
        if (docs.length < 1) {
          console.log(err);
          return;
        }

        // console.log(docs[0]);
        var theme = docs[0];

        theme.countVotes(function(voteRecords) {
          // console.log(voteRecords);
          res.send(voteRecords);
        });
      });
    }
    else if ("getResultDetail" == req.body.method) {   
      Vote.get({themeId: req.body.themeId}, function(err, docs) {
        if (err) {
          console.log('err');
          return;
        }
        
        // console.log(docs);
        res.send(docs);
      });
    }
    else if ("vote" == req.body.method) {
      var user = req.session.user;

      console.log('>>>>>>>>>>>>>>>>>>>>>>>>>');
      console.log(user);

      // console.log(req.body);  
      // var vote = {
      //   id: req.body.theme + req.ip,
      //   userId: (req.body.userId ? req.body.userId : req.ip),
      //   themeId: req.body.theme,  
      //   votes: [{no: req.body.no, date: new Date(), comments: req.body.comments}],
      // };
      var vote = {
        id: user.id + req.body.theme,
        userId: user.id,
        themeId: req.body.theme,  
        votes: [{no: req.body.no, date: new Date(), comments: req.body.comments}],
      };

      Vote.set(vote, function (err, doc) {
        var ret = 'success';

        if (err) {
          ret = 'fail';
        }

        res.type('json');
        res.send({
          "result":   ret,
          "theme":    req.body.theme,
          "no":       req.body.no,
        }); 
      });
    }
});

router.post('/user_message', function(req, res, next) {
  // console.log(req.body);
  var userMsg = {};
  userMsg.id =  Date.now().toString();
  userMsg.name = req.body.name;
  userMsg.email = req.body.email;
  userMsg.message = req.body.message;
  userMsg.date = Date.now();

  UserMsg.add(userMsg, function (err, doc) {
    var message = "感谢您的反馈，我们将及时改进！";

    if (err) {
      console.log(err);
      message = "似乎有点故障。。。"

    }

    res.render('user_message', {
      message: message,
    });
  });

});

 // proxy = new proxy('a’,’b’,’c’,function(a,b,c){ render('index’,…)}) db.findByType(0,function(doc,err){emit('a’,doc)}); db.findByType(1,function(doc,err){…); db.findByType(2,function(doc,err){…);

module.exports = router;
