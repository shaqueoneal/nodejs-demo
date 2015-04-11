var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var models = require('../models') // 导入自定义组件 

var User = models.User;  // 使用User模型，对应的users表 
var Theme = models.Theme;  // 使用Theme模型，对应的Theme表 
var Vote = models.Vote;  // 使用Vote模型，对应的vote表 

mongoose.connect('mongodb://localhost/user_vote');  // 连接数据库

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

/* GET user vote page. */
router.get('/user_vote', function(req, res, next) {
  res.render('user_vote', { title: 'user_vote' });
});


/* POST user vote . */
router.post('/user_vote', function(req, res, next) {
  //console.log(app);   this will be {}!!

	 // console.log(req.body);

 //  var user = new User({
 //    id: req.ip,
 //    name : req.ip,
 //    ip : req.ip,
 //    email : "",
 //    password : ""
 //  });

 //  console.log(user);

 //      user.add();

 //      console.log(req.body);

      // user.vote(req.body.theme, req.body.no, "", function () {
        // res.type('json');
        // res.send({
        //   "theme":    req.body.theme,
        //   "no":       req.body.no,
        //   "comments": ""
        // });          
      // });   

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
