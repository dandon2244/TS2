var rotatePoint = function(angle, origin, pos) {
  var dis = pos.minus(origin);
  
  if (dis.x == 0 && dis.y == 0) {
    return pos;
  }
  var ang = radians(angle);
  var dis2 = new Point(
    Math.cos(ang) * dis.x - Math.sin(ang) * dis.y,
    Math.sin(ang) * dis.x + Math.cos(ang) * dis.y
  );
  dis = dis2.minus(dis);
  return pos.add(dis);
}
var getByID = function(id,arr){
for(var x = 0;x<arr.length;x++){
	var obj = arr[x];
	if(obj.id == id){
		return obj;
	}
}
	return null;
	}

function keyToCode(key){
	for(const [k,v] of Object.entries(keyCodes)){
		if(v ==key){
			return k;
		}
	}
}
function randomCol(){
	var s = "#";
	var r;
	for(var x = 0;x<6;x++){
		r = parseInt(Math.random()*16);
		if(r<=9){
			s+=r.toString();
		}
		else{
			s+= String.fromCharCode(55+r)
		}
	}
	return s;
}
function radians(ang) {
  return (Math.PI * ang) / 180;
}
var isColliding = function(rect1, rect2) {
  var points1 = rect1.getPoints();
  var points2 = rect2.getPoints();
  var axes = getAxes(rect1);
  axes = axes.concat(getAxes(rect2));
  axes = axes.map(x => Maths.normalize(x));
  for (var a = 0; a < axes.length; a++) {
    var min1 = Math.min.apply(null, points1.map(p => p.dotProduct(axes[a])));
    var max1 = Math.max.apply(null, points1.map(p => p.dotProduct(axes[a])));
    //console.log(min1, max1);
    // console.log();
    var min2 = Math.min.apply(null, points2.map(p => p.dotProduct(axes[a])));
    var max2 = Math.max.apply(null, points2.map(p => p.dotProduct(axes[a])));
    //  console.log(min2, max2);
    if (max2 < min1 || max1 < min2) {
      return false;
    }
  }
 
  return true;
}
var randomID = function(){
	var c;
	var s = "";
	for(var x = 0; x<20;x++){
		c = parseInt(Math.random()*36);
		if(c<26){
			c = String.fromCharCode(65+c)
		}
		else{
			c-=26;
		}
		s+=String(c);
	}
	return s;
}
var getAxes = function(rect) {
  return [new Point(Maths.cos(rect.angle), Maths.sin(rect.angle)),new Point(Maths.cos(rect.angle + 90), Maths.sin(rect.angle + 90))];
}
var removeFromArray = function(obj,arr){
	arr.splice(arr.indexOf(obj),1);
}

var projectOntoLine = function(p,line){
	var perp = line.vector.rotate(90).normalise();
	var pLine = new Line(line.game,p.copy(),perp,null);
	var project = pLine.intersect(line);
	pLine.delete();
	return project;
}

