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
