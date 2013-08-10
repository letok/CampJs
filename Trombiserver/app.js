
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
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

var trombine= new Trombine('localhost', 27017);

// Routes
app.get('/', function(req, res){
  /*
  trombine.save({
    name: "My test name"
  }, function( error, docs) {});
*/
  /*
  trombine.remove(function(error){
  	res.render('error');
  });
  */

  trombine.findAll(function(error, trombines){
      res.render('index', {
            title: 'Trombines',
            trombines: trombines
        });
  });
});

app.post('/trombine/new', function(req, res){
	res.setHeader("Access-Control-Allow-Origin", "*");
	console.log(req.body);

	trombine.save(
		req.body
	/*{
        name: req.param('name'),
        occupation: req.param('occupation'),
        company: req.param('company'),
        twitter: req.param('twitter'),
        photoBlob: req.param('photoBlob')
    }*/
    , function( error, docs) {
        res.send(200, 'OK');
    });
});

app.get('/trombine/list', function(req, res){
	res.setHeader("Access-Control-Allow-Origin", "*");
	trombine.findAll(function(error, trombines){
      res.json(trombines);
  });
});

app.options('/*', function(req, res){
	res.setHeader("Access-Control-Allow-Origin", "*");
	res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	res.send(200, true);
});

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
