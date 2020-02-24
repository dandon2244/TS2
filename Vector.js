class Vector {
  constructor(x, y, z = 0) {
    this.x = x;
    this.y = y;
    this.z = z;
  }
  negative() {
    return new Vector(-this.x, -this.y, this.z);
  }
  add(other) {
    return new Vector(this.x + other.x, this.y + other.y, this.z);
  }
  add3(other) {
    return new Vector(this.x + other.x, this.y + other.y, this.z);
  }
  times3(n) {
    return new Vector(this.x * n, this.y * n, this.z * n);
  }
  normalise(){
	  return Maths.normalize(this);
  }
  times(n) {
    return new Vector(this.x * n, this.y * n, this.z);
  }
  copy(){
	  return new Vector(this.x,this.y,this.z);
  }
  rotate(angle) {
 
  if (this.x == 0 && this.y == 0) {
    return new Vector(0,0,this.z)
  }
  return new Vector(this.x*Maths.cos(angle)-this.y*Maths.sin(angle),this.x*Maths.sin(angle)+this.y*Maths.cos(angle));
}
  getAngle() {
    if (this.x == 0) {
      if (this.y == 0) {
        return 0;
      }
      if (this.y > 0) {
        return 90;
      }
      if (this.y < 0) {
        return 360 - 90;
      }
    }
    var angle = (180 / Math.PI) * Math.atan(this.y / this.x);
    if (this.x > 0) {
      return angle;
    }
    if (this.x < 0) {
      if (this.y < 0) {
        return angle - 180;
      }
      return angle + 180;
    }
  }
  getPerependicular(){
	  return this.getAngle()+90;
  }
  
  mag(){
	  return Math.sqrt(this.x**2+this.y**2);
  }

  toString() {
    return (
      "X: " +
      this.x.toString() +
      ", Y: " +
      this.y.toString() +
      ", Z: " +
      this.z.toString()
    );
  }
}
