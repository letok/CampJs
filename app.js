
/**
 * Module dependencies.
 */

var express = require('express')
	, routes = require('./routes')
	, user = require('./routes/user')
	, http = require('http')
	, fs = require('fs')
	, path = require('path')
	, Trombine = require('./trombine').Trombine;

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser('My wonderful secret'));
app.use(express.session());
app.use(app.router);
app.use(require('less-middleware')({ src: __dirname + '/public' }));
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
	app.use(express.errorHandler());
}

// Routes
app.get('/', function(req, res){
	res.sendfile(__dirname + '/public/index.html');
/*
	trombine.remove(function(error){
		res.render('error');
	});
*/
/*
	trombine.findAll(function(error, trombines){
			res.render('index', {
						title: 'Trombinoscope',
						trombines: trombines
				});
	});
	*/
});

app.post('/trombine/new', function(req, res){
	//res.setHeader("Access-Control-Allow-Origin", "*");

	trombine.save(
		req.body, function(err) {
			if (err) throw err.message;

			res.send(200, 'OK');
		}
	);
});

app.get('/trombine/list', function(req, res){
	//res.setHeader("Access-Control-Allow-Origin", "*");
	trombine.findAll(function(error, trombines){
			res.json(trombines);
	});
});

/*app.options('/*', function(req, res){
	res.setHeader("Access-Control-Allow-Origin", "*");
	res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	res.send(200, true);
});*/

//Connect to database
var trombine = new Trombine('localhost', 27017);

http.createServer(app).listen(app.get('port'), function(){
	console.log('Express server listening on port ' + app.get('port'));
});
