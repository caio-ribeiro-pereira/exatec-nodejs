
var express = require('express')
  , app = express()
  , auth = require('./lib/auth')
  , server = require('http').createServer(app)
  , io = require('socket.io').listen(server);

app.listen((process.env.PORT || 3000), function() {
	console.log("Executando Exatec Node.js");
});

app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(__dirname + '/public'));
app.use(express.errorHandler());
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');

app.get('/', function(req, res){
	res.render('index', {host: 'http://' + req.headers.host});
});

app.get('/login', function(req, res){
	res.render('login');
});

app.post('/admin', function(req, res){
	if(auth.validating(req.body.user))
		res.render('admin', {host: 'http://' + req.headers.host});
	res.redirect('/');
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