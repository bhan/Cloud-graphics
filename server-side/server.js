/**** mootools ****/

/**** END OF mootools ****/
/**** fast_vectorjs ****/
var FastVector  = function(x,y){
	this.x = x;
	this.y = y;
};

FastVector.prototype = {
	
	add: function (B,internal) {
		var nx, ny;
		if (typeof(B)=='number'){
			nx = this.x+B;
			ny = this.y+B;
		}else{
			nx = this.x+B.x;
			ny = this.y+B.y;
		}
		return new FastVector(nx,ny);
	},
	add_: function(B) {
		if (typeof(B)=='number'){
			this.x+=B; this.y+=B;
		}else{
			this.x+=B.x; this.y+=B.y;
		}
		return this;
	},
	dot: function(B) {
		return ((this.x*B.x)+(this.y*B.y));
	},
	length: function() {
		return Math.sqrt((this.x*this.x)+(this.y*this.y));
	},
	multiply: function(B) {
		var nx, ny;
		if (typeof(B)=='number'){
			nx = this.x*B; ny = this.y*B;
		}else{ 
			nx = this.x*B.x; ny = this.y*B.y;
		}
		return new FastVector(nx,ny);
	},
	multiply_: function(B) {
		if (typeof(B)=='number'){
			this.x*=B; this.y*=B;
		}else{
			this.x*=B.x; this.y*=B.y;
		}
		return this;
	},
	squaredLength: function(args) {
		return (this.x*this.x)+(this.y*this.y);
	},
	sum: function(){
		return this.x+this.y;
	},
	subtract: function(B) {
		var nx, ny;
		if (typeof(B) == 'number'){
			nx = this.x-B; ny = this.y-B;
		}else{
			nx = this.x-B.x; ny = this.y-B.y;
		}
		return new FastVector(nx,ny);
	},
	subtract_: function(B) {
		if (typeof(B) == 'number'){
			this.x-=B; this.y-=B;
		}else{
			this.x-=B.x; this.y-=B.y;
		}
		return this;
	},
	toString: function() {
		return "["+this.x+","+this.y+"]";
	}

};
/**** END OF fast_vector.js ****/
/**** canvas.js ****/
//(function(){

var two_pi = Math.PI * 2;

var Canvas = this.Canvas = function(canvas){
	this.canvas = canvas;
	this.ctx = this.canvas.getContext('2d');
	this.ctx.fillStyle = this.ctx.strokeStyle = 'black';
	
	this.width = this.canvas.width;
	this.height = this.canvas.height;
};

Canvas.prototype={
	adjust: function(pos) {
		var location = this.canvas.getPosition(),
			lx = location.x,
			ly = location.y,
			px = pos.x,
			py = pos.y;
		
		var inside = (px > lx && px < lx + this.width && py > ly && py < ly + this.height);
		
		return inside ? new FastVector((pos.x - lx) / this.canvas.width, (pos.y - ly) / this.canvas.height) : null;
	},
	
	clear: function(){
		this.ctx.clearRect(0, 0, this.width, this.height);
	},
	
	circle: function(p, r){
		x = p.x * this.width;
		y = p.y * this.height;
		this.ctx.beginPath();
		this.ctx.moveTo(x + r, y);
		this.ctx.arc(x, y, r, 0, two_pi, false);
		this.ctx.fill();
	},
	
	line: function(x1, x2){
		this.ctx.beginPath();
		this.ctx.moveTo(x1.x * this.width, x1.y * this.height);
		this.ctx.lineTo(x2.x * this.width, x2.y * this.height);
		this.ctx.stroke();
	}
};
	
//})();
/**** END OF canvas.js ****/
/**** point.js ****/
var Point = function(canvas, x, y){
	this.canvas = canvas;
	this.current = this.previous = new FastVector(x, y);
	
	this.mass = this.inv_mass = 1;
	
	this.force = new FastVector(0.0,0.5).multiply(0.05 * 0.05);
	this.radius = 3;
};

Point.prototype = {
	
	setCurrent: function(p) {
		this.current = p;
	},
	
	setPrevious: function(p) {
		this.previous = p;
	},
	
	getCurrent: function() {
		return this.current;
	},
	
	getPrevious: function() {
		return this.previous;
	},
	
	move: function() {
		if (this.inv_mass!=0){
			var new_pos = this.current.multiply(1.99).subtract(this.previous.multiply(0.99)).add(this.force);
			new_pos.x = (new_pos.x < 0) ? 0 : ((new_pos.x > 1) ? 1 : new_pos.x);
			new_pos.y = (new_pos.y < 0) ? 0 : ((new_pos.y > 1) ? 1 : new_pos.y);
			this.previous = this.current;
			this.current = new_pos;
		}
	},
	
	draw: function() {
		this.canvas.circle(this.current, this.radius);
	}
	
};
/**** END OF point.js ****/
/**** constraints.js ****/
var Constraint = function(canvas, p1, p2, rl){
	this.canvas = canvas;
	this.p1 = p1;
	this.p2 = p2;
	this.rest_length = rl || p1.getCurrent().subtract(p2.getCurrent()).length();
//	this.squared_rest_length = this.rest_length * this.rest_length;
	this.squared_rest_length = Math.sqrt(this.rest_length * this.rest_length);
};

Constraint.prototype = {
	draw: function(){
		this.canvas.line(this.p1.getCurrent(), this.p2.getCurrent());
	},
	
	satisfy: function(){
		var p1 = this.p1.getCurrent();
		var p2 = this.p2.getCurrent();
		var delta = p2.subtract(p1);
		
		var p1_im = this.p1.inv_mass;
		var p2_im = this.p2.inv_mass;
		
		//var d = delta.squaredLength();
		
		var d = delta.length();
		
		var diff = (d - this.squared_rest_length) / ((this.squared_rest_length + d) * (p1_im + p2_im));
		
		if (p1_im != 0){
			this.p1.setCurrent(p1.add(delta.multiply(p1_im * diff)));
		}
		
		if (p2_im != 0){
			this.p2.setCurrent( p2.subtract(delta.multiply(p2_im*diff)) );
		}
	}
};
/**** END OF constraints.js ****/
/**** cloth.js ****/
var Cloth = function(canvas){

	/*this.time1 = 0.0;
	this.time2 = 0.0;
	this.time3 = 0.0;
	this.time4 = 0.0;
	*/

	var max_points = 101,
		width = canvas.width,
		height = canvas.height,
		max_dim = Math.max(width, height),
		min_dim = Math.min(width, height),
		x_offset = width * 0.2,
		y_offset = height * 0.2,
		spacing = (max_dim - (Math.max(x_offset, y_offset) * 2)) / max_points;
	
	this.num_iterations = 2;
	this.canvas = canvas;
	this.points = [];
	this.constraints = [];
	
	var num_x_points = this.num_x_points = Math.round((max_points * (width / max_dim)));
	var num_y_points = this.num_y_points = Math.round((max_points * (height / max_dim)));
	
	var constraint;
	
	for (var i = 0, y = y_offset; i < num_y_points; i++, y += spacing){
		this.points[i] = [];
		
		for (var j = 0, x = x_offset; j < num_x_points; j++, x += spacing){
			var point = new Point(canvas, x / width, y / height);
			this.points[i][j] = point;
			
			//add a vertical constraint
			if (i > 0){
				constraint = new Constraint(canvas, this.points[i - 1][j], this.points[i][j]);
				this.constraints.push(constraint);
			}
			
			//add a new horizontal constraints
			if (j > 0){
				constraint = new Constraint(canvas, this.points[i][j - 1], this.points[i][j]);
				this.constraints.push(constraint);
			}
		}
	}
	//pin the top right and top left.
	this.points[0][0].inv_mass = 0;
	this.points[0][Math.floor((num_x_points / 2))].inv_mass = 0;
	this.points[0][num_x_points - 1].inv_mass = 0;

	this.num_constraints = this.constraints.length;
	
	for (i = 0; i < this.num_constraints; i++)
		this.constraints[i].draw();
	
};

Cloth.prototype = {
	
	update: function() {
		this.canvas.clear();
		
		var num_x = this.num_x_points,
			num_y = this.num_y_points,
			num_c = this.num_constraints,
			num_i = this.num_iterations,
			i, j;
			
		var start;
		//move each point with a pull from gravity
		//start = new Date().getTime();
		for (i = 0; i < num_y; i++)
			for (j = 0; j < num_x; j++)
				this.points[i][j].move();
		//this.time1 += new Date().getTime() - start;
		
		//make sure all the constraints are satisfied.
		//start = new Date().getTime();
		for (j = 0; j < num_i; j++)
			for (i = 0; i < num_c; i++)
				this.constraints[i].satisfy();
		//this.time2 += new Date().getTime() - start;
		
		//draw the necessary components.
		//start = new Date().getTime();
		if (this.draw_constraints)
			for (i = 0; i < this.num_constraints; i++)
				this.constraints[i].draw();
		//this.time3 += new Date().getTime() - start;
		
		//start = new Date().getTime();
		if (this.draw_points)
			for (i = 0; i < this.num_y_points; i++)
				for (j = 0; j < this.num_x_points; j++)
					this.points[i][j].draw();
		//this.time4 += new Date().getTime() - start;
		
		/*console.log(this.time1);
		console.log(this.time2);
		console.log(this.time3);
		console.log(this.time4);
		console.log("");
		console.log("");
		*/
	},
	
	getClosestPoint: function(pos) {
		var min_dist = 1,
			min_point = null,
			num_x = this.num_x_points,
			num_y = this.num_y_points,
			dist, i, j;
		
		for (i = 0; i < num_y; i++){
			for (j = 0; j < num_x; j++){
				dist = pos.subtract(this.points[i][j].getCurrent()).length();
				
				if (dist < min_dist){
					min_dist = dist;
					min_point = this.points[i][j];
				}
			}
		}
		
		return min_point;
	},
	
	toggleConstraints: function(){
		this.draw_constraints = !this.draw_constraints;
	},
	
	togglePoints: function(){
		this.draw_points = !this.draw_points;
	}
};

/**** END OF cloth.js ****/

var express = require('express');
var app = express();
var server = require('http').createServer(app);
var Canvas = require('canvas');
var io = require('socket.io');
var socket = io.listen(server);
var port = 8081;

var width = 650; var height = 450;

app.use(express.static(__dirname + '/public'));

socket.on("connection", function(client) {
	console.log("NEW socket connection from ", client["id"]);

	/*var canvas = new Canvas(width, height);
	var ctx = canvas.getContext('2d');
	ctx.fillRect(0, 0, width, height);
	ctx.save();
	*/

	var canvas = new Canvas(width, height),
		cloth = new Cloth(canvas),
		inputs = {}, point;
	var	key_down, mouse_down, mouse;
		
	var position = function(data){
		return canvas.adjust(data);
	};
	
	var setPoint = function(inv_mass){
		if (!point) return;
		if (mouse) {
			point.setCurrent(mouse);
			point.setPrevious(mouse);
		}
		point.inv_mass = inv_mass;
	};

	function handle_mouse_down(msg) {
		mouse_down = true;
		var data = {"x": msg["x"], "y": msg["y"]};

		mouse = position(data);
		if (!mouse) return;
			
		point = cloth.getClosestPoint(mouse);
		setPoint(0);
	}

	function handle_mouse_up(msg) {
		mouse_down = false;
		if (mouse) setPoint( key_down ? 0 : 1);
	}
	
	function handle_mouse_move(msg) {
		if (!mouse_down) return;

		var data = {"x": msg["x"], "y": msg["y"]};
		mouse = position(data);
		setPoint(mouse ? 0 : 1);
	}

	setInterval(cloth.update.bind(cloth), 35);

	/*canvas.toDataURL(function(err, str) {
		var msg = {};
		msg["dataURL"] = str;
		client.send(JSON.stringify(msg));
	});*/

	client.on("message", function(data) {
		console.log("Client ", client["id"], " sent ", data);
		var msg = JSON.parse(data);
		switch(msg["type"]) {
			case "mouse_up": handle_mouse_up(msg); 
				break;
			case "mouse_down": handle_mouse_down(msg);
				break;
			case "mouse_move": handle_mouse_move(msg);
				break;
			case "key_up": 
				key_down = false;
				break;
			case "key_down": 
				key_down = true;
				break;
		}
	});

	client.on("disconnect", function() {
		console.log("Client ", client["id"], " disconnecting");
	});
});

server.listen(port);

console.log("Listening on port 8081");
