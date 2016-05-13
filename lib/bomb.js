var MovingObject = require('./movingObject');
var Util = require('./util');

var Bomb = function (options) {
  this.pos = options.pos;
  this.vel = options.vel;
  this.radius = options.radius;
  this.game = options.game;
  this.color = options.color;
  options.type = 'Bomb';
  MovingObject.call(this, options);
};

Bomb.SPEED = 4;

Util.inherits(Bomb, MovingObject);
Bomb.prototype.type = 'Bomb';

module.exports = Bomb;
