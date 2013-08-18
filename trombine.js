var Db = require('mongodb').Db;
var Connection = require('mongodb').Connection;
var Server = require('mongodb').Server;
var BSON = require('mongodb').BSON;
var ObjectID = require('mongodb').ObjectID;

Trombine = function(host, port) {
	this.db = new Db('trombinoscope', new Server(host, port, {safe: false, auto_reconnect: true}));
	this.db.open(function(err, mongoclient) {
		if (err) throw err;
	});
};


Trombine.prototype.getCollection= function(callback) {
	this.db.collection('trombines', function(error, trombine_collection) {
		if( error ) callback(error);
		else callback(null, trombine_collection);
	});
};

//find all trombines
Trombine.prototype.findAll = function(callback) {
	this.getCollection(function(error, trombine_collection) {
		if (error)
			callback(error);
		else {
			trombine_collection.find().sort({name: 1}).toArray(function(error, results) {
				if( error ) callback(error)
				else callback(null, results)
			});
		}
	});
};

//remove all
Trombine.prototype.remove = function(callback) {
	this.getCollection(function(error, trombine_collection) {
		if (error)
			callback(error);
		else {
			trombine_collection.remove({name: 'gaily and guilly'});
		}
	});  
};

//save new trombine
Trombine.prototype.save = function(trombines, callback) {
	this.getCollection(function(error, trombine_collection) {
		if (error)
			callback(error);
		else {
			if (typeof trombines.length == 'undefined')
				trombines = [trombines];

			for (var i = 0; i < trombines.length; i++) {
				trombine = trombines[i];
				trombine.created_at = new Date();
			}

			trombine_collection.insert(trombines, function(err, docs) {
				console.log(docs);
				callback(err, docs);
			});
		}
	});
};

exports.Trombine = Trombine;