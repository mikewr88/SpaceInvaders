var Util = require('./util');

var MovingObject = function (options) {
  this.pos = options.pos;
  this.vel = options.vel;
  this.color = options.color;
  this.radius = options.radius;
  this.game = options.game;
  this.size = options.size;
  this.type = options.type;
};

var alien_img = new Image();
alien_img.src = './images/alien.png';
var ship_img = new Image();
ship_img.src = './images/ship.png';
var bullet_img = new Image();
bullet_img.src = './images/bullet.png';

MovingObject.prototype.draw = function (ctx) {
  var Xsize = this.size[0];
  var Ysize = this.size[1];
  if (this.type === 'Enemy') {

    ctx.drawImage(alien_img, this.pos[0] - Xsize/2, this.pos[1] - Ysize/2, 25, 25);

  } else if (this.type === "Ship") {
    ctx.drawImage(ship_img, this.pos[0] - Xsize/2, this.pos[1] - Ysize/2, Xsize, Ysize);
  } else if (this.type === "Bullet") {
    ctx.drawImage(bullet_img, this.pos[0] - Xsize/2, this.pos[1] - Ysize/2, Xsize, Ysize);
  } else if (this.type === "Bomb") {
    // ctx.beginPath();
    // ctx.arc(this.pos[0], this.pos[1], this.radius, 0, 2*Math.PI);
    // ctx.fillStyle = 'orange';
    // ctx.fill();
    // ctx.stroke();
    ctx.beginPath();
    ctx.arc(this.pos[0], this.pos[1], this.radius, 0, 2*Math.PI);
    ctx.fillStyle = 'lime';
    ctx.fill();
    ctx.stroke();
  }else {
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.rect(this.pos[0] - Xsize/2 , this.pos[1] - Ysize/2, Xsize, Ysize);
    ctx.fill();
  }
};
var NORMAL_FRAME_TIME_DELTA = 1000/60;

MovingObject.prototype.move = function (timeDelta) {
  var velocityScale = timeDelta / NORMAL_FRAME_TIME_DELTA,
      offsetX = this.vel[0] * velocityScale,
      offsetY = this.vel[1] * velocityScale;
  this.pos = [this.pos[0] + offsetX, this.pos[1] + offsetY];
};

MovingObject.prototype.isCollidedWith = function (otherObject) {
  if (otherObject.type === "Enemy" && this.type !== "Bomb") {
    var centerDist = Util.dist(this.pos, otherObject.pos);
    return centerDist < (this.radius + otherObject.radius);
  }
  if (otherObject.type === "Bomb" && this.type === "Ship") {
    var centerDist = Util.dist(this.pos, otherObject.pos);
    return centerDist < (this.radius + otherObject.radius);
  }

};

MovingObject.prototype.collideWith = function (otherObject) {

  this.remove();
  otherObject.remove();
};

MovingObject.prototype.remove = function () {
  this.game.remove(this);
};

module.exports = MovingObject;
