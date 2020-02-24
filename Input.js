
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
