
var express = require('express')
  , app = express()
  , auth = require('./lib/auth')
  , server = require('http').createServer(app)
  , io = require('socket.io').listen(server);

server.listen(3000);

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
	if(auth(req.body.user))
		res.render('admin', {host: 'http://' + req.headers.host});
	res.redirect('/');
});


var colors = ['#00FF00', '#00FFFF', '#0000FF', '#FFFF00'];

io.sockets.on('connection', function(socket){
	socket.emit('online', {color: colors[Math.floor(Math.random() * colors.length)]});
	socket.on('slide', function(){});
	socket.on('disconnect', function(){});
});