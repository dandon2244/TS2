
class Line {
  constructor(game,point, vector, length,beg= false) {
   this.game = game;
   this.id = randomID();
   	   this.inters = {}
	if(point instanceof Array){
	   this.beg = true;
	   this.begPoint = point[0].copy();
	   this.endPoint = point[1].copy();
	   this.centre = this.begPoint.add(this.endPoint).times(1/2);
	   this.vector = this.begPoint.vectorTo(this.endPoint);
	   this.length = this.vector.mag();
	   this.vector = Maths.normalize(this.vector)
	   this.angle = this.vector.getAngle();
	   if(Maths.equals(this.endPoint,this.begPoint)){
		   this.length = 0;
		   this.vector = new Vector(0,0);
		   this.angl = 0;
	   }
   }
   else{
		this.length = length;
		this.beg = beg
		
		this.vector = Maths.normalize(vector);
		this.angle = this.vector.getAngle();
		

	   
		if(this.length!= null){
			
			if(this.beg){
				this.begPoint = point.copy();
				this.centre = this.begPoint.add(this.vector.times(length/2));
				this.endPoint = this.begPoint.add(this.vector.times(this.length));	
			}
			else{
				this.centre = point.copy();
				this.begPoint = this.centre.minus(this.vector.times(this.length/2));
				this.endPoint = this.centre.add(this.vector.times(this.length/2))
				
			}
			
		}
		else{
			this.endPoint = null;
			this.endPoint = null;
			this.centre = point.copy();
		}
   }
	
	this.width = 3;
	this.render = new object(this.game,this.centre,"LINE",[this],"blue");
	//this.square = new object(this.game,new Point(0,0),"RECT",[2,2],"red");
	//this.square.angle = this.vector.getAngle();
	//this.render.addSubObject(this.square)
	
  }
  clearInters(){
	  for (const [key, value] of Object.entries(this.inters)) {
			if(value&&value instanceof Object){
			value.delete();
			}
			this.inters = {};
}
  }
  setPoints(Points){
	  this.Points = [Points[0].copy(),Points[1].copy()]
	  this.begPoint = this.Points[0];
	  this.endPoint = this.Points[1];
	  this.vector = Maths.normalize(this.begPoint.vectorTo(this.endPoint));
	  this.angle = this.vector.getAngle();
	  this.centre = this.begPoint.add(this.endPoint).times(1/2);
	  this.length = this.begPoint.distanceBetween(this.endPoint);
  }
  distanceFromPoint(p){
	  var perp = this.vector.rotate(90).normalise();
	  var l = new Line(this.game,this.centre.copy(),perp,null);
	  var i = l.intersect(this);
	  l.delete();
	  return i.distanceBetween(p);
	  
  }
  rotate(ang,DT=true){
	  this.render.rotateAll(ang,DT);
  }
  delete(){
	  this.render.deleteAll();
  }
  update(){
	  this.vector = Maths.normalize(this.vector)
	  if(this.length!=null){
		  this.begPoint = this.centre.minus(this.vector.times(this.length/2))
		  this.endPoint = this.centre.add(this.vector.times(this.length/2))
		  this.length = this.begPoint.distanceBetween(this.endPoint);
		  this.vector = this.begPoint.vectorTo(this.endPoint).normalise();
		  this.angle = this.vector.getAngle();
	  }
	 
	 // this.game.log = this.render.absPos.minus(this.square.absPos).toString();
   
  }
  copy(){
	  if(this.length!=null){
	  return new Line(this.game,[this.begPoint.copy(),this.endPoint.copy()])
	  }
	  return new Line(this.game,this.centre.copy(),this.vector.copy(),null)
  }
  extend(){
	  return new Line(this.game,this.centre.copy(),this.vector.copy(),null);
  }
  intersect(other){
	  if(!other){
	console.log("YO");
	return null;
	}

	  var oID = other.id;
	   if(oID in this.inters){
		removeFromArray(this.inters[oID],this.render.subObjects)
		this.inters[oID].delete();
	  }
	  
	 
	  other.vector = other.vector.normalise();
	  this.vector = this.vector.normalise();
	  if(Maths.equals(this.vector,other.vector)){ //parallel
		 if(this.pointOnLine(other.centre)){ // same Line
			 return other
		 }
		 else{
			 return null;
		 }
	  }
	  else{ // not parallel
	      var oID = other.id;
		 // console.log(oID);
		  var y = this.centre.y
		  var x = this.centre.x
		  var c = other.centre.x;
		  var a  = this.vector.x;
		  var b = this.vector.y;
		  var d =  other.centre.y;
		  var e = other.vector.x;
		  var f = other.vector.y;
		  if(a == 0){
			  if(b == 0){
				  return null;
				  
			  }
			  var mu = (x+(d-y)*a/b -c)/(e-a*f/b);
		  }
		  else{
		  var mu = (y+(c-x)*b/a - d)/(f-b*e/a);
		  }
		  var intPoint = other.centre.add(other.vector.times(mu))
		  intPoint.z+=1;
		 // if(!mu){
			 // console.log("HERE");
		  //}
		  if((this.pointOnLine(intPoint)&&other.pointOnLine(intPoint))){
			  
	  
			  this.inters[oID] = new object(this.game,new Point(0,0),"CIRCLE",[7,0,2*Math.PI],"green");
			//  console.log(this.id,other.id)
			 // console.log(this,other)
			 this.render.addSubObject(this.inters[oID])
			 // console.log(this.inter.absPos.toString())
			 this.inters[oID].setAbsPos(intPoint);
			 this.inters[oID].absPos.z+=10;
			 this.inters[oID].line = this;
			// console.log(this.inter.absPos);
			//console.log(this.inters[other].absPos.toString());

			  return this.inters[oID].absPos.copy();
		  }
	  }
	  return null;
  }
  pointOnLine(p){
	  if(Maths.equals(this.vector.x,0)){
		   
		  if(Maths.equals(this.vector.y, 0)){
			  return false;
		  } 
		  
		  else{
			var lam = (p.y-this.centre.y)/this.vector.y
			var oX = this.centre.x+lam*this.vector.x;
			if(Maths.round(oX,5)== Maths.round(p.x,5)){
				console.log("YOOO");
				return true;
			}
			else{
				return false;
			}
		  }
	  }
	  else{
		  var lam = (p.x-this.centre.x)/this.vector.x
		  var oY = this.centre.y+lam*this.vector.y;
	
		  if(Maths.round(oY,5)==Maths.round(p.y,5)){
			  if(this.length == null){
			  return true;
			  }
			  var dis = p.minus(this.begPoint).x/this.vector.x;
		
			  if(dis<=this.length&&dis>=0){
				  return true
			  }
		  }
		 
	  }
	   return false;
  }
  
}
