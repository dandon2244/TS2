
class Maths{
static  cos(angle) {
  return Math.cos((angle * Math.PI) / 180);
}
static  sin(angle) {
  return Math.sin((angle * Math.PI) / 180);
}
static random(lower,upper){
	return parseInt(Math.random()*(upper+1-lower)+lower);
}
static  normalize(vec) {
	if(Maths.equals(vec,new Vector(0,0))){
		return vec.copy();
	}
  var mag = vec.x * vec.x + vec.y * vec.y;
  mag = Math.sqrt(mag);
  return vec.times(1 / mag);
}
static round(num,places){
	return parseFloat(num.toFixed(places));
}
static equals(v1,v2){
	if(typeof v1!= typeof v2){
		return false;
	}
	if(typeof v1 == "number"){
		if(Maths.round(v1,6) == Maths.round(v2,6))
			return true
		return false;
	
	}
	if(typeof v1 == "object"){
		if(v1.constructor.name!= v2.constructor.name){
			return false;
		}
		if (v1.constructor.name == "Point" || v1.constructor.name == "Vector"){
			if(Maths.equals(v1.x,v2.x) && Maths.equals(v1.y,v2.y)){
				return true;
			}
		}
	}
	return false;
}

static triArea(points){
	if(points.length!= 3){
		return null;
	}
	return Math.sqrt(((points[0].x*(points[1].y-points[2].y)+points[1].x*(points[2].y-points[0].y) + points[2].x*(points[0].y-points[1].y))/2)**2)
}
}
