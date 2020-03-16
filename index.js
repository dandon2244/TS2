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
	new Car(new Point(10,0,2),"c",this);
    var x = 0;
	
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
