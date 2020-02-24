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
    this.mouseOffset = [false, [0, 0]];
    this.position = position;
    this.colour = colour;
    this.angle = 0;
    this.speed = 1;
    this.gamePos = position;
    this.frame = new object(
      this.game,
      position.copy(),
      "RECT",
      [60 * scale, 35 * scale],
      this.colour,
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
      "#d8e8e6"
    );
    this.leftHead = new object(
      game,
      new Point(-this.frame.size[0] / 2 + 4, -this.frame.size[1] / 2 + 4, 2),
      "RECT",
      [8, 8],
      "red"
    );
    this.rightHead = new object(
      game,
      new Point(-this.frame.size[0] / 2 + 4, this.frame.size[1] / 2 - 4, 2),
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
      if (this.frame.collStates["frame"][0]||this.frame.collStates["road"][0]) {
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
}

const keyCodes = {
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
  carSelect:"auto"
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
      if (game.roads[game.roads.length - 1]) {
        game.roads[game.roads.length - 1].delete();
      }
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
	    for(var x = 0;x<game.objects.length;x++){
			var o = game.objects[x];
			if(o.type == "CIRCLE"&& o.colour=="green"){
				o.supe.deleteAll();
			}
		}
	  }
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
    game.camera.move(new Vector(0, 0, 1));
  };
  keyFunctions["k"] = function(type, game) {
    game.camera.move(new Vector(0, 0, -1));
  };

  keyFunctions["up arrow"] = function(type, game) {
    game.camera.move(new Vector(0, 100, 0).times(game.camera.position.z));
  };
  keyFunctions["left arrow"] = function(type, game) {
    game.camera.move(new Vector(-200, 0, 0).times(game.camera.position.z));
  };
  keyFunctions["right arrow"] = function(type, game) {
    game.camera.move(new Vector(200, 0, 0).times(game.camera.position.z));
  };
    keyFunctions["down arrow"] = function(type, game) {
    game.camera.move(new Vector(0, -100, 0).times(game.camera.position.z));
  };
  return keyFunctions;
}

static processMouse(game, point) {

  if (game.mouseMode == "auto") {
    for (var i = 0; i < game.cars.length; i++) {
      if (game.cars[i].frame.pointWithinRender(point)) {
        game.cars[i].select(true);
		game.selected = game.cars[i];
		game.changeMouseMode("carSelect")
     
      }
    }
  }
  else if(game.mouseMode == "carSelect"){
	  game.selected.select(false);
	  game.selected =  null;
	  game.changeMouseMode("auto");
  }
  else if (game.mouseMode == "roadGreen") {
    game.roadCreate(game.camera.screenToGamePos(point));
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
	return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
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
  distanceFromPoint(p){
	  var perp = this.vector.rotate(90).normalise();
	  var l = new Line(this.game,this.centre.copy(),perp,null);
	  var i = l.intersect(this);
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
	  }
	 
	 // this.game.log = this.render.absPos.minus(this.square.absPos).toString();
   
  }
  copy(){
	  if(this.length!=null){
	  return new Line(this.game,[this.begPoint.copy(),this.endPoint.copy()])
	  }
	  return new Line(this.game,this.centre.copy(),this.vector.copy(),null)
  }
  intersect(other){
	  var oID = other.id;
	   if(oID in this.inters){
		removeFromArray(this.inters[oID],this.render.subObjects)
		this.inters[oID].delete();
	  }
	  
	 
	  other.vector = Maths.normalize(other.vector);
	  this.vector = Maths.normalize(this.vector);
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
		  var mu = (y+(c-x)*b/a - d)/(f-b*e/a);
		  var intPoint = other.centre.add(other.vector.times(mu))
		  intPoint.z+=1;
		  if((this.pointOnLine(intPoint)&&other.pointOnLine(intPoint))){
			  
	  
			  this.inters[oID] = new object(this.game,new Point(0,0),"CIRCLE",[10,0,2*Math.PI],"green");
			//  console.log(this.id,other.id)
			 // console.log(this,other)
			 this.render.addSubObject(this.inters[oID])
			 // console.log(this.inter.absPos.toString())
			 this.inters[oID].setAbsPos(intPoint);
			// console.log(this.inter.absPos);
			//console.log(this.inters[other].absPos.toString());
			  return this.inters[oID].absPos.copy();
		  }
	  }
	  return null;
  }
  pointOnLine(p){
	  if(this.vector.x == 0){
		  if(this.vector.y == 0){
			  return false;
		  } 
		  
		  else{
			var lam = (p.y-this.centre.y)/this.vector.y
			var oX = this.centre.x+lam*this.vector.x;
			if(Maths.round(oY,5)== Maths.round(p.x,5)){
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
		
			  if(dis<=this.length&&dis>0){
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
    this.size = 230;
    this.xValues = this.game.objects.map(o => o.getPoints().map(p => p.x));
    this.xValues = [].concat.apply([], this.xValues);
    this.yValues = this.game.objects.map(o => o.getPoints().map(p => p.y));
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
    obj.blocks = Array.from(new Set(obj.blocks));
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
static  normalize(vec) {
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
    this.size = typeof size != "undefined" ? size : [0, 0];
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
        obj.subObjects[x].absPos.move(obj.absPos)
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
		var end = this.line.vector.times(-2000)
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
   
	this.creating = false;
	if(Points.length == 1){
		this.creating = true;
	}
	
	 this.centre = this.Points[0].add(new Vector(Maths.cos(this.angle),Maths.sin(this.angle)).times(this.length/2)) 
    this.mRoad = new object(
      this.game,
      this.centre,
      "RECT",
      [this.length, 200],
      "black","road",true
    );
     this.beg = new object(this.game,new Point(Maths.cos(this.angle),Maths.sin(this.angle)).times(-this.length/2),"RECT",[20,this.mRoad.size[1]],"yellow");
     this.beg.angle = this.angle;
	 
	 this.end = new object(this.game,new Point(0,0),"RECT",[20,this.mRoad.size[1]],"orange");
     this.end.angle = this.angle;
	
	this.mRoad.addSubObject(this.beg);
	this.mRoad.addSubObject(this.end);
	
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
		this.mRoad.transparency = 0.7;
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
		var nLine = new Line(this.game,this.line.centre,this.line.vector,null);
		var interPoint = nLine.intersect(inters[0].line);
		nLine.delete();
		this.updateAttributes(interPoint);
		this.beg.rendering = false;
		this.end.rendering = false;
		
		//this.rightPath = new object(t)
		//console.log(leftCent.toString());
	}
	console.log(inters.length);
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
    this.collisionPairs = { frame: ["frame","road"], hitbox: ["frame"],road:["road"] };
    this.mousePos = new Point(0, 0);
    this.canvas = document.getElementById("gameCanvas");
    
    this.context = this.canvas.getContext("2d");
    this.camera = new Camera(new Point(0.0, 0.0, 1), this);
    this.roads = [];
    this.objects = [];
    this.suObjects = [];
    this.frames = 0;
    this.cTime = 0;
    this.lastTime = 0;
    this.lastSec = 0;
    this.dt = 0;
    this.DT = 0;
    this.objects = [];
    this.keyFunctions = {};
    this.keys = [];
    this.running = false;
    this.keyName = "";
    this.selected = null;
    this.cars = [new Car(new Point(0, 0, 1), "purple", this)];
	//this.cars[0].delete();
    var x = 0;
	
	//this.line = new Line(this,new Point(10,0,3),new Vector(1,1),30);
	//this.line2 = new Line(this,new Point(20,0,3), new Vector (-1.000001,1),30);
    //this.line.intersect(this.line2)
   this.cars.push(new Car(new Point(100 + x * 100, 0, 1), "purple", this));
    this.map = new Map(this);
    this.map.update();
    this.camera.position = this.map.camPos();

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

  roadCreate(point) {
    if (this.road == null) {
	  var P = point.copy();
      this.road = new Road(this, [P]);
    } else {
      this.road.changePoint(point);
      this.road = null;
    }
  }

  updateDt() {
    this.frames++;
    this.cTime = performance.now();
    this.dt = this.cTime - this.lastTime;
    this.DT = this.dt / 1000;
    this.lastTime = this.cTime;
    if (this.lastSec == 0) {
      this.lastSec = this.cTime;
    }
    if (this.cTime - this.lastSec > 1000) {
      this.secondUpdate();
      this.lastSec = this.cTime;
      this.frames = 0;
    }
  }
  secondUpdate() {
	//console.log(this.log)
  }

  changeMouseMode(type) {
    this.mouseMode = type;
    this.canvas.style.cursor = mouseModes[type];
  }

  update(timestamp) {
    this.cur = Math.random();
  
    if (this.close > this.cur) {
      this.close = this.cur;
    }
    this.objects.sort(function(a, b) {
      return a.absPos.z - b.absPos.z;
    });
    this.map.update();
	this.roads.forEach(function(obj){
		if(obj.creating){
		obj.updateAttributes(obj.game.camera.screenToGamePos(obj.game.mousePos));
		//console.log(obj.game.camera.screenToGamePos(obj.game.mousePos));
		}
	})
    if (this.camera.position.z < 0.0) {
      this.camera.position.z = 0.0;
    }
    this.updateDt();
    g.context.fillStyle = "#fcf2d2";
    g.context.fillRect(0, 0, g.canvas.width, g.canvas.height);
    if (this.running) {
		//this.roads[0].mRoad.rotateAll(90,this.roads[0].mRoad.absPos);
		//this.cars[0].rotate(90);
      for (var i = 0; i < this.cars.length; i++) {
       // this.cars[i].run();
	 
	   this.cars[i].rotate(90);
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