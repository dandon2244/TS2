class roadManager{
	static intersect(road1,road2){
	
		var nLine = road1.line.extend()
		var lengths = [nLine.intersect(road2.lineL),nLine.intersect(road2.lineR)]
		nLine.clearInters();
		nLine.delete();

		if(lengths[0] == null||lengths[1] == null){
			return false;
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
		var o = (incomeR.id == road2.lineL.id)?road2.lineR:road2.lineL
		if(lE.intersect(incomeR) == null || lE.intersect(o) == null ||rE.intersect(incomeR) == null||rE.intersect(o) == null){
			lE.delete();
			rE.delete();
			return false;
		}
		incomeR.render.colour = "red";

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
		//roadManager.lineUpdate(
		
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
		road.rightL.tag = "right";
	    road.leftL.tag = "left";
		road.rightL.road = road;
		road.leftL.road = road;
		road.rightPath.addSubObject(road.rightL.render);
	}
	static interway(road,others){
	
		var begRoad = others[0]
		var endRoad = others[1]
		var lE = begRoad.lineL.extend();
		var rE = begRoad.lineR.extend();
	
	
		if(road.line.intersect(lE) ==null){
			var incomeR = rE;
		}
		else{
			var incomeR = lE;
		}
		road.line.clearInters();
		//var i = incomeR.extend();
		//i.render.colour = "green";
		
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
		var rNs = {}
		rNs[begRoad.id] = [begRoad.lE,begRoad.rB]
		rNs[road.id] = [road.lE,road.rB]
		rNs[endRoad.id] = [endRoad.rE,endRoad.lB];
		var  i = new intersection(rNs)
		
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
		this.nodes = Object.values(this.rNs);
		this.id = randomID();
		this.game = this.nodes[0][0].game;
		this.roads = Object.keys(this.rNs).map(road=>this.game.getRoad(road));
		this.game.intersections.push(this);
		this.update();
	}
	update(){
		for(var [key,value] of Object.entries(this.rNs)){
				var road = this.game.getRoad(key)
				var n = value[0]
				var side = n.line.tag
				if(side == "left"){
					if(n.type == "end"){
						road.endInt = this;
					}
					else{
						road.begInt = this;
					}
				}
				else{
					if(n.type == "end"){
						road.begInt = this;
					}
					else{
						road.endInt = this;
					}
				}
		}
		this.nodes = Object.values(this.rNs);
		this.roads = Object.keys(this.rNs).map(road=>this.game.getRoad(road));
		
		this.nodes = [].concat.apply([],this.nodes);

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
			for(var x = 0; x<this.nodes.length;x++){
				var node = this.nodes[x];
				if(node.type == "end"){
					node.connections = []
					for(var y =0;y<this.nodes.length;y++){
						if(this.nodes[y].type =="beg"&& this.nodes[y].line.road.id!= node.line.road.id){
							node.connections.push(this.nodes[y]);
						}
					}
				}
		}
		
		var aL = [this.ax1[0].lineL.extend(),this.ax1[0].lineR.extend()]
		var aL2 =[this.ax2[0].lineL.extend(),this.ax2[0].lineR.extend()]
		var p1 = [aL[0].intersect(aL2[0]),aL[1].intersect(aL2[0])]
		var p2 = [aL[0].intersect(aL2[1]),aL[1].intersect(aL2[1])]
		var t1 = new object(this.game,p1[1].add3(new Vector(0,0,100)),"TRI",[p1[0],p2[0]],"purple");
		var t2 = new object(this.game,p1[1].add3(new Vector(0,0,100)),"TRI",[p2[0],p2[1]],"purple");
		
		this.render = [t1,t2,l];
		aL[0].delete();
		aL[1].delete();
		aL2[0].delete();
		aL2[1].delete();
		var l = this.ax1[0].line.extend();
		var l2 = this.ax2[0].line.extend();
		
		this.cent = l.intersect(l2);
		l.delete();
		l2.delete();
		
	}
}
