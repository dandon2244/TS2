 class Road {
  constructor(game, Points) {
    this.game = game;
    this.game.roads.push(this);
    this.Points = Points;
    this.width = 200;
	
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
      [this.length, 200],
      "black","road",true
    );
	
	this.mRoad.addSubObject(this.beg);
	this.mRoad.addSubObject(this.end);
	this.beg.setAbsPos(this.beg.relPos);
	this.end.setAbsPos(this.end.relPos);
this.mRoad.angle = this.angle;
this.mRoad.transparency = 0.7;
     
	
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
    if(this.mRoad){
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
	//this.mRoad.transparency = 1;
	this.creating = false;
    this.Points[1] = point;
    this.updateAttributes(point);
	//console.log(this.angle)
    this.mRoad.absPos = this.centre;
    this.mRoad.size[0] = this.length;
    this.mRoad.angle = this.angle;
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
	if(inters.length>1){
		this.delete();
		return;
	}
	if(inters.length == 1){
		var otherRoad = inters[0];
		var nLine = new Line(this.game,this.line.centre.copy(),this.line.vector.copy(),null);
		var lengths = [nLine.intersect(inters[0].lineL),nLine.intersect(inters[0].lineR)]
		nLine.delete();
		if(lengths[0] == null){
			this.incomeR = inters[0].lineR;
		}
		else if(lengths[1] == null){
			this.incomeR = inters[0].lineL;
		}
		else{
			lengths = lengths.map(x=>x.distanceBetween(this.line.centre));
			if(lengths[0]<lengths[1]){
				this.incomeR = inters[0].lineL;
			}
			else{
				this.incomeR = inters[0].lineR;
			}
		}
		var lE = this.lineL.extend();
		var rE = this.lineR.extend();
		var lengths = [this.lineL.begPoint.distanceBetween(lE.intersect(this.incomeR)),this.lineR.begPoint.distanceBetween(rE.intersect(this.incomeR))]
		var length = Math.max(lengths[0],lengths[1])
		//rE.delete();
		//lE.delete();
	  //  var lInter = this.lineL.intersect(this.incomeR)
		//var interPoint = nLine.intersect(inters[0].line);
		//nLine.delete();
		this.updateAttributes(this.line.begPoint.add(this.line.vector.times(length)));
		var endRoad = otherRoad.end.absPos.copy();
		endRoad =[lE.distanceFromPoint(endRoad),rE.distanceFromPoint(endRoad)];
		if(endRoad[0] < endRoad[1]){
			var endLine =lE
		}
		else{
			var endLine = rE;
		}
		new object(this.game,otherRoad.end.absPos.copy(),"CIRCLE",[5],"green")
		var lengths = [otherRoad.lineL.intersect(endLine)];
		lengths.push(otherRoad.lineR.intersect(endLine));
		lengths[0] = lengths[0].distanceBetween(otherRoad.lineL.endPoint);
		lengths[1] = lengths[1].distanceBetween(otherRoad.lineR.endPoint);
		otherRoad.lineR.clearInters();
		otherRoad.lineL.clearInters();
		var otherV = otherRoad.line.vector.copy();
		var otherP = otherRoad.Points[1].copy();
		//otherRoad.delete();
		if(lengths[0]>lengths[1]){
			var r =new Road(this.game,[otherP.add(otherV.times(-lengths[0])),otherP])
			
		}
		else{
			var r = new Road(this.game,[otherP.add(otherV.times(-lengths[1])),otherP])
			
		}
		console.log(r.Points[0].toString());
		//this.beg.rendering = false;
		//this.end.rendering = false;
		
		//this.rightPath = new object(t)
		//console.log(leftCent.toString());
	}
	//console.log(inters.length);
	var perp = this.line.vector.rotate(90).normalise();
		var leftCent = this.centre.copy()
		leftCent.move(perp.times(this.mRoad.size[1]/4));
		this.leftPath = new object(this.game,new Point(0,0),"RECT",[this.length,this.mRoad.size[1]/2],"yellow");
		this.leftPath.angle = this.angle;
		this.mRoad.addSubObject(this.leftPath);
		this.leftPath.setAbsPos(leftCent);
		this.rightPath = new object(this.game,new Point(0,0),"RECT",[this.length,this.mRoad.size[1]/2],"orange");
		var rightCent = this.centre.copy();
		rightCent.move(perp.times(-this.mRoad.size[1]/4));
		this.mRoad.addSubObject(this.rightPath);
		this.rightPath.setAbsPos(rightCent);
		this.rightPath.angle = this.angle;
		this.leftPath.rendering = false;
		this.rightPath.rendering = false;
  }
  lineStuff(){
	  this.line = new Line(this.game,this.Points);
	var perp = Maths.normalize(this.line.vector.rotate(90))
	var lBeg = this.line.begPoint.add(perp.times(this.mRoad.size[1]/2))
	var rBeg = this.line.begPoint.minus(perp.times(this.mRoad.size[1]/2))
	this.lineL = new Line(this.game,lBeg,this.line.vector.copy(),this.line.length,true);
	this.lineR = new Line(this.game,rBeg,this.line.vector.copy(),this.line.length,true);
	this.mRoad.addSubObject(this.lineL.render);
	this.mRoad.addSubObject(this.lineR.render);
	this.mRoad.addSubObject(this.line.render);
	this.line.render.rendering =false;  
  }
}
