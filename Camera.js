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
