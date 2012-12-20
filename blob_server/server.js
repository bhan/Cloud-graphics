var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io');
var socket = io.listen(server);
var port = 8081;

var pingTime = 0.0;
var pingCount = 0;

app.use(express.static(__dirname + '/public'));

socket.on("connection", function(client) {
	console.log("NEW socket connection from ", client["id"]);

	var blobjs = require('./blob.js');
	var blob = new blobjs.blob(client);	

	client.on("message", function(data) {
		//console.log("Client ", client["id"], " sent ", data);
		var msg = JSON.parse(data);
		switch(msg["type"]) {
			case "ack":
				pingTime += new Date().getTime() - blobjs.getPingStart();
				pingCount++;
				console.log();
				console.log("Ping: " + pingTime/pingCount);
				console.log();
				blob.timeout();
				break;
			case "mouse_up": 
				blob.mouseup(msg);
				break;
			case "mouse_down":
				blob.mousedown(msg); 
				break;
			case "mouse_move": 
				blob.mousemove(msg);
				break;
			case "key_up": 
				break;
			case "key_down": 
				switch(msg["keyCode"]) {
					case 37: // left
						blob.addForce(-50.0, 0.0);
						break;
					case 38: // up
						blob.addForce(0.0, -50.0);
						break;
					case 39: // right
						blob.addForce(50.0, 0.0);
						break;
					case 40: // down
						blob.addForce(0.0, 50.0);
						break;

					case 74: // 'j'
						blob.join();
						break;
					case 72: // 'h'
						blob.split();
						break;
					case 71: // 'g'
						blob.toggleGravity();
						break;

					default: break;
				}
				break;
			default: break;
		}
	});

	client.on("disconnect", function() {
		console.log("Client ", client["id"], " disconnecting");
	});
});

server.listen(port);

console.log("Listening on port 8081");
