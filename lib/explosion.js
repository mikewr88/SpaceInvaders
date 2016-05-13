var Util = require('./util');

var Explosion = function (options) {
  this.game = options.game;
  this.pos = options.pos;
  this.radius = 1;
  this.type = 'Explosion';
  this.growing = true;
};

Explosion.prototype.draw = function(ctx) {
  var exp1 = new Image();
  exp1.src = './images/explosion1.png';
  var exp2 = new Image();
  exp2.src = './images/explosion2.png';
  var exp3 = new Image();
  exp3.src = './images/explosion3.png';
  var exp4 = new Image();
  exp4.src = './images/explosion4.png';
  var exp5 = new Image();
  exp5.src = './images/explosion5.png';
  if (this.radius < 2.1){
    ctx.drawImage(exp1, this.pos[0] - 2.5, this.pos[1] - 2.5, 10, 10);
  }
  if (this.radius < 4.1 && this.radius >= 2.1){
    ctx.drawImage(exp2, this.pos[0] - 2.5, this.pos[1] - 2.5, 10, 10);
  }
  if (this.radius < 6.1 && this.radius >= 4.1){
    ctx.drawImage(exp3, this.pos[0] - 2.5, this.pos[1] - 2.5, 15, 15);
  }
  if (this.radius < 8.1 && this.radius >= 6.1){
    ctx.drawImage(exp4, this.pos[0] - 2.5, this.pos[1] - 2.5, 20, 20);
  }
  if (this.radius < 10.1 && this.radius >= 8.1){
    ctx.drawImage(exp5, this.pos[0] - 2.5, this.pos[1] - 2.5, 20, 20);
  }
  // ctx.beginPath();
  // ctx.fillStyle = '#f35d4f';
  // ctx.arc(
  //   this.pos[0], this.pos[1], this.radius, 0, 2 * Math.PI, true
  // );
  // ctx.fill();
};

var NORMAL_FRAME_TIME_DELTA = 1000/60;

Explosion.prototype.move = function(timeDelta) {
  var velocityScale = timeDelta / NORMAL_FRAME_TIME_DELTA;
  if (this.growing) {
    this.radius = this.radius + velocityScale * 0.5;
  } else {
    this.radius = this.radius - velocityScale * 1;
  }

  if (this.radius > 10 && this.growing) {
    this.growing = false;
  } else if (this.radius < 0 && !this.growing) {
    this.game.remove(this);
   }
};


module.exports = Explosion;
