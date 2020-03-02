 class Car {
  constructor(position, colour, game, scale = 1) {
    this.selected = false;
    this.game = game;
    this.mouseOffset = [false, [0, 0]];
    this.position = position;
    this.colour = colour;
    this.angle = 0;
    this.speed = 1;
    this.gamePos = position;
    this.frame = new object(
      this.game,
      position.copy(),
      "RECT",
      [60 * scale, 35 * scale],
      "random",
      "frame",
      true
    );
    this.hitBox = new object(
      game,
      new Point(this.frame.size[0] / 2 + 30, 0),
      "RECT",
      [60, this.frame.size[1], 3],
      "red",
      "hitbox",
      true
    );
    this.hitBox.rendering = false;
    this.window = new object(
      game,
      new Point(this.frame.size[0] / 2 - 10, 0, 2),
      "RECT",
      [20, this.frame.size[1]],
      "#d8e8e6"
    );
    this.leftHead = new object(
      game,
      new Point(-this.frame.size[0] / 2 + 4, -this.frame.size[1] / 2 + 4, 2),
      "RECT",
      [8, 8],
      "red"
    );
    this.rightHead = new object(
      game,
      new Point(-this.frame.size[0] / 2 + 4, this.frame.size[1] / 2 - 4, 2),
      "RECT",
      [8, 8],
      "red"
    );
    this.leftGlows = [];
    for (var x = 0; x < 4; x++) {
      var glow = new object(
        game,
        new Point(0, 0, 0.4),
        "CIRCLE",
        [30 - 30 / (x + 1), 135 * (Math.PI / 180), 235 * (Math.PI / 180)],
        "orange"
      );
      glow.transparency = 0.3;
      this.leftGlows.push(glow);
    }
    this.leftGlow = new object(game, new Point(0, 0));
    this.selectedFrame = new object(
      game,
      new Point(0, 0, 3),
      "RECT",
      [this.frame.size[0], this.frame.size[1]],
      "green"
    );
    this.selectedFrame.transparency = 0.9;
    this.selectedFrame.rendering = false;
    this.frame.addSubObject(this.hitBox);
    this.frame.addSubObject(this.window);
    this.frame.addSubObject(this.selectedFrame);
    this.frame.addSubObject(this.leftHead);
    this.frame.addSubObject(this.rightHead);
    this.leftHead.addSubObject(this.leftGlow);
    for (var x = 0; x < this.leftGlows.length; x++) {
      this.leftGlow.addSubObject(this.leftGlows[x]);
    }
    this.leftGlow.setAllRendering(true);
    this.leftLight = false;
  }
  setLeftLight(val) {
    this.leftLight = val;
  }
  move(vec, DT = true) {
    this.position.move(vec.times(DT ? this.game.DT : 1));
    this.frame.moveAll(vec, DT);
  }
  rotate(angle, DT = true) {
    this.angle += angle * (DT ? this.game.DT : 1);

    this.frame.rotateAll(angle, this.frame.absPos, DT);
  }

  update() {
    if (this.angle > 360) {
      this.angle -= 360;
    }
    if (this.angle < 0) {
      this.angle += 360;
    }
    if (this.selected) {
      this.selectedFrame.rendering = true;
      if (this.mouseOffset[0] == false) {
        this.mouseOffset[1] = this.game.camera.screenToGamePos(
          this.game.mousePos
        );
        this.mouseOffset[0] = true;
        this.thisOff = this.mouseOffset[1].minus(this.position);
      }
      if (this.frame.collStates["frame"][0]||this.frame.collStates["road"][0]) {
        this.selectedFrame.colour = "red";
      } else {
        this.selectedFrame.colour = "green";
      }
      var target = this.game.camera.screenToGamePos(this.game.mousePos);
      target = target.minus(this.thisOff);
      var dif = target.minus(this.position);
      dif.z = 0;
      this.move(dif, false);
    } else {
      this.mouseOffset[0] = false;
      this.selectedFrame.rendering = false;
    }
   
    if (this.leftLight) {
      this.leftHead.colour = "orange";
      this.leftGlow.setAllRendering(true);
    } else {
      this.leftHead.colour = "red";
      this.leftGlow.setAllRendering(true);
    }
  }
  select(val) {
    if (!val == this.selected) {
      this.selected = val;
      if (val) {
        this.move(new Vector(0, 0, 5), false);
      } else {
        this.move(new Vector(0, 0, -5), false);
      }
    }
  }
  run() {
    if (this.position.x < 3000) {
    } else {
      if (this.position.x > 3000) {
        this.move(
          new Vector(
            -10 * Math.cos((-this.angle * Math.PI) / 180),
            -10 * Math.sin((-this.angle * Math.PI) / 180)
          )
        );
      }
      if (this.angle < 90) {
        this.rotate(90);
      }
    }
    if (!this.hitBox.collStates["frame"][0]) {
      if (this.position.y > -3000) {
        this.move(
          new Vector(
            100 * Math.cos((-this.angle * Math.PI) / 180),
            100 * Math.sin((-this.angle * Math.PI) / 180)
          )
        );
      }
    }
    //this.rotate(90);
  }
  delete() {
    this.frame.deleteAll();
    this.game.cars.splice(this.game.cars.indexOf(this), 1);
  }
}
