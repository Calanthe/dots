var c;
var ctx;

var Circle = {
	x : -1,
	y : -1,
	r : 0,
	color : -1,
	sub : -1,
	init : function (x,y,r,color,sub){
	  return{
		x : x,
		y : y,
		r : r,
		color : color,
		sub : sub
       };
	}
} 

var Dots = {
	dotsArray : [],
	startRadius : 80, //single circle has on start radius 80px width
	startDiameter : -1,
	level : 0,

	//variables for animation
	d0x : -10,
	d0y : -10,

	d1x : 10,
	d1y : -10,

	d2x : 10,
	d2y : 10,

	d3x : -10,
	d3y : 10,

	x0 : -1,
	y0 : -1,
	
	x1 : -1,
	y1 : -1,
	
	x2 : -1,
	y2 : -1,
	
	x3 : -1,
	y3 : -1,

	inter : -1,
	iterCounter : 0,
	tmpR : 0,
	
	firstIteration : 2,
	lastIteration : 4,

	initDots : function(canvasElement){

		c=canvasElement;
		ctx=c.getContext("2d");
		
		this.startDiameter = this.startRadius*2,
		this.dotsArray = [
					Circle.init(this.startRadius,this.startRadius,this.startRadius,this.getRandomColor(),-1), //each circle has x,y,r value, color and eventually small circles
					Circle.init(this.startRadius*3,this.startRadius,this.startRadius,this.getRandomColor(),-1),
					Circle.init(this.startRadius*3,this.startRadius*3,this.startRadius,this.getRandomColor(),-1),
					Circle.init(this.startRadius,this.startRadius*3,this.startRadius,this.getRandomColor(),-1)
					];
					
		for (var i = 0; i < 4; i++) { //lets start with 4 big dots
			this.drawCircle(this.dotsArray[i]);
		}

		c.addEventListener("mousemove",this.dotOnMouseOver,false);
	},
	
	dotOnMouseOver : function(element){
	
		var self = Dots;
		if (self.inter!=-1) return;	
		self.level = 0;
		var dot = self.getCursorPosition(element); //we have to know on witch circle mouse is over
		self.checkSide(dot,self.dotsArray,-1);
	},
	
	getCursorPosition : function(e) {
	
		var self = Dots;
		var x;
		var y;
		var iterator = self.calculateIterator(self.level);
		if (e.pageX != undefined && e.pageY != undefined) {
			x = e.pageX;
			y = e.pageY;
		}
		else {
			x = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
			y = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
		}
		x -= c.offsetLeft;
		y -= c.offsetTop;
		x = Math.min(x, self.startDiameter*iterator*2);
		y = Math.min(y, self.startDiameter*iterator*2);
	
		var circle = Circle.init(x,y,null);
		return circle;
	},

	checkSide : function(dot,curDotsArray,prevDotsArray){

		if (this.inter!=-1) return;
		if (prevDotsArray === -1) 
		{
			var prevx = this.startDiameter;
			var prevy = this.startDiameter;
		}
		else {
			var prevx = prevDotsArray.x;
			var prevy = prevDotsArray.y;
		}
		
		var side;
		var iterator = this.calculateIterator(this.level);
		var prevRadius = this.startRadius*this.calculateIterator(this.level-1);
		
		//lets check on which side is our cursor
		if ((dot.x < prevx) && (dot.y < prevy)) 
		{
			side = 0;
		}
		else if ((dot.y < prevy) && (dot.x >= prevx))
		{
			side = 1;
		}
		else if ((dot.y >= prevy) && (dot.x >= prevx))
		{
			side = 2;
		}
		else if ((dot.y >= prevy) && (dot.x < prevx)) 
		{
			side = 3;	
		}
		
		var helpX = curDotsArray[side].x;
		var helpY = curDotsArray[side].y;
		
		//console.log("side: "+side+", level: "+this.level+",inter: "+this.inter);
		
		this.level++;
		if (curDotsArray[side].sub === -1) //we have to check radius on last level
		{
			var calculatedR = Math.sqrt(Math.pow(helpX-dot.x,2) + Math.pow(helpY-dot.y,2));
			
			if (calculatedR <= this.startRadius*iterator) 
			{		
				this.mouseOnPiece(side,curDotsArray);
				//var self = this;
				//if (this.mouseOnPiece(side,curDotsArray)) setTimeout(function() { self.checkSide(dot,curDotsArray[side].sub,curDotsArray[side]); },500);
			}
		}
		else 
		{
			this.checkSide(dot,curDotsArray[side].sub,curDotsArray[side]); //check subarray if there is any
		}
	},
	
	mouseOnPiece : function(circleNo,curDotsArray) {
	
		if (this.level>=7)return false; //we cant see smaller dots so stop dividing
		
		var subColorArray = [];
		var newRadius = this.startRadius*this.calculateIterator(this.level);
		var prevRadius = this.startRadius*this.calculateIterator(this.level-1);
		
		for (var i = 0; i<4; i++)
		{
			subColorArray[i]=this.getRandomColor();
		}
		
		var subDotsArray = [
				Circle.init(curDotsArray[circleNo].x-newRadius,curDotsArray[circleNo].y-newRadius,newRadius,subColorArray[0],-1),
				Circle.init(curDotsArray[circleNo].x+newRadius,curDotsArray[circleNo].y-newRadius,newRadius,subColorArray[1],-1),
				Circle.init(curDotsArray[circleNo].x+newRadius,curDotsArray[circleNo].y+newRadius,newRadius,subColorArray[2],-1),
				Circle.init(curDotsArray[circleNo].x-newRadius,curDotsArray[circleNo].y+newRadius,newRadius,subColorArray[3],-1)
			];		

		this.x0 = curDotsArray[circleNo].x;
		this.y0 = curDotsArray[circleNo].y;

		this.x1 = this.x0;
		this.y1 = this.y0;

		this.x2 = this.x0;
		this.y2 = this.y0;

		this.x3 = this.x0;
		this.y3 = this.y0;
		
		curDotsArray[circleNo].sub = subDotsArray;
		
		var clearX = curDotsArray[circleNo].x-prevRadius;
		var clearY = curDotsArray[circleNo].y-prevRadius;
		var width = this.startDiameter*this.calculateIterator(this.level-1);
		var height = this.startDiameter*this.calculateIterator(this.level-1);
		
		var self = this;		
		this.inter = setInterval( function() { self.animateCircles(clearX,clearY,width,height,curDotsArray[circleNo].color,subColorArray); }, 50);	
		return true;	
	},
	
	animateCircles : function(clearX,clearY,width,height,pColor,subColorArray) { //pColor - parent color, subColorArray - array with new colors, they change after last iteration 

		if(this.iterCounter < (this.lastIteration+this.firstIteration)) {
	
			this.iterCounter++;
			var distIter; 
		
			if (this.iterCounter<=2) 
			{
				this.tmpR = this.startRadius*this.calculateIterator(this.level-1)-(this.iterCounter*20*this.calculateIterator(this.level-1));
				distIter = 3/2;
			}	
			else if (this.iterCounter>2 && this.iterCounter<=(this.lastIteration+this.firstIteration))
			{
				distIter = 1/4;	
			}
			
			this.x0 += this.d0x*this.calculateIterator(this.level-1)*distIter;
			this.y0 += this.d0y*this.calculateIterator(this.level-1)*distIter;
			
			this.x1 += this.d1x*this.calculateIterator(this.level-1)*distIter;
			this.y1 += this.d1y*this.calculateIterator(this.level-1)*distIter;
			  
			this.x2 += this.d2x*this.calculateIterator(this.level-1)*distIter;
			this.y2 += this.d2y*this.calculateIterator(this.level-1)*distIter;
			
			this.x3 += this.d3x*this.calculateIterator(this.level-1)*distIter;
			this.y3 += this.d3y*this.calculateIterator(this.level-1)*distIter;
				
			ctx.clearRect(clearX,clearY,width,height);
			
			ctx.beginPath();	  
			ctx.arc(this.x0,this.y0,this.tmpR,0,Math.PI*2,true);
			if (this.iterCounter === this.lastIteration+this.firstIteration) ctx.fillStyle=subColorArray[0];
			else ctx.fillStyle=pColor;
			ctx.closePath();
			ctx.fill(); 
			
			ctx.beginPath();	  
			ctx.arc(this.x1,this.y1,this.tmpR,0,Math.PI*2,true);
			if (this.iterCounter === this.lastIteration+this.firstIteration) ctx.fillStyle=subColorArray[1];
			else ctx.fillStyle=pColor;
			ctx.closePath();
			ctx.fill(); 
			
			ctx.beginPath();	  
			ctx.arc(this.x2,this.y2,this.tmpR,0,Math.PI*2,true);
			if (this.iterCounter === this.lastIteration+this.firstIteration) ctx.fillStyle=subColorArray[2];
			else ctx.fillStyle=pColor;
			ctx.closePath();
			ctx.fill(); 
			
			ctx.beginPath();	  
			ctx.arc(this.x3,this.y3,this.tmpR,0,Math.PI*2,true);
			if (this.iterCounter === this.lastIteration+this.firstIteration) ctx.fillStyle=subColorArray[3];
			else ctx.fillStyle=pColor;
			ctx.closePath();
			ctx.fill(); 		
		} 
		else 
		{		
			clearInterval(this.inter);
			this.inter=-1;
			this.iterCounter = 0;
		};
	},

	calculateIterator : function(level){
	
		if (level <= 0) return 1;
		else return 1/Math.pow(2,level);
	},

	getRandomColor : function(){
	
		var colorsArray = ['#E6399B','#992667','#CD0074','#E667AF','#BF3030','#A60000','#269926','#008500','#86B32D','#679B00','#FF0000','#FF4040','#FF7373','#00CC00','#39E639','#67E667',
				'#9FEE00','#B9F73E','#C9F76F','#009999','#1240AB','#FFAA00','#FF7400'];		

		var randomNumber = Math.floor(Math.random()*23);

		return colorsArray[randomNumber];
	},

	drawCircle : function(circle) {

		ctx.fillStyle=circle.color;
		ctx.beginPath();
		ctx.arc(circle.x,circle.y,circle.r,0,Math.PI*2,true);
		ctx.closePath();
		ctx.fill();
	} 
}
