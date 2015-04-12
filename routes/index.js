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

  var themeObj = {
    id: 'uis',
    name: 'UIS首页',
    candidates: 6, 
    begin: Date.now(),  
    end: new Date(2015, 3, 30), //lasts 10 days 
    votesPerUser: 1, 
    maxUser: -1,  
    maxVotes: -1 
  };

  Theme.add(themeObj, function (err, doc) {
    if (err) {
      return;
    }
  });

  var theme = new Theme(themeObj);  //this is theme doc

  theme.countVotes(function(voteRecords) {
    console.log(voteRecords);
  });

  next();	
});

// router.get('/', function(req, res, next) { 
//   res.sendFile('.public/index.html'); 
// });

var g_candidates = [
  {
    id: 1,
    themeId: "uis",
    name: "有容乃大",
    author: "zhaoshenglu",
    url: "http://10.99.73.184:7042/index-200px.html"
  },
  {
    id: 2,
    themeId: "uis",
    name: "中庸之道",
    author: "zhaoshenglu",
    url: "http://10.99.73.184:7042/index-160px.html"
  },
  {
    id: 3,
    themeId: "uis",
    name: "走马观花",
    author: "zhaoshenglu",
    url: "http://10.99.73.184:7042/index-120px.html"
  },
  {
    id: 4,
    themeId: "uis",
    name: "小巧玲珑",
    author: "zhaoshenglu",
    url: "http://10.99.73.184:7042/index-120px.html"
  },
  {
    id: 5,
    themeId: "uis",
    name: "顾名思义",
    author: "zhaoshenglu",
    url: "http://10.99.73.184:7042/index.html"
  },
  {
    id: 6,
    themeId: "uis",
    name: "人不如故",
    author: "zhaoshenglu",
    url: "http://10.99.73.184:7042/index-old.html"
  },
];

/* GET user vote page. */
router.get('/user_vote', function(req, res, next) {
  // res.render('user_vote', { title: 'user_vote' });

  if (g_candidates[0].themeId == req.query.theme) {
    res.type('json');
    res.send(g_candidates);
  }

});

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
