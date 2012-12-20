var canvas;
var ctx;

var socket;
var width = 600;
var height = 400;
var scaleFactor = 200.0;


$(document).ready(function() {
	document.onmousedown = function(event) { 
		if(event.clientX < 0 || event.clientX >= width ||
			event.clientY < 0 || event.clientY >= height) {
			console.log("reached here");
			return;
		}
		var data = { 
			"type": "mouse_down",
			"x":	event.clientX,
			"y":	event.clientY
		};
		socket.send(JSON.stringify(data));
	};
	document.onmouseup = function(event) {
		if(event.clientX < 0 || event.clientX >= width ||
			event.clientY < 0 || event.clientY >= height) {
			console.log("reached here");
			return;
		}
		var data = { 
			"type": "mouse_up",
			"x":	event.clientX,
			"y":	event.clientY
		};
		socket.send(JSON.stringify(data));
	};

	document.onmousemove = function(event) {
		if(event.clientX < 0 || event.clientX >= width ||
			event.clientY < 0 || event.clientY >= height) {
			console.log("reached here");
			return;
		}
		var data = { 
			"type": "mouse_move",
			"x":	event.clientX,
			"y":	event.clientY
		};
		socket.send(JSON.stringify(data));
	}

	document.onkeydown = function(event) {
		var data = {
			"type": "key_down",
			"keyCode":	event.keyCode
		};
		socket.send(JSON.stringify(data));
	};
	document.onkeyup = function(event) {
		var data = {
			"type": "key_up",
			"keyCode":	event.keyCode
		};
		socket.send(JSON.stringify(data));
	};
	
	run_after_DOM();
});

function run_after_DOM() {
	canvas = $("#canvas").get(0);
	ctx = canvas.getContext('2d');

	socket = io.connect("ec2-107-20-98-71.compute-1.amazonaws.com:8081");

	socket.on("message", function(data) {
		console.log(data);
		var obj = JSON.parse(data);
		ctx.clearRect(0, 0, width, height);
		drawAll(obj["params"], ctx, scaleFactor);
		var ack = {
			"type": "ack",
		};
		socket.send(JSON.stringify(ack));
	});

	socket.on("disconnect", function() {
		console.log("ERROR: socket connection broken!");
	});
}
