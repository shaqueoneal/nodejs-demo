var mongoose = require('mongoose');

var Schema = mongoose.Schema;

// Define User schema
var _User = new Schema({
	id: String,
	name : String,
	ip : String,
	email : String,
	password : String
});

//one theme one vote record
var _Vote = new Schema({
	id: String,
	userId: String,
	themeId: String,
	votes: [{no: String, date: Date, comments: String}],	//no means candidate's id begins with 1
});

// theme is a show where works can be voted
var _Theme = new Schema({
	id: String,
	name: String,	
	begin: Date,	// open voting time
	end: Date,		// close voting time
	votesPerUser: String, //votes a user can have
	maxUser: String,	// max users  -1: unlimited
	maxVotes: String,	// max votes  -1: unlimited	
	description: String,	// slogan poster etc.
	imgUrl: String,		// advtise img
	//candidates: String,	// candidates count, must provide *

	candidates: [{
		id: String,		//begins with 1
		name: String,
		author: String,	
		url: String,	//where to access *
		description: String,
	}],
});

// candidate is a work in the theme
var _Candidate = new Schema({
	id: String,		//begins with 1
	themeId: String,
	name: String,
	author: String,	
	url: String,	//where to access *
	description: String,
});

_Theme.methods.countVotes = function (cb) {
	var voteRecords = [];
	for (var i = 0; i < this.candidates.length; i++) {
		voteRecords[i] = 0;
	};

	var VoteTemp = mongoose.model('Vote', _Vote);
	VoteTemp.find({themeId: this.id}, function (err, userVotes) {
		if (userVotes.length > 0) {			
			userVotes.forEach(function (votes) {	
				votes.votes.forEach(function (vote) {	
					console.log(vote);
					if (parseInt(vote.no) > 0) {			
						voteRecords[vote.no - 1]++ ;
					}
				});
			});

			cb(voteRecords);
		}
	});
}

var User = mongoose.model('User', _User);
var Vote = mongoose.model('Vote', _Vote);
var Theme = mongoose.model('Theme', _Theme);
var Candidate = mongoose.model('Candidate', _Candidate);

function add(entity, cb) {
	if (!entity.id) {
		console.log("error: invalid entity");
		return;
	}

	var self = this;

	this.find({id: entity.id},  function (err, doc) {
		// console.log(doc);
		if (doc.length <= 0) {
			self.create(entity, function (err, entity) {
				if (err) {
					console.log(err);
				}

				cb ? cb(err, doc) : undefined;
			});				
		}
		else {
			console.log("info: entity already exists");

			cb ? cb(err, doc) : undefined;
		}		
	});
}

function del(id, cb) {
	this.remove({id: id}, function (err, ret) {
		if (err) {
			console.log(err);
		}

		cb ? cb(err, ret) : undefined;
	});	
}

// if id omitted get all documents
function get(id, cb) {
	var key = {};

	if ((arguments.length === 2) && isFunction(arguments[0])) {
		if (id) {
			key.id = id;
		}
	}
	else if (arguments.length === 1){
		cb = arguments[0];
	}

	this.find(key,  function (err, doc) {
		if (err) {
			console.log(err);
		}

		if (doc.length <= 0) {
			console.log("info: no entity found");
		}

		cb ? cb(err, doc) : undefined;
		
	});
}

function set(entity, cb) {
	var self = this;
	this.find({id: entity.id},  function (err, doc) {
		if (err) {
			console.log(err);
		}

		if (doc.length <= 0) {
			console.log("info: no entity found");
			self.add(entity, cb);
		}
		else {
			//update
			self.del(entity.id, function (err, ret) {
				// console.log(entity);
				if (err) {
					console.log(err);
					cb ? cb(err, entity) : undefined;
				}
				else {
					self.add(entity, cb);
				}				
			});	
		}
	});
}

Candidate.add = Vote.add = Theme.add = User.add = add;
Candidate.del = Vote.del = Theme.del = User.del = del;
Candidate.get = Vote.get = Theme.get = User.get = get;
Candidate.set = Vote.set = Theme.set = User.set = set;

// export them
exports.User = User;
exports.Vote = Vote;
exports.Theme = Theme;