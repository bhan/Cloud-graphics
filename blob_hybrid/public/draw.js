function drawAll(params, ctx, scaleFactor) {
	var blob;
	var radius;
	numPointMasses = 8;
	var f = 0.1;
	var low = 0.95, high = 1.05;
	var t, i, p;

	this.drawBody = function(ctx, scaleFactor) {
		
		ctx.strokeStyle = "#000000";
		if(blob[0] == true) ctx.fillStyle = "#FFCCCC";
		else ctx.fillStyle = "#FFFFFF";
		ctx.lineWidth = 5;
		ctx.beginPath();
		ctx.moveTo(blob[1] * scaleFactor,
			blob[2] * scaleFactor);

		for(var j = 0; j  < blob[3]; ++j) {
			ctx.bezierCurveTo(blob[j*4+4],blob[j*4+5],blob[j*4+6],blob[j*4+7],blob[j*4+6],blob[j*4+7]);
		}

		ctx.closePath();
		ctx.stroke();
		ctx.fill();
	}
	this.drawOohFace = function(ctx, scaleFactor) {
		ctx.lineWidth = 2;
		ctx.strokeStyle = "#000000";
		ctx.fillStyle = "#000000";
		ctx.beginPath();
		ctx.arc(0.0, (0.1 * radius) * scaleFactor,
			radius * 0.25 * scaleFactor, 0, Math.PI, false);
		ctx.fill();

		ctx.beginPath();

		ctx.moveTo((-0.25 * radius) * scaleFactor, 
			(-0.3 * radius) * scaleFactor);
		ctx.lineTo((-0.05 * radius) * scaleFactor, 
			(-0.2 * radius) * scaleFactor);
		ctx.lineTo((-0.25 * radius) * scaleFactor, 
			(-0.1 * radius) * scaleFactor);

		ctx.moveTo((0.25 * radius) * scaleFactor, 
			(-0.3 * radius) * scaleFactor);
		ctx.lineTo((0.05 * radius) * scaleFactor, 
			(-0.2 * radius) * scaleFactor);
		ctx.lineTo((0.25 * radius) * scaleFactor, 
			(-0.1 * radius) * scaleFactor);

		ctx.stroke();
	}
    this.drawHappyFace1 = function(ctx, scaleFactor) {      
      ctx.lineWidth = 2;
      ctx.strokeStyle = "#000000";
      ctx.fillStyle = "#000000";
      ctx.beginPath(); 
      ctx.arc(0.0, 0.0, 
        radius * 0.25 * scaleFactor, 0, Math.PI, false);
      ctx.stroke();
    }
    this.drawHappyFace2 = function(ctx, scaleFactor) {      
      ctx.lineWidth = 2; 
      ctx.strokeStyle = "#000000";
      ctx.fillStyle = "#000000";
      ctx.beginPath(); 
      ctx.arc(0.0, 0.0, 
        radius * 0.25 * scaleFactor, 0, Math.PI, false);
      ctx.fill();  
    }
    this.drawHappyEyes1 = function(ctx, scaleFactor) {      
      ctx.lineWidth = 1; 
      ctx.fillStyle = "#FFFFFF";
      ctx.beginPath(); 
      ctx.arc((-0.15 * radius) * scaleFactor, 
              (-0.20 * radius) * scaleFactor, 
              radius * 0.12 * scaleFactor, 0, 2.0 * Math.PI, false);
      ctx.fill(); 
      ctx.stroke();  

      ctx.beginPath(); 
      ctx.arc(( 0.15 * radius) * scaleFactor, 
              (-0.20 * radius) * scaleFactor, 
              radius * 0.12 * scaleFactor, 0, 2.0 * Math.PI, false);
      ctx.fill(); 
      ctx.stroke();          

      ctx.fillStyle = "#000000";
      ctx.beginPath(); 
      ctx.arc((-0.15 * radius) * scaleFactor, 
              (-0.17 * radius) * scaleFactor, 
              radius * 0.06 * scaleFactor, 0, 2.0 * Math.PI, false);
      ctx.fill();  

      ctx.beginPath(); 
      ctx.arc(( 0.15 * radius) * scaleFactor, 
              (-0.17 * radius) * scaleFactor, 
              radius * 0.06 * scaleFactor, 0, 2.0 * Math.PI, false);
      ctx.fill();  
    }
    this.drawHappyEyes2 = function(ctx, scaleFactor) {      
      ctx.lineWidth = 1; 
      ctx.fillStyle = "#FFFFFF";
      ctx.beginPath(); 
      ctx.arc((-0.15 * radius) * scaleFactor, 
              (-0.20 * radius) * scaleFactor, 
              radius * 0.12 * scaleFactor, 0, 2.0 * Math.PI, false);
      ctx.stroke();  

      ctx.beginPath(); 
      ctx.arc(( 0.15 * radius) * scaleFactor, 
              (-0.20 * radius) * scaleFactor, 
              radius * 0.12 * scaleFactor, 0, 2.0 * Math.PI, false);
      ctx.stroke();          

      ctx.lineWidth = 1;       
      ctx.beginPath(); 
      ctx.moveTo((-0.25   * radius) * scaleFactor, 
                 (-0.20 * radius) * scaleFactor); 
      ctx.lineTo((-0.05 * radius) * scaleFactor, 
                 (-0.20 * radius) * scaleFactor); 
      ctx.stroke();  

      ctx.beginPath(); 
      ctx.moveTo(( 0.25   * radius) * scaleFactor, 
                 (-0.20 * radius) * scaleFactor); 
      ctx.lineTo(( 0.05 * radius) * scaleFactor, 
                 (-0.20 * radius) * scaleFactor); 
      ctx.stroke();  
    }
	this.drawFace = function(ctx, scaleFactor) {
		switch(blob[blob[3]*4+8]) {
			case 0:
				this.drawOohFace(ctx, scaleFactor);
				break;
			case 1:
				switch(blob[blob[3]*4+9]) {
					case 0: this.drawHappyFace1(ctx, scaleFactor, 0.0, -0.3);
						break;
					case 1: this.drawHappyFace2(ctx, scaleFactor, 0.0, -0.3);
						break;
				}
				switch(blob[blob[3]*4+10]) {
					case 0: this.drawHappyEyes1(ctx, scaleFactor, 0.0, -0.3);
						break;
					case 1: this.drawHappyEyes2(ctx, scaleFactor, 0.0, -0.3);
						break;
				}
				break;
		}
	}
	this.draw = function(ctx, scaleFactor) {
		var i;
		var up, ori, ang;

		this.drawBody(ctx, scaleFactor);

		ctx.strokeStyle = "#000000";
		ctx.fillStyle = "#000000";

		ctx.save();
		ctx.translate(blob[blob[3]*4+4] * scaleFactor,
			(blob[blob[3]*4+5] - 0.35 * radius) * scaleFactor);
		
		ctx.rotate(blob[blob[3]*4+7]);

		this.drawFace(ctx, scaleFactor);

		ctx.restore();
	}


		
	var i;
	
	for(i = 0; i < params.length; ++i) {
		
		blob = params[i];
		radius = blob[blob[3]*4+6];
		console.log(blob);

		if(blob == null) continue;
		this.draw(ctx, scaleFactor);
	}
}
