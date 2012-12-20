var Canvas = require('canvas');
var support = require('./support.js');

var env;
var width = 600; var height = 400;
var scaleFactor = 200.0;
var blobColl;
var gravity;
var stopped;
var savedMouseCoords = null;
var selectOffset = null;

var canvas = new Canvas(width, height);
var ctx = canvas.getContext('2d');

var time1 = 0.0;
var time2 = 0.0;

var pingStart;

function getPingStart() {
	return pingStart;
}

function blob(client) {

	this.addForce = function(x, y) {
		//console.log("reached blob.addForce " + x + " " + y)
		blobColl.addForce(new support.Vector(x, y));
	}
	this.draw = function() {
		
		//testing code
		//console.log("DRAWING FUNCTION");
		//console.log();


		//ctx.fillRect(0, 0, width, height);
		ctx.clearRect(0, 0, width, height);
		
		env.draw(ctx, scaleFactor);
		blobColl.draw(ctx, scaleFactor);

		canvas.toDataURL(function(err, str) {
			//console.log("reached here");
			var msg = {};
			msg["dataURL"] = str;
			pingStart = new Date().getTime();
			client.send(JSON.stringify(msg));
		});
	}
	this.join = function() { blobColl.join(); }
	this.mousedown = function(msg) {
		//console.log("reached mousedown");
		if(stopped == true) return;

		selectOffset = blobColl.selectBlob(
			msg["x"] / scaleFactor, 
			msg["y"] / scaleFactor
		);
	}
	this.mousemove = function(msg) {
		//console.log("reached mousemove");
		if(stopped == true || selectOffset == null) return;

		var mouseCoords = {"x": msg["x"] / scaleFactor, 
			"y": msg["y"] / scaleFactor
		};
		blobColl.selectedBlobMoveTo(mouseCoords.x - selectOffset.x,
			mouseCoords.y - selectOffset.y);
		savedMouseCoords = mouseCoords;
	}
	this.mouseup = function(msg) {
		//console.log("reached mouseup");
		blobColl.unselectBlob();
		savedMouseCoords = null;
		selectOffset = null;
	}
	this.split = function() { blobColl.split(); }
	this.start = function() { stopped = false; this.timeout(); }
	this.stop = function() { stopped = true; }
	this.timeout = function() {
		
		var start;
		start = new Date().getTime();
		this.draw();
		time1 += new Date().getTime() - start;
		
		start = new Date().getTime();
		this.update();
		time2 += new Date().getTime() - start;
		
		//some testing
		//console.log("TIMEOUT FUNCTION");
		//console.log(time1);
		//console.log(time2);

		//if(stopped == false) { setTimeout(this.timeout(), 30); }
	}
	this.toggleGravity = function() {
		if(gravity.getY() > 0.0) gravity.setY(0.0);
		else gravity.setY(10.0);
	}
	this.update = function() {
		var dt = 0.05;
		if(savedMouseCoords != null && selectOffset != null) {
			blobColl.selectedBlobMoveTo(savedMouseCoords.x - selectOffset.x,
				savedMouseCoords.y - selectOffset.y);
		}
		blobColl.move(dt);
		blobColl.sc(env);
		blobColl.setForce(gravity);
	} 
	
	//these are needed but commented out until they are imported
	env = new support.Environment(0.2, 0.2, 2.6, 1.6);
	blobColl = new support.BlobCollective(1.0, 1.0, 1, 200);
	gravity = new support.Vector(0.0, 10.0);
	stopped = false;
	
	//just for testing. we'll use the timeouts to get an animation working for real
	//this.draw();
	this.timeout();	
}

exports.getPingStart = getPingStart;
exports.blob = blob;
