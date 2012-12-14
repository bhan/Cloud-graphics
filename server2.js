var util = require('util'),
    connect = require('connect'),
    port = 8081;

// output on the server console request information
var log_req = function(req) {
	util.puts("request for " + req["url"] + " using " + req["method"] + ".");
};

var sendHome = function(req, res) {
	res.end("Home page");
}

var handlePOST = function(req, res) {
};

var handleGET = function(req, res) {
	switch(req["url"]) {
		case "/": sendHome(req, res); break;
	}
};

connect.createServer(function(req, res, next) {
	log_req(req);
	connect.static(__dirname);
	res.end();
	/*var body = 'Hello World';
	res.setHeader('Content-Length', body.length);
	res.end(body);*/
	/*log_req(req);
	connect.static("./cloth.html");
	res.end();*/
	/*if(req.method === 'POST') {
		handlePOST(req, res);
	} else if(req.method === 'GET') {
		handleGET(req, res);
	}*/
	/*
	var Canvas = require('canvas'),
		canvas = new Canvas(200, 200),
		ctx = canvas.getContext('2d');
	
	ctx.font = '30px Impact';
	ctx.rotate(.1);
	ctx.fillText("Awesome!", 50, 100);

	var te = ctx.measureText('Awesome!');
	ctx.strokeStyle = 'rgba(0, 0, 0, 0.5)';
	ctx.beginPath();
	ctx.lineTo(50, 102);
	ctx.lineTo(50 + te.width, 102);
	ctx.stroke();

	res.end(canvas.toDataURL());
	*/
}).listen(port);

util.puts('Listening on ' + port + '...');
util.puts('Press Ctrl + C to stop.');
