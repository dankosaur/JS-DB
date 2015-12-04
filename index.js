var express = require('express');
var app = express(); // this initializes the app to be a function handler that you can supply to an HTTP server
var http = require('http').Server(app); 
var io = require('socket.io')(http); //initialize socket.io by passing it the HTTP server object
var CircularJSON = require('circular-json')
  , obj = { foo: 'bar' }
  , str
  ;


stringified = CircularJSON.stringify(express);
console.log(stringified)

app.use(express.static('public'));

app.get('/', function(req, res){ // We define a route handler / that gets called when we hit our website home
	//res.send('<h1>Hello world</h1>');
	res.sendFile(__dirname + '/index3.html')
});

io.on('connection', function(socket){ //listen on the connection event for incoming sockets and log to console
	console.log('a user connected')
	socket.on('disconnect', function(){
		console.log('user disconnected');
	})

	socket.on('chat message', function(msg){
		console.log('message: ' + msg);
		io.emit('chat message', msg)
	});

	socket.on('end turn', function(asd){
		console.log('ending the turn');
		io.emit('end turn', asd)
	});

	socket.on('add', function(num1,num2){
		sum=parseInt(num1)+parseInt(num2)
		socket.broadcast.emit('chat message', 'The result is '+sum);
		console.log('The result is '+sum)
	});

});

http.listen(3000, function(){ //We make the http server listen on port 3000
	console.log('listening on *:3000')
});