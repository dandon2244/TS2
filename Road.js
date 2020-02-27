 class Road {
  constructor(game, Points) {
    this.game = game;
    this.game.roads.push(this);
    this.Points = Points;
    this.width = 130;
	
	this.creating = false;
	if(Points.length == 1){
	this.Points =[this.Points[0].copy(),new Point(0,0)]
		this.creating = true;
	}
	else{
 	this.Points = [this.Points[0].copy(),this.Points[1].copy()]
	
}


	this.length = this.Points[0].distanceBetween(this.Points[1]);
	this.angle = this.Points[0].vectorTo(this.Points[1]).getAngle();
	var vec = new Vector(Maths.cos(this.angle),Maths.sin(this.angle));

this.end = new object(this.game,this.Points[1].minus(vec.times(10)),"RECT",[20,this.width],"orange");
    this.beg = new object(this.game,this.Points[0].add(vec.times(10)),"RECT",[20,this.width],"yellow");
     this.beg.angle = this.angle;
	 
	
     this.end.angle = this.angle;
    this.centre = this.Points[0].add(new Vector(Maths.cos(this.angle),Maths.sin(this.angle)).times(this.length/2)) 
        this.mRoad = new object(
      this.game,
      this.centre,
      "RECT",
      [this.length, this.width],
      "black","road",true
    );
	
	this.mRoad.addSubObject(this.beg);
	this.mRoad.addSubObject(this.end);
	this.beg.setAbsPos(this.beg.relPos);
	this.end.setAbsPos(this.end.relPos);
this.mRoad.angle = this.angle;
this.mRoad.transparency = 0.7;
     if(Points.length == 2){
		 this.lineStuff();
		 roadManager.createPaths(this);
	 }
	
  }

  updateAttributes(pos) {
	//console.log(pos);
	this.Points[1] = pos.copy();
	//console.log(pos.toString());
    
    var dx = this.Points[1].x - this.Points[0].x;
    var dy = this.Points[1].y - this.Points[0].y;

    this.angle = new Vector(dx,dy).getAngle();
	if(this.angle>87&&this.angle <93){
		this.angle = 90;
	}
    
    this.length =
      (this.Points[0].x - this.Points[1].x) ** 2 +
      (this.Points[0].y - this.Points[1].y) ** 2;
    this.length = Math.sqrt(this.length);
	 this.centre = this.Points[0].add(new Vector(Maths.cos(this.angle),Maths.sin(this.angle)).times(this.length/2)) 
	 var target = this.Points[0].add(this.Points[1]).times(1/2)
    
		this.mRoad.absPos = this.centre.copy();
       this.mRoad.size[0] = this.length;
       this.mRoad.angle = this.angle;
	   this.beg.angle = this.angle;
	  
	   this.end.absPos = this.centre.copy();
	   this.beg.absPos = this.centre.copy();
	   var target = new Point(Maths.cos(this.angle),Maths.sin(this.angle)).times(this.length/2-(20/2)).add(this.centre.copy())
	   var begRef = this.beg;
	   this.beg =  new object(this.game,target.minus(this.beg.absPos).times(-1),"RECT",[20,this.mRoad.size[1]]);
	   this.beg.colour = begRef.colour; 
	   this.beg.angle = this.angle;
	   begRef.delete();
	   var endRef = this.end;
	   this.end = new object(this.game,target.minus(this.end.absPos),"RECT",[20,this.mRoad.size[1]]);
	   this.end.angle = this.angle;
	   this.end.colour = endRef.colour;
	   this.mRoad.addSubObject(this.beg);
	   this.mRoad.addSubObject(this.end);
	   endRef.delete()
	  

  }
  setAngle(ang) {
    this.mRoad.rotate(ang, false);
  }
  delete() {
    this.mRoad.deleteAll();
    this.game.roads.splice(this.game.roads.indexOf(this),1);
  }
  changePoint(point) {
	this.beg.rendering=false;
	this.end.rendering = false;
    this.mRoad.subObjects[1].colour = "red";
    this.Points[1] = point;
    this.updateAttributes(point);
	this.lineStuff();
	var inters = [];
	this.game.roads.forEach((road)=> {
		if(road!= this){
			 var lInt = this.line.intersect(road.lineL);
			 var rInt = this.line.intersect(road.lineR);
			 if((rInt!=null&&rInt.constructor.name =="Point")||(lInt!=null&&lInt.constructor.name =="Point")){
				 if(rInt!=null&&lInt!=null){
					// console.log("both");
				 }
				 inters.push(road);
			 }
		}
	}
	);
	this.line.clearInters();
	if(inters.length>1){
		this.delete();
		return;
	}
	if(inters.length == 1){
		var otherRoad = inters[0];
		roadManager.intersect(this,otherRoad)
	
	}
	
	roadManager.createPaths(this);
  }
  lineStuff(){
		var perp = Maths.normalize(this.Points[0].vectorTo(this.Points[1]).rotate(90))
		var lBeg = this.Points[0].add(perp.times(this.mRoad.size[1]/2))
		var lEnd = this.Points[1].add(perp.times(this.mRoad.size[1]/2))
		var rBeg = this.Points[0].minus(perp.times(this.mRoad.size[1]/2))
		var rEnd = this.Points[1].minus(perp.times(this.mRoad.size[1]/2))
	  if(this.line){
		this.line.setPoints(this.Points)
		this.lineL.setPoints([lBeg,lEnd]);
		this.lineR.setPoints([rBeg,rEnd]);
		
	  }
	  else{
		  this.line = new Line(this.game,this.Points);
		  //this.line.render.rendering = false;
		  this.lineL = new Line(this.game,[lBeg,lEnd])
		  //var lE =this.lineL.extend();
		 // lE.render.setAbsPos(new Point(0,0));
		  this.lineR = new Line(this.game,[rBeg,rEnd]) ;
		  //this.lineL.extend();
		  this.mRoad.addSubObject(this.lineL.render);
		  this.mRoad.addSubObject(this.lineR.render);
		 // this.mRoad.addSubObject(lE.render);
		  this.mRoad.addSubObject(this.line.render);	
	  }

  }
}
