var express = require('express');
var router = express.Router();

/* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('index', { title: 'Voting' });
// });

router.get('/', function(req, res, next) { 
	console.log(process.cwd());
	res.sendfile('.public/index.html'); 
});

/* GET user vote page. */
router.get('/user_vote', function(req, res, next) {
  res.render('user_vote', { title: 'user_vote' });
});

/* POST user vote . */
router.post('/user_vote', function(req, res, next) {
	//console.log(req);
	res.type('json');
  res.send({
  	ip: req.ip,
  	data: req.body.data,
  	date: new Date(),
  });
});

module.exports = router;
