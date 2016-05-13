var Util = require("./util");
var MovingObject = require("./movingObject");
var Enemy = require("./enemies");

var Bullet = function (options) {
  this.pos = options.pos;
  this.vel = options.vel;
  this.radius = options.radius;
  this.game = options.game;
  this.color = options.color;
  options.type = 'Bullet';
  MovingObject.call(this, options);
};

Bullet.RADIUS = 2;
Bullet.SPEED = 10;

Util.inherits(Bullet, MovingObject);

// Bullet.prototype.collideWith = function (otherObject) {
//   if (otherObject.type === "Enemy") {
//     this.remove();
//     otherObject.remove();
//   }
// };

Bullet.prototype.isWrappable = false;
Bullet.prototype.type = "Bullet";

module.exports = Bullet;
