/*!
 The MIT License (MIT)

 Copyright (c) 2015 Cadeli

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 */

;(function ($) {

function Point(x, y) {
  this.x = x;
  this.y = y;
}



//-------------------------------------------------------------------------------

	$.fn.psycar = function (options) {
  		var frame=0;

  		var nbPoints = 5;
    //
   		var fillColor3   = '#EC1B54';
    	var borderColor3 = '#79325E';
    	var fillColor2   = '#45A1D2';
    	var borderColor2 = '#765254';
    	var fillColor1   = '#F27255';
    	var borderColor1 = '#F75F2E';
    	var backColor    = '#FEC657';

    	var line1 = [];
	   	var line2 = [];
   		var line3 = [];
   		var currentLine = [];
   		var lastPoint = new Point(0,0);

   		var oscSpeed = [];


		var settings = $.extend({
			time_interval_ms  : 40,
			cSpeed            : 10 ,
			cAmplitude        : 10,
			cDeformation      : 2,
			backColor         : '#FEC657',
			isBezier           : 'true'
		}, options);

		$this = $(this);

   		var randomizeLines = function (height) {
        	for (var i = 0; i < nbPoints; i++) {
            	oscSpeed[i] =   Math.floor(Math.random()*5+5 );
        	}
    	}

    	var createLines = function (nbPoints, width, height) {
        	var columnWidth = width / (nbPoints - 1);
        	currentLine = [];
        	for (var i = 0; i < nbPoints; i++) {
            	var point = new Point(0, 0);
            	currentLine.push(point);
        	}

        	line1 = [];
        	line2 = [];
        	line3 = [];
        	var x = 0;

        	var hh =height / 3;

        	for (var i = 0; i < nbPoints; i++) {
            	var y3 = Math.floor(Math.random()*hh) + 2 * hh;
            	var y2 = y3 - Math.floor(Math.random()*hh)  - hh / 3;
            	var y1 = y2 - Math.floor(Math.random()*hh)  - hh / 3;

            	var point3 = new Point(x, y3);
            	line3.push(point3);

            	var point2 = new Point(x, y2);
            	line2.push(point2);

            	var point1 = new Point(x, y1);
            	line1.push(point1);
            	//console.log("add tot line1 x="+ point1.x + " y="+ point1.y);
            	x += columnWidth;
        	}
    	}

		var width = $this.width();
		var height = $this.height();

		var canvas_id = "psycar-canvas-"+     $this.attr('id');

		var canvas = $('<canvas id="'+ canvas_id+'">')
			.attr({width: $this.width(), height: $this.height()})
			.prependTo($this);


		var computeNextFrame = function () {
			for (var  i=0; i < (line1.length) ;i++) {
				var diff =  height*settings.cAmplitude *Math.sin( settings.cSpeed*frame / oscSpeed[i]);
				line1[i].y += diff;
				line2[i].y += diff;
				line3[i].y += diff;
			}
			frame++;
			if(frame%100==0) {
				randomizeLines(height);
			}
			if(frame%1000==0) {
				createLines(nbPoints, width, height);
			}
		};

		var  updateTimer = function () {
      		computeNextFrame();
 			draw();
    	}

    	var compute_resize = function () {
			 width = $this.width();
			 height = $this.height();

			var canvas = document.getElementById(canvas_id);
			canvas.setAttribute("width", width.toString());
			canvas.setAttribute("height", height.toString());
    		
    	}

    	var drawWavePolygone = function (ctx,width,height, fillColor, borderColor,  num) {
        	var  cDeformation = settings.cDeformation;
        	ctx.beginPath();
        	ctx.moveTo(0, height);
        	lastPoint.x = currentLine[0].x;
        	lastPoint.y = currentLine[0].y;
        	ctx.moveTo(lastPoint.x, lastPoint.y);
        	var hh = height / 8;
        	//console.log("hh="+hh +" def="+ cDeformation);
        	for (var i = 0; i < currentLine.length - 1; i++) {
            	lastPoint.x = currentLine[i + 1].x;
            	lastPoint.y = currentLine[i + 1].y;

            	if (settings.isBezier=='true') {
	                ctx.bezierCurveTo(
                        currentLine[i].x     + hh *  cDeformation, 
                        currentLine[i].y,
                        currentLine[i + 1].x - hh *  cDeformation, 
                        currentLine[i + 1].y,
                        currentLine[i + 1].x, 
                        currentLine[i + 1].y
                    );
    	        } else {
        	        ctx.lineTo((currentLine[i + 1].x),( currentLine[i + 1].y));
        	        //console.log("line to " +Math.abs(currentLine[i + 1].x)+ " y="+Math.abs( currentLine[i + 1].y) );
            	}
        	}

        	ctx.lineTo(width, height);
        	ctx.lineTo(0, height);
        	ctx.lineTo(0, currentLine[0].y);
        	ctx.moveTo(width,height);
        	ctx.fillStyle=fillColor;
        	ctx.strokeStyle=borderColor;
        	ctx.lineWidth=height/60;
        	ctx.closePath();
        	ctx.fill();
        	ctx.stroke();
    	}


 
		var draw = function () {
			var canvas = document.getElementById(canvas_id);
			var width  = canvas.width;
			var height = canvas.height;

			if (canvas.getContext) {
				var ctx = canvas.getContext('2d');

				ctx.fillStyle = settings.backColor;
				ctx.fillRect(0, 0, width, height);

        		//console.log("line1.length =")
        		for (var i = 0; i < line1.length; i++) {
            		currentLine[i].x = line1[i].x;
            		currentLine[i].y = line1[i].y;
            		//console.log("currentLine i="+i+ " x="+currentLine[i].x+ " y="+currentLine[i].y );
        		}
        		drawWavePolygone(ctx, width, height, fillColor1, borderColor1, 1);

        		for (var i = 0; i < line2.length; i++) {
            		currentLine[i].x = line2[i].x;
            		currentLine[i].y = line2[i].y;
        		}
        		drawWavePolygone(ctx, width, height, fillColor2, borderColor2, 2);

        		for (var i = 0; i < line3.length; i++) {
            		currentLine[i].x = line3[i].x;
            		currentLine[i].y = line3[i].y;
        		}
        		drawWavePolygone(ctx, width, height, fillColor3, borderColor3, 3);
			}
			frame++;
		};



 		// EVENT HANDLERS
		$this.click(
			function (e) {
				var $this = $(this);
				var offset = $this.offset();
				var canvas = document.getElementById(canvas_id);
				draw();
			}
		);

		//callables functions
		var output = {
		'regenere':function() {
			regenere();
			draw();
		},

		'resize':function() {
			compute_resize();
			randomizeLines(height);	
			createLines(nbPoints, width, height);
			draw();
		}
     };

        compute_resize();
        randomizeLines(height);	
		createLines(nbPoints, width, height);

        draw();

//--- 
  		startStop = setInterval(updateTimer, settings.time_interval_ms);
		return output;
	};

}(jQuery));