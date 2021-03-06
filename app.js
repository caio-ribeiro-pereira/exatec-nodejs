
var express = require('express')
  , http = require('http')
  , socket = require('socket.io')
  , auth = require('./lib/auth')
  , fs = require('fs')
  , app = express();

app.configure(function(){
	app.set('view engine', 'jade');
	app.set('views', __dirname + '/views');
	app.use(express.bodyParser());
	app.use(express.methodOverride());
	app.use(app.router);
	app.use(express.static(__dirname + '/public', {maxAge: 7200000}));
	app.use(express.errorHandler());
});

var port = (process.env.PORT || 3000);
var server = http.createServer(app).listen(port, function() {
	console.log("Executando Exatec Node.js");
});
var io = socket.listen(server);

app.get('/', function(req, res){
	fs.readdir(__dirname + '/public/img/slides', function(err, slides){
		res.render('index', {host: 'http://' + req.headers.host, slides: slides});	
	});
});

app.get('/login', function(req, res){
	res.render('login');
});

app.post('/admin', function(req, res){
	if(auth.validating(req.body.user))
		res.render('admin', {host: 'http://' + req.headers.host});
	res.redirect('/');
});

io.configure(function(){
	io.set("transports", ["xhr-polling"]);
	io.set("polling duration", 20);
});

io.sockets.on('connection', function(socket){
	socket.on('admin_connection', function(){
		socket.broadcast.emit('admin_online');
	});
	socket.on('admin_slide_next', function(){
		socket.broadcast.emit('public_slide_next');
	});
	socket.on('admin_slide_prev', function(){
		socket.broadcast.emit('public_slide_prev');
	});
	socket.on('admin_disconnection', function(){
		socket.broadcast.emit('admin_offline');
	});
});
