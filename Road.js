 class Road {
  constructor(game, Points) {
    this.game = game;
    this.game.roads.push(this);
    this.Points = Points;
    this.width = 90;
	this.id = randomID();
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

	this.end = new node(this.game,this.Points[1].minus(vec.times(10)),"end");
	this.end.render.size = [20,this.width];
    this.beg = new node(this.game,this.Points[0].add(vec.times(10)),"beg");
	this.beg.render.size = [20,this.width];
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
	
	this.mRoad.addSubObject(this.beg.render);
	this.mRoad.addSubObject(this.end.render);
	this.end.update();
	this.beg.update();
this.mRoad.angle = this.angle;
this.mRoad.transparency = 0.7;
this.lineStuff();
     if(Points.length == 2){
		 roadManager.createPaths(this);
	 }
	 var perp = this.line.vector.rotate(90).normalise();
	 
	 var i = this.Points[0].add(this.line.vector.times(10));
	 this.lB = new sNode(this.game,i,"beg",this.lineL);
	 this.lB.absPos.move(perp.times(this.width/4));
	 this.lB.render.absPos.z+=10;
	 this.lB.update();
	 
	 this.rE = new sNode(this.game,i,"end",this.lineR);
	 this.rE.absPos.move(perp.times(-this.width/4));
	 this.rE.render.absPos.z+=10;
	 this.rE.update();
	 
	 i = this.Points[1].minus(this.line.vector.times(10));
	 this.lE = new sNode(this.game,i,"end",this.lineL);
	 this.lE.absPos.move(perp.times(this.width/4));
	 this.lE.render.absPos.z+=10;
	 this.lE.update();
	 
	 this.rB = new sNode(this.game,i,"beg",this.lineR);
	 this.rB.absPos.move(perp.times(-this.width/4));
	 this.rB.render.absPos.z+=10;
	 this.rB.update();
	
  }

  updateAttributes(pos) {
	//console.log(pos);
	this.Points[1] = pos.copy();
	//console.log(pos.toString());
    
    var dx = this.Points[1].x - this.Points[0].x;
    var dy = this.Points[1].y - this.Points[0].y;

    this.angle = new Vector(dx,dy).getAngle();
	
	if(this.angle>87&&this.angle <93){
		var temp = this.angle;
		this.angle = 90.1;
		this.Points[1] = rotatePoint(90.1-temp,this.Points[0],this.Points[1]);
	}
    
    this.length =
      (this.Points[0].x - this.Points[1].x) ** 2 +
      (this.Points[0].y - this.Points[1].y) ** 2;
    this.length = Math.sqrt(this.length);
	 this.centre = this.Points[0].add(new Vector(Maths.cos(this.angle),Maths.sin(this.angle)).times(this.length/2)) 
    
	this.mRoad.absPos = this.centre.copy();
       this.mRoad.size[0] = this.length;
       this.mRoad.angle = this.angle;
	   this.beg.angle = this.angle;
	  
		
	   var target = new Point(Maths.cos(this.angle),Maths.sin(this.angle)).times(this.length/2-(20/2)).add(this.centre.copy())
	   var target2= new Point(Maths.cos(this.angle),Maths.sin(this.angle)).times(this.length/2-(20/2)).times(-1).add(this.centre.copy());
	   var begRef = this.beg;
	   this.beg.absPos =(target2);
	   
	   //begRef.delete();
	  this.beg.angle = this.angle;
	  this.beg.update();
	   this.end.absPos = target;
	   this.end.angle = this.angle;
	   this.end.update();
	   this.lineStuff();
	   var perp = this.line.vector.rotate(90).normalise();
		
		var  l = this.Points[0].add(this.line.vector.times(10));
		
		this.lB.absPos = l.copy();
		this.lB.absPos.move(perp.times(this.width/4));
		this.lB.update();
		
		this.rE.absPos = l.copy();
		this.rE.absPos.move(perp.times(-this.width/4))
		this.rE.update();
		this.rE.update();
		
		l = this.Points[1].minus(this.line.vector.times(10));
		this.lE.absPos = l.copy();
		this.lE.absPos.move(perp.times(this.width/4));
		this.lE.update();
		
		this.rB.absPos = l.copy();
		this.rB.absPos.move(perp.times(-this.width/4));
		this.rB.update();
	

  }
  setAngle(ang) {
    this.mRoad.rotate(ang, false);
  }
  delete() {
    this.mRoad.deleteAll();
    this.game.roads.splice(this.game.roads.indexOf(this),1);
  }
  changePoint(point) {
    this.Points[1] = point;
    this.updateAttributes(point);
	this.lineStuff();
	var inters = [];
	this.game.roads.forEach((road)=> {
		if(road.id!= this.id){
			 var lInt = this.line.intersect(road.lineL);
			 var rInt = this.line.intersect(road.lineR);
			 if((rInt!=null&&rInt.constructor.name =="Point")||(lInt!=null&&lInt.constructor.name =="Point")){
				 if(inters.length == 1){
					
				 }
				 inters.push(road);
			 }
			
			
	}
	}
	);
	//this.line.clearInters();
	if(inters.length>1){
		this.delete()
		return;
	}
	if(inters.length == 1){
		var otherRoad = inters[0];
		var others = roadManager.intersect(this,otherRoad)
	}
	
	roadManager.createPaths(this);
	if(inters.length ==1){
		roadManager.interway(this,others)
	}
	
	this.line.clearInters();
	
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
