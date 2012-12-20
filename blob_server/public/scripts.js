var canvas;
var ctx;
var socket;
var width = 650;
var height = 450;

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
	alert("event handlers ready!");
	
	run_after_DOM();
});

function draw_frame(obj) {
	var frame = new Image();
	frame.src = obj["dataURL"];
	ctx.drawImage(frame, 0, 0);
}

function run_after_DOM() {
	canvas = $("#canvas").get(0);
	ctx = canvas.getContext('2d');

	socket = io.connect("ec2-107-20-98-71.compute-1.amazonaws.com:8081");
	//socket.send({"message": "ping"});

	socket.on("message", function(data) {
		console.log(data);
		var obj = JSON.parse(data);
		draw_frame(obj);
		var ack = {
			"type": "ack",
		};
		socket.send(JSON.stringify(ack));
	});

	socket.on("disconnect", function() {
		console.log("ERROR: socket connection broken!");
	});
}
