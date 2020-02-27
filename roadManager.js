class roadManager{
	static intersect(road1,road2){
		var nLine = new Line(road1.game,road1.line.centre.copy(),road1.line.vector.copy(),null);
		var lengths = [nLine.intersect(road2.lineL),nLine.intersect(road2.lineR)]
		 
		nLine.delete();
		if(lengths[0] == null){
			var incomeR = inters[0].lineR;
		}
		else if(lengths[1] == null){
		var incomeR = inters[0].lineL;
		}
		else{
			lengths = lengths.map(x=>x.distanceBetween(road1.line.centre));
			if(lengths[0]<lengths[1]){
				var incomeR = road2.lineL;
			}
			else{
				var incomeR = road2.lineR;
			}
		}
		var lE = road1.lineL.extend();
		var rE = road1.lineR.extend();
		var lI = lE.intersect(incomeR).copy();
		var rI = rE.intersect(incomeR)
		lI.z+=10;
		var lengths = [road1.lineL.begPoint.distanceBetween(lI.copy()),road1.lineR.begPoint.distanceBetween(rI.copy())]
		var length = Math.max(lengths[0],lengths[1]);
		lE.clearInters();
		rE.clearInters();
		road1.updateAttributes(road1.line.begPoint.add(road1.line.vector.times(length)));

		
		var endRoad = road2.end.absPos.copy();
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
		//begLine.clearInters();
		//road2.lineR.clearInters();
		//road2.lineL.clearInters();
		var otherV = road2.line.vector.copy();
		var otherP = road2.Points[1].copy();
		//otherRoad.delete();
		if(lengths[0]>lengths[1]){
			var r =new Road(road1.game,[otherP.add(otherV.times(-lengths[0])),otherP])
			
		}
		else{
			var r = new Road(road1.game,[otherP.add(otherV.times(-lengths[1])),otherP])
			
		}
		otherP= road2.Points[0].copy();
		lengths = [road2.lineL.intersect(begLine)]
		lengths.push(road2.lineR.intersect(begLine));
		lengths[0] = lengths[0].distanceBetween(road2.lineL.begPoint);
		lengths[1] = lengths[1].distanceBetween(road2.lineR.begPoint);
		lengths = Math.max(lengths[0],lengths[1]);
		var r = new Road(road1.game,[otherP,otherP.add(otherV.times(lengths))]);
		//road2.lineR.clearInters();
		//road2.lineL.clearInters();
		var lC = lE.centre.copy();
		var rC = rE.centre.copy();
		road1.mRoad.addSubObject(lE.render);
		road1.mRoad.addSubObject(rE.render)
		lE.render.setAbsPos(lE.render.relPos)
		rE.render.setAbsPos(rE.render.relPos)
		
		//endLine.clearInters();
		//lE.delete();
	//	lE.clearInters();
		//new object(road1.game,lE.inters[lrelPos.copy()
		
		
		//rE.delete();
		road1.lineStuff();
		road2.delete();
	}
	
	static createPaths(road){
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
		//road.leftL = new Line()
	}
}
