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
		var lengths = [road1.lineL.begPoint.distanceBetween(lE.intersect(incomeR)),road1.lineR.begPoint.distanceBetween(rE.intersect(incomeR))]
		var length = Math.max(lengths[0],lengths[1]);
		//console.log(length);
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
		var lengths = [road2.lineL.intersect(endLine)];
		lengths.push(road2.lineR.intersect(endLine));
		lengths[0] = lengths[0].distanceBetween(road2.lineL.endPoint);
		lengths[1] = lengths[1].distanceBetween(road2.lineR.endPoint);
		road2.lineR.clearInters();
		road2.lineL.clearInters();
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
		

		//lE.delete();
		//rE.delete();
		road1.lineStuff();
		road2.delete();
	}
}