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
