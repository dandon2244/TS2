class Camera {
  constructor(pos, game) {
    this.game = game;
    this.position = pos;
    this.centre = new Point(game.canvas.width / 2, game.canvas.height / 2);
  }
  move(dir) {
    this.position.move(dir.times3(this.game.DT));
  }
  gameToScreenPos(pos) {
    var z = this.position.z;
	var y =   pos.y / z + this.centre.y * (1 - 1 / z) - this.position.y / z;
	var x =  pos.x / z + this.centre.x * (1 - 1 / z) - this.position.x / z;

    return new Point(x,y);
  }
  screenToGamePos(pos) {
    var z = this.position.z;
    var x = (pos.x + this.position.x / z - this.centre.x * (1 - 1 / z)) * z;
    var y = (pos.y + this.position.y / z - this.centre.y * (1 - 1 / z)) * z;
    return new Point(x, y);
  }
}

 class Car {
  constructor(position, colour, game, scale = 1) {
    this.selected = false;
    this.game = game;
	this.game.cars.push(this);
    this.mouseOffset = [false, [0, 0]];
    this.position = position;
    this.colour = colour;
	this.id = randomID();
    this.angle = 0;
    this.speed = 1;
    this.gamePos = position;
    this.frame = new object(
      this.game,
      position.copy(),
      "RECT",
      [60 * scale, 35 * scale],
      "random",
      "frame",
      true
    );
    this.hitBox = new object(
      game,
      new Point(this.frame.size[0] / 2 + 30, 0),
      "RECT",
      [60, this.frame.size[1], 3],
      "red",
      "hitbox",
      true
    );
    this.hitBox.rendering = false;
    this.window = new object(
      game,
      new Point(this.frame.size[0] / 2 - 10, 0, 2),
      "RECT",
      [20, this.frame.size[1]],
      "#d8e8e6","window",true
    );
    this.leftHead = new object(
      game,
      new Point(-this.frame.size[0] / 2 + 4, -this.frame.size[1] / 2 + 4, 1),
      "RECT",
      [8, 8],
      "red"
    );
    this.rightHead = new object(
      game,
      new Point(-this.frame.size[0] / 2 + 4, this.frame.size[1] / 2 - 4, 1),
      "RECT",
      [8, 8],
      "red"
    );
    this.leftGlows = [];
    for (var x = 0; x < 4; x++) {
      var glow = new object(
        game,
        new Point(0, 0, 0.4),
        "CIRCLE",
        [30 - 30 / (x + 1), 135 * (Math.PI / 180), 235 * (Math.PI / 180)],
        "orange"
      );
      glow.transparency = 0.3;
      this.leftGlows.push(glow);
    }
    this.leftGlow = new object(game, new Point(0, 0));
    this.selectedFrame = new object(
      game,
      new Point(0, 0, 3),
      "RECT",
      [this.frame.size[0], this.frame.size[1]],
      "green"
    );
    this.selectedFrame.transparency = 0.9;
    this.selectedFrame.rendering = false;
    this.frame.addSubObject(this.hitBox);
    this.frame.addSubObject(this.window);
    this.frame.addSubObject(this.selectedFrame);
    this.frame.addSubObject(this.leftHead);
    this.frame.addSubObject(this.rightHead);
    this.leftHead.addSubObject(this.leftGlow);
    for (var x = 0; x < this.leftGlows.length; x++) {
      this.leftGlow.addSubObject(this.leftGlows[x]);
    }
    this.leftGlow.setAllRendering(true);
    this.leftLight = false;
  }
  setLeftLight(val) {
    this.leftLight = val;
  }
  move(vec, DT = true) {
    this.position.move(vec.times(DT ? this.game.DT : 1));
    this.frame.moveAll(vec, DT);
  }
  rotate(angle, DT = true) {
    this.angle += angle * (DT ? this.game.DT : 1);

    this.frame.rotateAll(angle, this.frame.absPos, DT);
  }

  update() {
    if (this.angle > 360) {
      this.angle -= 360;
    }
    if (this.angle < 0) {
      this.angle += 360;
    }
    if (this.selected) {
      this.selectedFrame.rendering = true;
      if (this.mouseOffset[0] == false) {
        this.mouseOffset[1] = this.game.camera.screenToGamePos(
          this.game.mousePos
        );
        this.mouseOffset[0] = true;
        this.thisOff = this.mouseOffset[1].minus(this.position);
      }
      if (this.frame.collStates["frame"][0]||this.frame.collStates["endNode"][0]) {
        this.selectedFrame.colour = "red";
      } else {
        this.selectedFrame.colour = "green";
      }
      var target = this.game.camera.screenToGamePos(this.game.mousePos);
      target = target.minus(this.thisOff);
      var dif = target.minus(this.position);
      dif.z = 0;
      this.move(dif, false);
    } else {
      this.mouseOffset[0] = false;
      this.selectedFrame.rendering = false;
    }
   
    if (this.leftLight) {
      this.leftHead.colour = "orange";
      this.leftGlow.setAllRendering(true);
    } else {
      this.leftHead.colour = "red";
      this.leftGlow.setAllRendering(true);
    }
  }
  select(val) {
    if (!val == this.selected) {
      this.selected = val;
      if (val) {
        this.move(new Vector(0, 0, 5), false);
      } else {
        this.move(new Vector(0, 0, -5), false);
      }
    }
  }
  run() {
    if (this.position.x < 3000) {
    } else {
      if (this.position.x > 3000) {
        this.move(
          new Vector(
            -10 * Math.cos((-this.angle * Math.PI) / 180),
            -10 * Math.sin((-this.angle * Math.PI) / 180)
          )
        );
      }
      if (this.angle < 90) {
        this.rotate(90);
      }
    }
    if (!this.hitBox.collStates["frame"][0]) {
      if (this.position.y > -3000) {
        this.move(
          new Vector(
            100 * Math.cos((-this.angle * Math.PI) / 180),
            100 * Math.sin((-this.angle * Math.PI) / 180)
          )
        );
      }
    }
    //this.rotate(90);
  }
  delete() {
    this.frame.deleteAll();
    this.game.cars.splice(this.game.cars.indexOf(this), 1);
  }
  turn(pos,angle){
	 this.position = pos.copy();
	 this.frame.setAbsPos(pos);
	 this.rotate(angle-this.angle,false);
	 return true;
  }
}

﻿const keyCodes = {
  0: "That key has no keycode",
  3: "break",
  8: "backspace / delete",
  9: "tab",
  12: "clear",
  13: "enter",
  16: "shift",
  17: "ctrl",
  18: "alt",
  19: "pause/break",
  20: "caps lock",
  21: "hangul",
  25: "hanja",
  27: "escape",
  28: "conversion",
  29: "non-conversion",
  32: "spacebar",
  33: "page up",
  34: "page down",
  35: "end",
  36: "home",
  37: "left arrow",
  38: "up arrow",
  39: "right arrow",
  40: "down arrow",
  41: "select",
  42: "print",
  43: "execute",
  44: "Print Screen",
  45: "insert",
  46: "delete",
  47: "help",
  48: "0",
  49: "1",
  50: "2",
  51: "3",
  52: "4",
  53: "5",
  54: "6",
  55: "7",
  56: "8",
  57: "9",
  58: ":",
  59: "semicolon (firefox), equals",
  60: "<",
  61: "equals (firefox)",
  63: "ß",
  64: "@ (firefox)",
  65: "a",
  66: "b",
  67: "c",
  68: "d",
  69: "e",
  70: "f",
  71: "g",
  72: "h",
  73: "i",
  74: "j",
  75: "k",
  76: "l",
  77: "m",
  78: "n",
  79: "o",
  80: "p",
  81: "q",
  82: "r",
  83: "s",
  84: "t",
  85: "u",
  86: "v",
  87: "w",
  88: "x",
  89: "y",
  90: "z",
  91: "Windows Key / Left ⌘ / Chromebook Search key",
  92: "right window key",
  93: "Windows Menu / Right ⌘",
  95: "sleep",
  96: "numpad 0",
  97: "numpad 1",
  98: "numpad 2",
  99: "numpad 3",
  100: "numpad 4",
  101: "numpad 5",
  102: "numpad 6",
  103: "numpad 7",
  104: "numpad 8",
  105: "numpad 9",
  106: "multiply",
  107: "add",
  108: "numpad period (firefox)",
  109: "subtract",
  110: "decimal point",
  111: "divide",
  112: "f1",
  113: "f2",
  114: "f3",
  115: "f4",
  116: "f5",
  117: "f6",
  118: "f7",
  119: "f8",
  120: "f9",
  121: "f10",
  122: "f11",
  123: "f12",
  124: "f13",
  125: "f14",
  126: "f15",
  127: "f16",
  128: "f17",
  129: "f18",
  130: "f19",
  131: "f20",
  132: "f21",
  133: "f22",
  134: "f23",
  135: "f24",
  144: "num lock",
  145: "scroll lock",
  151: "airplane mode",
  160: "^",
  161: "!",
  162: "؛ (arabic semicolon)",
  163: "#",
  164: "$",
  165: "ù",
  166: "page backward",
  167: "page forward",
  168: "refresh",
  169: "closing paren (AZERTY)",
  170: "*",
  171: "~ + * key",
  172: "home key",
  173: "minus (firefox), mute/unmute",
  174: "decrease volume level",
  175: "increase volume level",
  176: "next",
  177: "previous",
  178: "stop",
  179: "play/pause",
  180: "e-mail",
  181: "mute/unmute (firefox)",
  182: "decrease volume level (firefox)",
  183: "increase volume level (firefox)",
  186: "semi-colon / ñ",
  187: "equal sign",
  188: "comma",
  189: "dash",
  190: "period",
  191: "forward slash / ç",
  192: "grave accent / ñ / æ / ö",
  193: "?, / or °",
  194: "numpad period (chrome)",
  219: "open bracket",
  220: "back slash",
  221: "close bracket / å",
  222: "single quote / ø / ä",
  223: "`",
  224: "left or right ⌘ key (firefox)",
  225: "altgr",
  226: "< /git >, left back slash",
  230: "GNOME Compose Key",
  231: "ç",
  233: "XF86Forward",
  234: "XF86Back",
  235: "non-conversion",
  240: "alphanumeric",
  242: "hiragana/katakana",
  243: "half-width/full-width",
  244: "kanji",
  251: "unlock trackpad (Chrome/Edge)",
  255: "toggle touchpad"
};

const mouseModes = {
  auto: "auto",
  roadGreen: "url('GreenCursor.png'),auto",
  carSelect:"auto",
  delete:"auto"
};


class Input{
static genKeyFunctions() {
  let keyFunctions = {};

  keyFunctions["spacebar"] = function(type, game) {
    if (type == "TAPPED") {
      game.running = !game.running;
    }
  };
  keyFunctions["c"] = function(type, game) {
    if (type == "TAPPED") {
      console.clear();
    }
  };
  keyFunctions["z"] = function(type, game) {
    if (type == "TAPPED") {
		 console.log(game.keys[keyToCode("ctrl")]);
      if(game.keys["q"]){
		 
	  }
    }
  };
  
  keyFunctions["r"] = function(type, game) {
    if (type == "TAPPED") {
      if (game.selected == null) {
        if (game.mouseMode != "roadGreen") {
          game.changeMouseMode("roadGreen");
        } else {
          game.changeMouseMode("auto");
        }
      } else {
        game.selected.delete();
        game.selected = null;
      }
    }
  };
  keyFunctions["d"] = function(type, game) {
    if (type == "TAPPED") {
      game.changeMouseMode("delete");
    }
  };
  keyFunctions["a"] = function(type,game){
	if(type == "TAPPED"){
		var pos = game.camera.screenToGamePos(game.mousePos);
		console.log(projectOntoLine(pos,game.roads[0].line).toString());
	}  
  };

  keyFunctions["l"] = function(type, game) {
	  if(type == "TAPPED"){
		  game.objects.push(game.save[0].render);
			//for(var x = 0;x<game.objects.length;x++){
				//if(game.objects[x].line && (game.objects[x].line.id == game.save[0].id)){
				//	console.log("HERE");
				//}
			//}
		//	game.save[0].render.render();
	  }
	  game.save[0].render.render();
  };
  keyFunctions["s"] = function(type, game) {
    if (type == "TAPPED") {

    }
  };
  keyFunctions["h"] = function(type, game) {
    if (type == "TAPPED") {
      game.cars.forEach(function(o, index) {
        o.hitBox.rendering = !o.hitBox.rendering;
      });
    }
  };
  keyFunctions["i"] = function(type, game) {
    game.camera.move(new Vector(0, 0, 3));
  };
  keyFunctions["k"] = function(type, game) {
    game.camera.move(new Vector(0, 0, -3));
  };

  keyFunctions["up arrow"] = function(type, game) {
    game.camera.move(new Vector(0, 200, 0).times(game.camera.position.z));
  };
  keyFunctions["left arrow"] = function(type, game) {
    game.camera.move(new Vector(-400, 0, 0).times(game.camera.position.z));
  };
  keyFunctions["right arrow"] = function(type, game) {
    game.camera.move(new Vector(400, 0, 0).times(game.camera.position.z));
  };
    keyFunctions["down arrow"] = function(type, game) {
    game.camera.move(new Vector(0, -200, 0).times(game.camera.position.z));
  };
  return keyFunctions;
}

static processMouse(game, point) {

  if (game.mouseMode == "auto") {
	var cars = []
    for (var i = 0; i < game.cars.length; i++) {
      if (game.cars[i].frame.pointWithinRender(point)) {
		cars.push(game.cars[i])
		game.changeMouseMode("carSelect")
      }
    }
	if(cars.length > 0){
		var h = cars[0].frame.absPos.z;
		var cur;
		for(var x =0;x<cars.length;x++){
			for(var n = 0;n<game.objects.length;n++){
				if(game.objects[n].ID == cars[x].frame.ID){
				//	console.log(n,x);
					var p = n;
				}
			}
			if(p>=h){
				h = p;
				cur = cars[x];
			}
		}
		game.selected =  cur;
		game.selected.select(true);
	}
    
  }
  else if(game.mouseMode == "delete"){
	for(var i = 0;i<game.roads.length;i++){
		if(game.roads[i].mRoad.pointWithinRender(point)){	
			game.roads[i].delete();
		}
	}
}
  else if(game.mouseMode == "carSelect"){
	  game.selected.select(false);
	  game.selected =  null;
	  game.changeMouseMode("auto");
  }
  else if (game.mouseMode == "roadGreen") {
	  var p = game.camera.screenToGamePos(point);
	   var P = p.copy()
	   var ext = false;
	  if (game.road == null) {
		for(var x = 0; x<game.intersections.length;x++){
			var inter = game.intersections[x]
			if(inter.render.pointWithinRender(point)){
				P = inter.render.absPos.copy();
				ext = true;
				var vec;
				if(inter.ax1.length ==1){
					vec = inter.ax1[0].line.vector.copy();
				}
				else{
					vec = inter.ax2[0].line.vector.copy();
				}
				console.log(inter.ax2[0].line.intersect(inter.ax1[0].lineL.extend()))
					//inter.ax1[0].line.intersect(inter.ax2[1].line)
			}
		}
	 

      game.road = new Road(game, [P]);
	  game.road.ext = ext;
	  
	  if(ext){
		  game.road.tVec = vec;
	  }
    } else {
      game.road.changePoint(p);
      game.road = null;
    }
  }
}
}

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
	for(var x = 0; x<6;x++){
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

class Map {
  constructor(game) {
    this.game = game;
    this.size = 500;
     var colliders = this.game.objects.filter(function(obj) {
      return obj.collider;
    });
    this.xValues = colliders.map(o => o.getPoints().map(p => p.x));
    this.xValues = [].concat.apply([], this.xValues);
    this.yValues = colliders.map(o => o.getPoints().map(p => p.y));
    this.yValues = [].concat.apply([], this.yValues);
    this.hX = Math.max.apply(null, this.xValues);
    this.lX = Math.min.apply(null, this.xValues);
    this.hY = Math.max.apply(null, this.yValues);
    this.lY = Math.min.apply(null, this.yValues);
    this.genBlocks();
  }
  update() {
    var colliders = this.game.objects.filter(function(obj) {
      return obj.collider;
    });
    this.xValues = colliders.map(o => o.getPoints().map(p => p.x));
    this.xValues = [].concat.apply([], this.xValues);
    this.yValues = colliders.map(o => o.getPoints().map(p => p.y));
    this.yValues = [].concat.apply([], this.yValues);
    this.hX = Math.max.apply(null, this.xValues);
    this.lX = Math.min.apply(null, this.xValues);
    this.hY = Math.max.apply(null, this.yValues);
    this.lY = Math.min.apply(null, this.yValues);
    this.genBlocks();
    for (var x = 0; x < this.game.objects.length; x++) {
      if (this.game.objects[x].collider) {
        this.getBlocksIn(this.game.objects[x]);
      }
    }
  }
  camPos() {
    var xValues = this.game.objects.map(o => o.absPos.x);
    xValues = [].concat.apply([], xValues);
    var yValues = this.game.objects.map(o => o.absPos.y);
    yValues = [].concat.apply([], yValues);
    var n = xValues.length;
    var aX = 0;
    var aY = 0;
    for (var i = 0; i < n; i++) {
      aX += xValues[i];
      aY += yValues[i];
    }
    var hX = Math.max.apply(null, xValues);
    var lX = Math.min.apply(null, xValues);
    var hY = Math.max.apply(null, yValues);
    var lY = Math.min.apply(null, yValues);
    if (hX - lX > hY - lY) {
      var range = hX - lX;
      range = this.game.canvas.width / range;
    } else {
      var range = hY - lY;
      range = this.game.canvas.height / range;
    }

    aX = aX / n;
    aY = aY / n;

    var pos = new Point(aX, aY);
    pos.z = 1 / range;
   
    pos.x -= this.game.camera.centre.x;
    pos.y -= this.game.camera.centre.y;

    return pos;
  }
  getBlocksIn(obj) {
    obj.blocks = [];
    var points = obj.getPoints();
    for (var p = 0; p < points.length; p++) {
      for (var r = 0; r < this.blocks.length; r++) {
        for (var c = 0; c < this.blocks[r].length; c++)
          if (this.blocks[r][c].pointWithin(points[p])) {
            obj.blocks.push(this.blocks[r][c]);
          }
      }
    }
    var n = 0;
    obj.blocks = Array.from(new Set(obj.blocks));
    var cp = obj.blocks.slice();
    var length = obj.blocks.length;
    for (var b = 0; b < length; b++) {
      for (var c = b; c < length; c++) {
        if (obj.blocks[b].isDiagonal(obj.blocks[c])) {
          var between = obj.blocks[b].betweenDiagonal(obj.blocks[c]);
          obj.blocks.push(this.blocks[between[0].x][between[0].y]);
          obj.blocks.push(this.blocks[between[1].x][between[1].y]);
        }
      }
    }

    for (var b = 0; b < obj.blocks.length; b++) {
      obj.blocks[b].objects.push(obj);
    }
  }
  genBlocks() {
    this.blocks = [];
    var cX = this.lX;
    var cY = this.lY;
    var x = 0;
    while (cX < this.hX + this.size) {
      var col = [];
      var y = 0;
      while (cY <= this.hY + this.size) {
        col.push(new Block(new Point(cX, cY), this.size, [x, y]));
        cY += this.size;
        y++;
      }
      this.blocks.push(col);
      cY = this.lY;
      cX += this.size;
      x++;
    }
  }
}
 class Block {
  constructor(pos, size, gridPos) {
    this.position = pos;
    this.size = size;
    this.gridPos = gridPos;
    this.objects = [];
  }
  pointWithin(point) {
    if (
      point.x >= this.position.x - this.size / 2 &&
      point.x <= this.position.x + this.size / 2 &&
      point.y >= this.position.y - this.size / 2 &&
      point.y <= this.position.y + this.size / 2
    ) {
      return true;
    }
    return false;
  }
  isDiagonal(other) {
    if (
      (other.gridPos[0] - this.gridPos[0]) ** 2 == 1 &&
      (other.gridPos[1] - this.gridPos[1]) ** 2 == 1
    ) {
      return true;
    }
    return false;
  }
  betweenDiagonal(other) {
    var x = other.gridPos[0] - this.gridPos[0];
    var y = other.gridPos[1] - this.gridPos[1];
    return [
      new Point(other.gridPos[0], this.gridPos[1]),
      new Point(this.gridPos[0], other.gridPos[1])
    ];
  }
}


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
		if(Maths.round(v1,5) == Maths.round(v2,5))
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
}


class object {
  constructor(game, relPos, type, size, colour, id, collider = false) {
    this.game = game;
    this.game.objects.push(this);
    this.relPos = relPos.copy();
    this.absPos = this.relPos.copy();
    this.type = type;
	this.ID = randomID();
	if(this.colour =="random"){
		this.colour = randomCol();
	}
    this.size = typeof size != "undefined" ? size : [0, 0];
	if(this.type == "CIRCLE"){
		if(this.size.length ==1){
			this.size = [this.size[0],0,2*Math.PI]
		}
	}
    this.colour = colour;
    this.subObjects = [];
    this.id = id;
	if(this.type == "LINE"){
		this.line = this.size[0];
		this.size = [0,0]
	}
    this.collider = collider;
    if (this.collider) {
      this.blocks = [];
      this.nearby = [];
      this.collisionTypes = this.game.collisionPairs[this.id];
	  this.collStates = {};
	  for(const key of this.collisionTypes){
		  this.collStates[key] = [false,null]
	  }
 
    }
    this.firstInit();
  }
  setAbsPos(p){
	  if(this.supe!=null){
		  this.relPos = p.minus(this.supe.absPos);
	  }
	  else{
		  this.relPos = p.copy();
	  }
		  var v = this.absPos.vectorTo(p);
		  this.moveAll(v,false);
	  
  }
  firstInit() {
    this.supe = null;
    this.rendering = true;
    this.angle = 0;
    this.screenPos = this.game.camera.gameToScreenPos(this.absPos);
    var z = this.game.camera.position.z;
    this.screenSize = [this.size[0] / z, this.size[1] / z];
  }

  move(vel, DT = true) {
    this.absPos.move(vel.times(DT ? this.game.DT : 1));
  }
  moveAll(vel, DT = true) {
    this.move(vel, DT);
    for (var x = 0; x < this.subObjects.length; x++) {
      this.subObjects[x].moveAll(vel, DT);
    }
  }

  rotate(angle, origin, DT = true) {
    var ang = angle * (DT ? this.game.DT : 1);
    this.angle += ang;
	
	if(this.type == "LINE"){
		this.line.vector = this.line.vector.rotate(ang);
		console.log("YO");
		
		this.line.centre = rotatePoint(ang,origin,this.line.centre);
		this.line.update();
	}
	else{
	this.absPos = rotatePoint(ang,origin,this.absPos);
	}
	
  }
  radians(ang) {
    return (Math.PI * ang) / 180;
  }
  rotateAll(angle, origin, DT = true) {
    this.rotate(angle, origin, DT);
    for (var x = 0; x < this.subObjects.length; x++) {
      this.subObjects[x].rotateAll(angle, origin, DT);
    }
  }
  finalInit() {
    this.trueSuper();
    if (this.supe == null) {
      this.game.suObjects.push(this);
      this.subElements(this);
      this.inited = true;
    }
  }
  addSubObject(obj) {
    this.subObjects.push(obj);
    obj.supe = this;
    obj.trueSuper();
    this.subElements(this);
  }
  subElements(obj) {
    for (var x = 0; x < obj.subObjects.length; x++) {
      if (!obj.subObjects[x].inited){
	if(obj.subObjects[x].type!="LINE"){
        obj.subObjects[x].absPos.move(obj.absPos)
	}
		
        obj.subObjects[x].inited = true;
      }
      this.subElements(obj.subObjects[x]);
    }
  }

  trueSuper() {
    if (this.supe != null) {
      var supe = this;
      while (supe.supe != null) {
        supe = supe.supe;
      }
      this.supe = supe;
    }
  }

  setAllRendering(val) {
    this.rendering = val;
    for (var x = 0; x < this.subObjects.length; x++) {
      this.subObjects[x].setAllRendering(val);
    }
  }

  render(){
    if (!this.rendering) {
      return;
    }
    this.screenPos = this.game.camera.gameToScreenPos(this.absPos);
    var z = this.game.camera.position.z;
    this.screenSize = [this.size[0] / z, this.size[1] / z];
    if (typeof this.transparency != "undefined") {
      if (this.transparency <= 0) {
        return;
      }
      this.game.context.globalAlpha = this.transparency;
    }
	else{
		this.game.context.globalAlpha = 1;
	}
	if(this.colour == "random"){
		this.colour = randomCol();
	}
	var w = this.game.camera.centre.x;
      var h = this.game.camera.centre.y;
      var z = this.game.camera.position.z;
      var camPos = this.game.camera.position;
      this.game.context.save();
      this.game.context.translate(
        this.absPos.x / z + w * (1 - 1 / z) - camPos.x / z,
        this.game.canvas.height-(this.absPos.y / z + h * (1 - 1 / z) - camPos.y / z)
      );
	  if(this.type == "RECT"||this.type == "CIRCLE"){
      this.game.context.rotate(-(this.angle * Math.PI) / 180);
	  }
      this.game.context.fillStyle = this.colour;
	
      this.game.context.strokeStyle = this.colour;
    if (this.type == "RECT") {
      
      if (this.size.length == 2) {
        this.game.context.fillRect(
          -(this.size[0] / 2) / z,
          -this.size[1] / 2 / z,
          this.size[0] / z,
          this.size[1] / z
        );
      } else {
        this.game.context.lineWidth = this.size[2] / z;
        this.game.context.strokeRect(
          -(this.size[0] / 2) / z,
          -this.size[1] / 2 / z,
          this.size[0] / z,
          this.size[1] / z
        );
      }
      
    }else if(this.type == "CIRCLE"){
		 this.game.context.beginPath();
		 this.game.context.moveTo(0,0);
         this.game.context.arc(0, 0, this.size[0]/z, this.size[1], this.size[2]);
		 this.game.context.lineTo(0,0)
		 this.game.context.fill()
	}
	else if(this.type == "LINE"){
		if(this.line.length!= null){	
		var beg = this.line.begPoint.minus(this.absPos)
		var end = this.line.endPoint.minus(this.absPos)
		}
		else{
			var beg = this.line.vector.times(2000)
			var end =this.line.vector.times(-2000)
		}
		this.game.context.beginPath();
		this.game.context.lineWidth = this.line.width/z
		this.game.context.moveTo(beg.x/z,-beg.y/z);
		this.game.context.lineTo(end.x/z,-end.y/z);
		this.game.context.stroke();
	}
	this.game.context.restore();
    this.game.context.globalAlpha = 1;
  }
  onScreen(){
	  var maxD;
	  if(this.type)
		  return;
  }
  colliding(other) {
    var b = isColliding(this, other);
    
    return b;
  }
  update() {
    if (this.angle > 360) {
      this.angle -= 360;
    }
    if (this.angle < 0) {
      this.angle += 360;
    }
    if (this.collider) {
      this.nearby = [];
      for (const [key, value] of Object.entries(this.collStates)) {
        this.collStates[key] = [false, null];
      }
      for (var x = 0; x < this.blocks.length; x++) {
        for (var i = 0; i < this.blocks[x].objects.length; i++) {
          if (
            this.blocks[x].objects[i] != this &&
            this.blocks[x].objects[i] != this.supe
          ) {
            this.nearby.push(this.blocks[x].objects[i]);
          }
        }
      }
      this.nearby = Array.from(new Set(this.nearby));
      //console.log(this.nearby.length);
      for (var x = 0; x < this.nearby.length; x++) {
        if (this.nearby[x])
          if (this.collisionTypes.includes(this.nearby[x].id)) {
            if (this.colliding(this.nearby[x]))
              this.collStates[this.nearby[x].id] = [true, this.nearby[x]];
          }
      }
    }
  }
  pointWithinRender(pos) {
    if (this.type == "RECT") {
      var rotatedPoint = rotatePoint(-this.angle, this.screenPos, pos);
      if (
        rotatedPoint.x <= this.screenPos.x + this.screenSize[0] / 2 &&
        rotatedPoint.x >= this.screenPos.x - this.screenSize[0] / 2 &&
        rotatedPoint.y <= this.screenPos.y + this.screenSize[1] / 2 &&
        rotatedPoint.y >= this.screenPos.y - this.screenSize[1] / 2
      ) {
        return true;
      } else return false;
    }
	else{
		return false;
	}
  }

  getPoints() {
    var points = [];
    if(this.type == "RECT"){
		points.push(
		  //Top left corner
		  rotatePoint(
			this.angle,
			this.absPos,
			new Point(
			  this.absPos.x - this.size[0] / 2,
			  this.absPos.y - this.size[1] / 2
			)
		  )
		);
		points.push(
		  //bottom left corner
		  rotatePoint(
			this.angle,
			this.absPos,
			new Point(
			  this.absPos.x - this.size[0] / 2,
			  this.absPos.y + this.size[1] / 2
			)
		  )
		);
		points.push(
		  //top right corner
		  rotatePoint(
			this.angle,
			this.absPos,
			new Point(
			  this.absPos.x + this.size[0] / 2,
			  this.absPos.y - this.size[1] / 2
			)
		  )
		);
		points.push(
		  //bottom right corner
		  rotatePoint(
			this.angle,
			this.absPos,
			new Point(
			  this.absPos.x + this.size[0] / 2,
			  this.absPos.y + this.size[1] / 2
			)
		  )
    );
	}
	else if (this.type == "CIRCLE"||this.type=="LINE"){
		points.push(this.absPos.copy())
	}

    return points;
  }

  delete() {
	if(this.game.objects.includes(this)){
		this.game.objects.splice(this.game.objects.indexOf(this), 1);
		if(this.type =="LINE"){
			this.line.delete();
		}
	}
  }
  deleteAll() {
	 for (var x = 0; x < this.subObjects.length; x++) {
      this.subObjects[x].deleteAll();
    }
   this.delete();
    if(this.supe ==null){
   this.clearAll();
	}
  }
  clear(){
	  this.subObjects = []
  }
  clearAll(){
	  for(var x =0;x<this.subObjects.length;x++){
		  this.subObjects[x].clearAll();
	  }
	  this.clear();
  }
  
}



 class Point {
  constructor(x, y, z = 1) {
    this.x = x;
    this.y = y;
    this.z = z;
  }
  add(other) {
    return new Point(this.x + other.x, this.y + other.y, this.z);
  }
  add3(other) {
    return new Point(this.x + other.x, this.y + other.y, this.z + other.z);
  }
  minus(other) {
    return new Point(this.x - other.x, this.y - other.y);
  }
  times(n) {
    return new Point(this.x * n, this.y * n, this.z);
  }
  times3(n) {
    return new Point(this.x * n, this.y * n, this.z * n);
  }
  negative() {
    return new Point(-this.x, -this.y);
  }
  move(vec) {
    this.x += vec.x;
    this.y += vec.y;
    this.z += vec.z;
  }
  distanceBetween(other){
	   if(other == null || other.constructor.name!="Point"){
		   return null;
	   }
	  return this.vectorTo(other).mag();
  }
  vectorTo(other){
	  return new Vector(other.x-this.x,other.y-this.y);
  }
  vector(){
	  return new Vector(this.x,this.y);
  }
  copy() {
    return new Point(this.x, this.y, this.z);
  }
  toString() {
    return (
      "X: " +
      this.x.toString() +
      ", Y: " +
      this.y.toString() +
      ", Z: " +
      this.z.toString()
    );
  }
  dotProduct(other) {
    return this.x * other.x + this.y * other.y;
  }
}

 class Road {
  constructor(game, Points) {
    this.game = game;
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
	//console.log(pos);
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
	this.lB.update(this.leftL);
	this.lE.update(this.leftL);
	
	this.rB.update(this.rightL);
	this.rE.update(this.rightL);
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

class roadManager{
	static intersect(road1,road2){
		var nLine = road1.line.extend()
		var lengths = [nLine.intersect(road2.lineL),nLine.intersect(road2.lineR)]
		nLine.clearInters();
		nLine.delete();
		if(lengths[0] == null){
			var incomeR = inters[0].lineR;
		}
		else if(lengths[1] == null){
		var incomeR = inters[0].lineL;
		}
		else{
			lengths = lengths.map(x=>x.distanceBetween(road1.line.begPoint));
			if(lengths[0]<lengths[1]){
				var incomeR = road2.lineL;
			}
			else{
				var incomeR = road2.lineR;
			}
		}
		var lE = road1.lineL.extend();
		var rE = road1.lineR.extend();
		road1.mRoad.addSubObject(lE.render);
		road1.mRoad.addSubObject(rE.render);
		var lI = lE.intersect(incomeR)
		var rI = rE.intersect(incomeR)

		var lengths = [road1.lineL.begPoint.distanceBetween(lI.copy()),road1.lineR.begPoint.distanceBetween(rI.copy())]
		var length = Math.max(lengths[0],lengths[1]);

		road1.updateAttributes(road1.line.begPoint.add(road1.line.vector.times(length)));

		
		var endRoad = road2.end.render.absPos.copy();
		endRoad =[lE.distanceFromPoint(endRoad),rE.distanceFromPoint(endRoad)];
		if(endRoad[0] < endRoad[1]){
			var endLine =lE;
			var begLine = rE;
		}
		else{
			var endLine = rE;
			var begLine = lE;
		}
		var i1 = road2.lineL.intersect(endLine)
		var lengths = [i1];
		lengths.push(road2.lineR.intersect(endLine));
		lengths[0] = lengths[0].distanceBetween(road2.lineL.endPoint);
		lengths[1] = lengths[1].distanceBetween(road2.lineR.endPoint);
		
		var otherV = road2.line.vector.copy();
		var otherP = road2.Points[1].copy();
		
		if(lengths[0]>lengths[1]){
			var endRoad =new Road(road1.game,[otherP.add(otherV.times(-lengths[0])),otherP])
			
		}
		else{
			var endRoad = new Road(road1.game,[otherP.add(otherV.times(-lengths[1])),otherP])
			
		}
		otherP= road2.Points[0].copy();
		lengths = [road2.lineL.intersect(begLine)]
		lengths.push(road2.lineR.intersect(begLine));
		lengths[0] = lengths[0].distanceBetween(road2.lineL.begPoint);
		lengths[1] = lengths[1].distanceBetween(road2.lineR.begPoint);
		lengths = Math.max(lengths[0],lengths[1]);
		var begRoad = new Road(road1.game,[otherP,otherP.add(otherV.times(lengths))]);
		
		begRoad.lB.delete();
		begRoad.lB = road2.lB;
		begRoad.lB.update(begRoad.leftL);
		
		begRoad.rE.delete();
		begRoad.rE = road2.rE;
		begRoad.rE.update(begRoad.rightL);
		
		
		endRoad.lE.delete();
		endRoad.lE = road2.lE;
		endRoad.lE.update(endRoad.leftL);
		
		endRoad.rB.delete();
		endRoad.rB = road2.rB;
		endRoad.rB.update(endRoad.rightL);
		
		
		road1.mRoad.addSubObject(lE.render);
		road1.mRoad.addSubObject(rE.render)
		lE.render.setAbsPos(lE.render.relPos)
		rE.render.setAbsPos(rE.render.relPos)
		
		roadManager.lineUpdate(begRoad.leftL);
		roadManager.lineUpdate(begRoad.rightL);
		roadManager.lineUpdate(endRoad.leftL);
		roadManager.lineUpdate(endRoad.rightL);
		
		road1.lineStuff();
		road2.delete();
		lE.delete();
		rE.delete();
		return [begRoad,endRoad]
	}
	
	static lineUpdate(line){
		line.bNode.connections = [line.eNode]
	}
	
	static createPaths(road){
		if(road.leftPath){
			road.leftPath.delete();
			road.rightPath.delete();
			road.leftL.delete();
			road.rightL.delete();
		}
		var perp = road.line.vector.rotate(90).normalise();
		var leftCent = road.centre.copy()
		leftCent.move(perp.times(road.mRoad.size[1]/4));
		road.leftPath = new object(road.game,new Point(0,0),"RECT",[road.length,road.mRoad.size[1]/2],"yellow");
		road.leftPath.angle = road.angle;
		road.mRoad.addSubObject(road.leftPath);
		road.leftPath.setAbsPos(leftCent);
		road.rightPath = new object(road.game,new Point(0,0),"RECT",[road.length,road.mRoad.size[1]/2],"orange");
		var rightCent = road.centre.copy();
		rightCent.move(perp.times(-road.mRoad.size[1]/4));
		road.mRoad.addSubObject(road.rightPath);
		road.rightPath.setAbsPos(rightCent);
		road.rightPath.angle = road.angle;
		road.leftPath.transparency = 0.5;
		road.rightPath.transparency = 0.5;
		road.leftL = new Line(road.game,road.leftPath.absPos.copy(),road.line.vector.copy(),road.length,false);
		road.leftPath.addSubObject(road.leftL.render);
		road.rightL = new Line(road.game,road.rightPath.absPos.copy(),road.line.vector.times(-1),road.length,false);
		road.rightL.road = road;
		road.leftL.road = road;
		road.rightPath.addSubObject(road.rightL.render);
	}
	static interway(road,others){
	
		var begRoad = others[0]
		var endRoad = others[1]
		var lE = begRoad.lineL.extend();
		var rE = begRoad.lineR.extend();
		if(lE.intersect(road.line) ==null){
			var incomeR = rE;
		}
		else{
			var incomeR = lE;
		}
		lE.clearInters();
		incomeR.render.colour = "green";
		
		road.lE.absPos = road.leftL.intersect(incomeR);
		road.rB.absPos = road.rightL.intersect(incomeR);
		road.lE.update();
		road.rB.update();
		var i = begRoad
		lE.delete();
		rE.delete();
		lE = road.lineL.extend();
		rE = road.lineR.extend();
		if(begRoad.line.intersect(lE) == null){
			var incomeE = lE;
			var incomeB = rE;
		}
		else{
			var incomeE =  rE;
			var incomeB = lE
		}
		begRoad.line.clearInters();
		

		begRoad.lE.absPos = begRoad.leftL.intersect(incomeB);
		begRoad.lE.update();
		begRoad.rB.absPos = begRoad.rightL.intersect(incomeB);
		begRoad.rB.update();
		endRoad.lB.absPos = endRoad.leftL.intersect(incomeE);
		endRoad.lB.update();
		endRoad.rE.absPos = endRoad.rightL.intersect(incomeE);
		endRoad.rE.update();
		begRoad.leftL.clearInters();
		begRoad.rightL.clearInters();
		endRoad.leftL.clearInters();
		endRoad.rightL.clearInters();
		road.leftL.clearInters();
		road.rightL.clearInters();
		
		var  i = new intersection({begRoad:[begRoad.lE,begRoad.rB],road:[road.lE,road.rB],endRoad:[endRoad.rE,endRoad.lB]})
		
		lE.delete();
		rE.delete();
	}
}

class node{
	constructor(game,pos,type,line){
		this.game = game;
		this.line = line;
		
		this.absPos = pos.copy();
		this.angle = 0;
		this.type = type;
		this.colour = (this.type =="beg")?"yellow":"orange";
		this.render = new object(this.game,this.absPos,"RECT",[0,0],this.colour);
		this.id = randomID();
	}
	update(){
		this.render.setAbsPos(this.absPos);
		this.render.angle = this.angle;
	}
	delete(){
		this.render.delete();
	}
}
class sNode{
	constructor(game,pos,type,line){
		this.game = game;
		this.game.nodes.push(this);
		this.absPos = pos.copy();
		this.angle = 0;
		this.type = type;
		this.render = new object(this.game,this.absPos,"RECT",[20,20],(this.type == "beg")?"green":"purple",this.type=="beg"?"begNode":"endNode",true);
		
		this.line = line;
		if(this.type == "beg"){
			this.line.bNode = this;
		}
		else{
			this.line.eNode = this;
		}
		this.connections = [];
		this.render.angle = this.line.vector.getAngle();
		this.line.render.addSubObject(this.render);
		this.render.setAbsPos(this.absPos);
		this.id = randomID();
	}
	copy(){
	//	console.log(this.line)
		return new sNode(this.game,this.absPos,this.line)
	}
	update(line){
		if(line){
			if(this.line){
				this.line.delete()
			}
			this.line = line;
			this.render = new object(this.game,this.absPos,"RECT",[20,20],(this.type == "beg"?"green":"purple"),this.type=="beg"?"begNode":"endNode",true);
			this.line.render.addSubObject(this.render);
			if(this.type == "beg"){
				this.line.bNode = this;
			}
			else{
				this.line.eNode = this;
			}
		}
		if(this.type=="beg"){
			this.connections = [this.line.eNode];
		}
		this.render.setAbsPos(this.absPos);
		this.render.angle = this.line.vector.getAngle();
	}
	delete(){
		this.render.delete();
		removeFromArray(this,this.game.nodes)
	}
}

class intersection{
	constructor(rNs){
		this.rNs = rNs;
		this.id = randomID();
		this.roads  = Object.keys(this.rNs);
		this.nodes = Object.values(this.rNs);
		this.aRoads = this.nodes.map(n=> n[0].line.road);
		this.game = this.nodes[0][0].game;
		this.game.intersections.push(this);
		for(var x =0;x<this.roads.length;x++){
		   if(this.roads[x].lB){
		   }
		}
		this.nodes = [].concat.apply([],this.nodes);
		for(var x = 0; x<this.nodes.length;x++){
			var node = this.nodes[x];
			if(node.type == "end"){
				for(var y =0;y<this.nodes.length;y++){
					if(this.nodes[y].type =="beg"&& this.nodes[y].line.road.id!= node.line.road.id){
						node.connections.push(this.nodes[y]);
					}
				}
			}
		}
		
		//this.nodes[0].render.rendering = false;
		this.roads=this.aRoads;
		this.ax1 = [this.roads[0]]
		this.ax2 = [];
		for(var x = 1;x<this.roads.length;x++){

			if(this.roads[x].line.vector.parallel(this.roads[0].line.vector)){	
				this.ax1.push(this.roads[x]);
			}
			else{
				this.ax2.push(this.roads[x]);
			}
		}
		var l = this.ax1[0].line.extend();
		var l2 = this.ax2[0].line.extend();
		var pos = l.intersect(l2);
		this.render = new object(this.nodes[0].game,pos,"RECT",[40,40],"purple");
		l.delete();
		l2.delete();
		
		/*for(var x = 0;x<this.ax1.length;x++){
			this.ax1[x].leftL.render.colour = "red";
		}
		for(var x = 0;x<this.ax2.length;x++){
			this.ax2[x].leftL.render.colour = "pink";
		}
		this.roads = this.ax1.concat(this.ax2);*/
	}
}

class Vector {
  constructor(x, y, z = 0) {
    this.x = x;
    this.y = y;
    this.z = z;
  }
  negative() {
    return new Vector(-this.x, -this.y, this.z);
  }
  add(other) {
    return new Vector(this.x + other.x, this.y + other.y, this.z);
  }
  add3(other) {
    return new Vector(this.x + other.x, this.y + other.y, this.z);
  }
  parallel(other){
	  var t = this.normalise();
	  var o = other.normalise();
	  if(Maths.equals(t,o)|| Maths.equals(t,o.times(-1))){
		  return true;
	  }
	  return false;
  }
  times3(n) {
    return new Vector(this.x * n, this.y * n, this.z * n);
  }
  normalise(){
	  return Maths.normalize(this);
  }
  times(n) {
    return new Vector(this.x * n, this.y * n, this.z);
  }
  copy(){
	  return new Vector(this.x,this.y,this.z);
  }
  rotate(angle) {
 
  if (this.x == 0 && this.y == 0) {
    return new Vector(0,0,this.z)
  }
  return new Vector(this.x*Maths.cos(angle)-this.y*Maths.sin(angle),this.x*Maths.sin(angle)+this.y*Maths.cos(angle));
}
  getAngle() {
    if (this.x == 0) {
      if (this.y == 0) {
        return 0;
      }
      if (this.y > 0) {
        return 90;
      }
      if (this.y < 0) {
        return 360 - 90;
      }
    }
    var angle = (180 / Math.PI) * Math.atan(this.y / this.x);
    if (this.x > 0) {
      return angle;
    }
    if (this.x < 0) {
      if (this.y < 0) {
        return angle - 180;
      }
      return angle + 180;
    }
  }
  getPerependicular(){
	  return this.getAngle()+90;
  }
  
  mag(){
	  return Math.sqrt(this.x**2+this.y**2);
  }

  toString() {
    return (
      "X: " +
      this.x.toString() +
      ", Y: " +
      this.y.toString() +
      ", Z: " +
      this.z.toString()
    );
  }
}

class Game {
  constructor() {
	
    this.mouseMode = "auto";
    this.road = null;
    this.collisionPairs = { window:["endNode","begNode"],frame: ["frame","road","endNode","begNode"], hitbox: ["frame"],road:["road"],begNode:["frame"],endNode:["frame"] };
    this.mousePos = new Point(0, 0);
    this.canvas = document.getElementById("gameCanvas");
    this.intersections = []
    this.context = this.canvas.getContext("2d");
    this.camera = new Camera(new Point(0.0, 0.0, 1), this);
    this.roads = [];
    this.objects = [];
    this.suObjects = [];
    this.frames = 0;
    this.cTime = 0;
    this.lastTime = 0;
    this.lastSec = 0;
	this.timers = [];
    this.dt = 0;
    this.DT = 0;
    this.objects = [];
    this.keyFunctions = {};
    this.keys = [];
    this.running = false;
    this.keyName = "";
    this.selected = null;
	this.nodes = []
    this.cars = [];
	for(var x =0;x<1;x++){
		new Car(new Point(0, 0, 1), "purple", this);
	}
	new Car(new Point(10,10,2),"c",this);
	//this.cars[0].delete();
    var x = 0;
	
	//this.line = new Line(this,new Point(10,0,3),new Vector(1,1),30);
	//this.line2 = new Line(this,new Point(20,0,3), new Vector (-1.000001,1),30);
    //this.line.intersect(this.line2)
   //this.cars.push(new Car(new Point(100 + x * 100, 0, 1), "purple", this));
    this.p1 = new object(this,new Point(-100,100),"CIRCLE",[10],"purple");
	this.p2 = new object(this, new Point(100,200),"CIRCLE",[10],"green");
	this.cars[0].move(this.p1.absPos.minus(this.cars[0].position),false);
	this.cars[0].rotate(90,false);
//	this.cars[0].turn(this.p2.absPos,0);
    this.map = new Map(this);
    this.map.update();
	//new Road(this,[new Point(500,0),new Point(0,0)])
    this.camera.position = this.map.camPos();
	//var l = new Line(this,[new Point(-0.0,0),new Point(100,0)])
	////var l2 = new Line(this,[new Point(0,100),new Point(0,-10)]);
	//l.intersect(l2);
	//new Road(this,[new Point(0,0),new Point(1000,1000)])
    for (var x = 0; x < 257; x++) {
      this.keys[x] = false;
    }
    var _this = this;
    function keyDown(e) {
      _this.keyDown(e);
    }
    function keyUp(e) {
      _this.keys[e.keyCode] = false;
    }
    document.addEventListener("mousemove", function(e) {
      const rect = _this.canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      if (
        x >= 0 &&
        y >= 0 &&
        x <= _this.canvas.width &&
        y <= _this.canvas.height
      ) {
        

        _this.mousePos.x = x;
        _this.mousePos.y = _this.canvas.height-y;
      }
    });
    document.addEventListener("keyup", keyUp);
    document.addEventListener("keydown", keyDown);
    document.addEventListener("click", function(e) {
      const rect = _this.canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = _this.canvas.height-(e.clientY - rect.top);
	  
      if (
        x >= 0 &&
        y >= 0 &&
        x <= _this.canvas.width &&
        y <= _this.canvas.height
      ) {
		
        Input.processMouse(_this, new Point(x, y));
      }
    });

    this.keyFunctions = Input.genKeyFunctions();
	var m = function(){
		_this.millUpdate();
		_this.timeF(100,m);
	}
	this.timeF(1000,m);
	var s = function(){
			_this.secondUpdate();
			_this.timeF(1000,s);
		}
	this.timeF(1000,s);
	
	var spawn = function(){
		if(!_this.running){
			
		}
		else if(_this.roads.length >0){
			    var car = new Car(new Point(0, 0, 1), "purple", _this);
				var r = _this.roads[parseInt(Math.random() *_this.roads.length)]
				r.mRoad.rendering = false;
				car.move(r.lB.absPos.minus(car.position),false);
				car.rotate(r.lB.line.vector.getAngle()-car.angle,false);
				car.crash = false;
		}
		_this.timeF(2000,spawn)
	}
	spawn();
	
  }
  keyDown(e) {
    this.keyName = keyCodes[e.keyCode];

    if (!this.keys[e.keyCode]) {
      if (this.keyFunctions[this.keyName]) {
        this.keyFunctions[this.keyName]("TAPPED", this);
      }
    }
    this.keys[e.keyCode] = true;
  }
  timeF(t,f){
	  this.timers.push([f,t,performance.now()])
  }
  updateDt() {
    this.frames++;
    this.cTime = performance.now();
    this.dt = this.cTime - this.lastTime;
    this.DT = this.dt / 1000;
    this.lastTime = this.cTime;
    if (this.lastSec == 0) {
      this.lastSec = this.cTime;
	  this.lastMill = this.cTime
    }

  }
  millUpdate(){
	  if(!this.m)this.m = 0;
	  this.m++;
	  this.map.update();
	  
  }
  secondUpdate() {
		//console.log(this.frames,this.cars.length)
		this.frames = 0;
  }

  changeMouseMode(type) {
    this.mouseMode = type;
    this.canvas.style.cursor = mouseModes[type];
  }

  update(timestamp) {

    this.objects.sort(function(a, b) {
      return a.absPos.z - b.absPos.z;
    });
    //
	if(this.road){
		this.road.updateAttributes(this.camera.screenToGamePos(this.mousePos));
	}
	
    if (this.camera.position.z < 0.15) {
      this.camera.position.z = 0.15;
    }
    this.updateDt();
	for(var x =0;x<this.timers.length;x++){
		var tim = this.timers[x];
		if(this.cTime-tim[2]>=tim[1]){
			tim[0]();
			this.timers.splice(x,1);
		}
	}
    g.context.fillStyle = "#fcf2d2";
    g.context.fillRect(0, 0, g.canvas.width, g.canvas.height);
    if (this.running) {
		
	for(var x =0;x<this.cars.length;x++){
		var car = this.cars[x];
		//console.log("H");
		if(car.window.collStates["endNode"][0]){	
			car.crash = true;
		}
         if(car.crash){
			var n = car.window.collStates["endNode"][1]
			//console.log(n);
		 if(n){
			for(var x = 0;x<this.nodes.length;x++){
				if(this.nodes[x].render.ID == n.ID){
				//	console.log(n.ID);
					var y = this.nodes[x].connections[parseInt(Math.random()*this.nodes[x].connections.length)];
					if(!y){
						car.delete();
					}
					console.log(this.nodes.length);
				}
			}
				if(y) car.turn(y.absPos.copy(),y.line.vector.getAngle());
					car.crash = false;
		
		 }
		 }
	}
		
      for (var i = 0; i < this.cars.length; i++) {
		
       this.cars[i].move(new Vector(Maths.cos(this.cars[i].angle),Maths.sin(this.cars[i].angle)).times(100));
      }
    }
     //this.line.square.absPos = this.line.centre.copy();
    for (var i = 0; i < this.cars.length; i++) {
      this.cars[i].update();
    }

    for (var x = 0; x < this.objects.length; x++) {
      this.objects[x].update();
    }

    for (var x = 0; x < this.objects.length; x++) {
      this.objects[x].render();
    }

    for (var x = 0; x < 257; x++) {
      if (this.keys[x] && this.keyFunctions[keyCodes[x]]) {
        this.keyFunctions[keyCodes[x]]("HELD", this);
      }
    }
  }
}

var g = new Game();

var gameLoop = function(timeStamp) {
  g.update();
  requestAnimationFrame(gameLoop);
};

gameLoop();
