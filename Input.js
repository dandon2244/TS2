
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
			if(game.road){
				game.road.delete();
				game.road = null
			}
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
			if(inter.render[0].pointWithinRender(point)||inter.render[1].pointWithinRender(point)){
				P = inter.cent.copy();
				ext = true;
				var vec;
				if(inter.ax1.length ==1){
					vec = inter.ax1[0].line.vector.copy();
				}
				else{
					vec = inter.ax2[0].line.vector.copy();
					var exLine;
					var lE = inter.ax1[0].lineL.extend();
					var rE = inter.ax1[0].lineR.extend();
					if(inter.ax2[0].line.intersect(lE)){
						exLine = rE;
					}
					else{
					exLine = lE;
					}
					inter.ax2[0].line.clearInters();
					var l = inter.ax2[0].lineL.extend();
					var r = inter.ax2[0].lineR.extend();
					var lI = l.intersect(exLine);
					var rI = r.intersect(exLine);
					lE.delete();
					rE.delete();
					var temp = new Road(game,[P,P.add(vec.times(800))]);
					var l2 = temp.lB.absPos.distanceBetween(lI);
					var r2 = temp.rE.absPos.distanceBetween(rI);
					temp.delete();
				
					if(l2 <r2){
						var eP = lI;
					}
					else{
						var eP = rI;
					}
					
					lE =inter.ax2[0].line.extend();
					P = projectOntoLine(eP,lE);
					lE.delete();
					l.delete();
					r.delete();
					game.road = new Road(game,[P]);
					game.road.tVec = vec;
					game.road.ext = true;
					game.road.exempts = inter.roads;
					game.road.exLine = exLine;
					inter.rNs[game.road.id] = [game.road.lB,game.road.rE];
					game.road.temp = inter;				}
			}
		}
	 
	  if(!ext){
      game.road = new Road(game, [P]);
	  }
	
    } else {
      if(game.road.changePoint(p)){
		if(game.road.ext){
			var i = game.road.exLine.extend();
			game.road.lB.absPos = i.intersect(game.road.leftL);
			game.road.rE.absPos = i.intersect(game.road.rightL)
			game.road.lB.update();
			game.road.rE.update();
			i.delete();
			game.road.temp.update();
			delete game.road.temp;
			delete game.road.exLine;
			delete game.road.exempts;
			
	  }
	  game.road.sR.deleteAll();
      game.road = null;
	 
	 // console.log("YO");
	  }
	  else{
		  game.road.sR.rendering = true;
		  game.timeF(200,function(){
			  game.road.sR.rendering = false;
		  });
	  }
    }
  }
}
}
