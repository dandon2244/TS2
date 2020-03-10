
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
				if(game.objects[n].id = cars[x].frame.id){
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
    game.roadCreate(game.camera.screenToGamePos(point));
  }
}
}
