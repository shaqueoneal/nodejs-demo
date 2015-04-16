var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var models = require('../models') 

var User = models.User;
var Theme = models.Theme;
var Vote = models.Vote;

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
    url: "http://10.99.73.184:7042/index-200px.html",
    description: "",
  },
  {
    id: 2,
    name: "中庸之道",
    author: "zhaoshenglu",
    url: "http://10.99.73.184:7042/index-160px.html",
    description: "",
  },
  {
    id: 3,
    name: "走马观花",
    author: "zhaoshenglu",
    url: "http://10.99.73.184:7042/index-120px.html",
    description: "",
  },
  {
    id: 4,
    name: "小巧玲珑",
    author: "zhaoshenglu",
    url: "http://10.99.73.184:7042/index-120px.html",
    description: "",
  },
  {
    id: 5,
    name: "顾名思义",
    author: "zhaoshenglu",
    url: "http://10.99.73.184:7042/index.html",
    description: "",
  },
  {
    id: 6,
    name: "人不如故",
    author: "zhaoshenglu",
    url: "http://10.99.73.184:7042/index-old.html",
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
  candidates: g_candidates, 
};

Theme.set(themeObj, function (err, doc) {
  if (err) {
    return;
  }
});

router.get('/', function(req, res, next) {   
	console.log(process.cwd());

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

  var theme = new Theme(themeObj);  //this is theme doc

  theme.countVotes(function(voteRecords) {
    console.log(voteRecords);
  });

  if ("all" == req.query.themes) {
    res.send(themeObj);
  }
  
  // next();	
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
    var vote = {
      id: req.ip + req.body.theme,
      userId: req.ip,
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

});


 // proxy = new proxy('a’,’b’,’c’,function(a,b,c){ render('index’,…)}) db.findByType(0,function(doc,err){emit('a’,doc)}); db.findByType(1,function(doc,err){…); db.findByType(2,function(doc,err){…);

module.exports = router;
