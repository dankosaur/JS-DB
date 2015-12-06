var express = require('express');
var app = express(); // this initializes the app to be a function handler that you can supply to an HTTP server
var http = require('http').Server(app); 
var io = require('socket.io')(http); //initialize socket.io by passing it the HTTP server object
var CircularJSON = require('circular-json')
  , obj = { foo: 'bar' }
  , str
  ;

//
// TODO: eventually make an administrative page where one can easily view users in games, and send messages to all users
//
// TODO: way, way, eventually add a spectator mode
//

webPlayers=[0];
playersWhoJoinedEachGame=[];
//currentPlayers=[];

app.use(express.static('public'));

app.get('/', function(req, res){ // We define a route handler / that gets called when we hit our website home
	//res.send('<h1>Hello world</h1>');
	res.sendFile(__dirname + '/index4.html');
});

io.on('connection', function(socket){ //Later can change this from something like io.on 'connection' to io.on 'automatch'
										// probably need a confirmation system like isotropic to stop people from 'automatching', leaving their browser
										// and forgetting about it?
										// or have a pretty strict 1st turn idle disconnect?
	lastID=webPlayers[webPlayers.length-1];
	currentID=lastID+1;
	webPlayers.push(currentID);
	socket.game=Math.floor(currentID/2)+1;
	socket.join(socket.game);
	socket.emit('say to single user', 'You are joining game: '+socket.game);
	if (currentID%2===0){
		socket.emit('set player', 'player1');
		playersWhoJoinedEachGame.push(1);
		console.log('player1 has joined game '+socket.game);
	}
	else{
		socket.emit('set player', 'player2');
		socket.broadcast.to(socket.game).emit('say to single user', 'A 2nd player has joined');
		playersWhoJoinedEachGame[socket.game]+=1;
		console.log('player2 has joined game '+socket.game);
	}

	socket.on('disconnect', function(){
		if (playersWhoJoinedEachGame[socket.game]===1) /// if someone leaves before opponent joins, don't put an opponent in the room
		{
			lastID=webPlayers[webPlayers.length-1]
			currentID=lastID+1
			webPlayers.push(currentID)
		}
		else
		{
		socket.broadcast.to(socket.game).emit('say to single user', 'your opponent has disconnected');
		}
		console.log('A player disconnected from game '+socket.game);
	});

	/*
	currentPlayer=webPlayers.pop(0);
	currentPlayers.push([socket.id, currentPlayer]);
	console.log(currentPlayer+'connected');
	console.log(currentPlayers+' are current players');
	console.log(webPlayers+' are available players');
	console.log(socket.id);

	
    //socket.broadcast.to(socket.id).emit('end turn', 'You are: '+currentPlayer);
  	//io.clients[socket.id].send('end turn', 'You are: '+currentPlayer)
  	//io.sockets.socket(socket.id).emit('You are: '+currentPlayer)
  	socket.emit('say to single user', 'You are: '+currentPlayer);
  	
  	if (currentPlayer==='p4' || currentPlayer ==='p3'){
  		socket.join('room1');
  		socket.game='room1'
  		socket.emit('say to single user', 'You are joining room 1');
  	}

  	if (currentPlayer==='p1' || currentPlayer ==='p2'){
  		socket.join('room2');
  		socket.game='room2'
  		socket.emit('say to single user', 'You are joining room 2');
  	}
	

	socket.on('disconnect', function(){
		//console.log(currentPlayer+'disconnected');
		//console.log(socket.id);
		for (item in currentPlayers)
		{
			if (currentPlayers[item][0]===socket.id) //when a player is leaving
				console.log("-------------------------------")
				console.log("New Disconnect EVENT")
				console.log("-------------------------------")
				console.log("currentPlayers[item][0]:   "+currentPlayers[item][0])
				console.log("currentPlayers[item]:   "+currentPlayers[item])
				console.log("currentPlayers[item][1]:   "+currentPlayers[item][1])
				temp=currentPlayers[item][1]
				
       			currentPlayers.splice(item, 1);      ///remove "1" entry from index "item" 


				
				console.log("currentPlayers after slice:   "+currentPlayers)
				console.log("temp after slice:   "+temp)

				//disconnect the player with that username
				webPlayers.push(temp); //add their username back into the list of usernames
				console.log("-------------------------------")
		}

		
		console.log(currentPlayers+' are current players');
		console.log(webPlayers+' are available players');

		
	})*/

	socket.on('chat message', function(msg){
		console.log('message: ' + msg);
		io.emit('chat message', msg)
	});

	socket.on('send log', function(msg){
		//console.log('server received log: ' + msg);
		socket.broadcast.to(socket.game).emit('receive log', msg);
	});

	socket.on('send overall', function(overall){
		console.log('server received log: ' + overall);
		socket.broadcast.to(socket.game).emit('receive overall', overall);
	});

	socket.on('end turn', function(){
		console.log('ending the turn');
		 // sending to all clients in 'game' room(channel) except sender
 		//socket.broadcast.to('game').emit('message', 'nice game');
 		
 		socket.broadcast.to(socket.game).emit('end turn');

 		//io.emit('end turn', asd)
	});

});

http.listen(3000, function(){ //We make the http server listen on port 3000
	console.log('listening on *:3000')
});