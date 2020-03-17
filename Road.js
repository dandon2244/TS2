 class Road {
  constructor(game, Points) {
    this.game = game;
	this.endInt = null;
	this.begInt = null;
    this.game.roads.push(this);
    this.Points = Points;
    this.width = 100;
	this.id = randomID();
	if(Points.length == 1){
	this.Points =[this.Points[0].copy(),new Point(0,0)]
		this.creating = true;
	}
	else{
 	this.Points = [this.Points[0].copy(),this.Points[1].copy()]
}

	this.length = this.Points[0].distanceBetween(this.Points[1]);
	if(!this.length){
		this.length = 0;
	}
	this.angle = this.Points[0].vectorTo(this.Points[1]).getAngle();
	if(!this.angle){
		this.angle = 0;
	}
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
	  var perp = this.line.vector.rotate(90).normalise();
	 
	 var i = this.Points[0].add(this.line.vector.times(10));
     if(Points.length == 2){
		 roadManager.createPaths(this);
		 this.lB = new sNode(this.game,i,"beg",this.leftL);
		 this.rE = new sNode(this.game,i,"end",this.rightL);
		 i = this.Points[1].minus(this.line.vector.times(10));
		 this.lE = new sNode(this.game,i,"end",this.leftL);
		 this.rB = new sNode(this.game,i,"beg",this.rightL);
	 }
	 else{
		 this.lB = new sNode(this.game,i,"beg",this.lineL);
		 this.rE = new sNode(this.game,i,"end",this.lineR);
		  i = this.Points[1].minus(this.line.vector.times(10));
		  this.lE = new sNode(this.game,i,"end",this.lineL);
		  this.rB = new sNode(this.game,i,"beg",this.lineR);
	 }
	 this.sR = new object(this.game,this.mRoad.absPos.copy().add3(new Vector(0,0,10)),"RECT",this.mRoad.size,"red");
	 this.sR.transparency =0.6;
	 this.sR.rendering = false;
	 this.mRoad.addSubObject(this.sR);
	 this.sR.setAbsPos(this.mRoad.absPos);
	 this.sR.setAngle(this.mRoad.angle);

	
	 this.lB.absPos.move(perp.times(this.width/4));
	 this.lB.render.absPos.z+=10;
	 this.lB.update();
	  
	 this.rE.absPos.move(perp.times(-this.width/4));
	 this.rE.render.absPos.z+=10;
	 this.rE.update();
	 
	 this.lE.absPos.move(perp.times(this.width/4));
	 this.lE.render.absPos.z+=10;
	 this.lE.update();
	 
	 
	 this.rB.absPos.move(perp.times(-this.width/4));
	 this.rB.render.absPos.z+=10;
	 this.rB.update();
	 
	 this.lB.connections.push(this.lE);
	 this.rB.connections.push(this.rE);
	
  }

  updateAttributes(pos) {

	this.Points[1] = pos.copy();
	if(this.ext){
		var l = new Line(this.game,this.Points[0],this.tVec,null);
		this.Points[1] = projectOntoLine(this.Points[1],l);
		l.delete();
	}
    
    var dx = this.Points[1].x - this.Points[0].x;
    var dy = this.Points[1].y - this.Points[0].y;

    this.angle = new Vector(dx,dy).getAngle();
	
	if(this.angle>87&&this.angle <93){
		var temp = this.angle;
		this.angle = 90;
		this.Points[1] = rotatePoint(90-temp,this.Points[0],this.Points[1]);
	}
	if(this.angle<-87&&this.angle >-93){
		var temp = this.angle;
		this.angle = -90;
		this.Points[1] = rotatePoint(-90-temp,this.Points[0],this.Points[1]);
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
		this.sR.setAbsPos(this.mRoad.absPos.copy().add3(new Vector(0,0,10)));
		this.sR.setAngle(this.mRoad.angle);
		this.lineStuff();
		
		
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
	for(var x = 0;x<this.game.roads.length;x++){
		var road = this.game.roads[x];
		if(road.id!= this.id){
			if(this.ext){
				var b = false
				for(var y = 0;y<this.exempts.length;y++){
					if(this.exempts[y].id == road.id){
					
						var b = true;
						continue;
					}
				}
			}
			if(b){
				this.line.clearInters();
				continue;
			}
			
			 var lInt = this.line.intersect(road.lineL);
			 var rInt = this.line.intersect(road.lineR);
			 if((rInt!=null&&rInt.constructor.name =="Point")||(lInt!=null&&lInt.constructor.name =="Point")){
				 inters.push(road);
			 }
			 else{
				 lInt = this.lineL.intersect(road.lineL);
				 rInt = this.lineL.intersect(road.lineR);
				 if((rInt!=null&&rInt.constructor.name =="Point")||(lInt!=null&&lInt.constructor.name =="Point")){
					inters.push(road);
				}
				else{
					lInt = this.lineR.intersect(road.lineL);
					rInt = this.lineR.intersect(road.lineR);
					 if((rInt!=null&&rInt.constructor.name =="Point")||(lInt!=null&&lInt.constructor.name =="Point")){
					inters.push(road);
					}
				}
			 }
			
		this.line.clearInters();
		this.lineL.clearInters();
		this.lineR.clearInters();
	}
	}
	if(inters.length>1){
		return false;
	}
	if(inters.length == 1){
		var otherRoad = inters[0];
		var others = roadManager.intersect(this,otherRoad)
		if(others == false){
			return false;
		}
	}
	
	roadManager.createPaths(this);
	this.lB.update(this.leftL);
	this.lE.update(this.leftL);
	
	this.rB.update(this.rightL);
	this.rE.update(this.rightL);
	
	
	if(inters.length ==1){
		roadManager.interway(this,others)
	}
	
	
	this.lineStuff();
	return true;
	
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
