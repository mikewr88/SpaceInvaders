var Util = require('./util');
var MovingObject = require('./movingObject');
var Ship = require('./spaceShip');
var Bomb = require('./bomb');

var DEFAULTS = {
  COLOR: "red"
};


var Enemy = function (options) {
  options.color = DEFAULTS.COLOR;
  options.pos = options.pos;
  options.vel = options.vel || Util.startVec(1);
  options.radius = 15;
  options.size = [30, 15];
  options.type = 'Enemy';
  this.shooter = false;
  MovingObject.call(this, options);

};

Util.inherits(Enemy, MovingObject);


Enemy.prototype.collideWith =  function (otherObject) {
  if (otherObject.type === "Ship") {
    otherObject.relocate();
  }
};

Enemy.prototype.fireBomb = function () {
  var norm = Util.norm(this.vel);

  var Vel = Util.randomVec(Bomb.SPEED);

  var bomb = new Bomb({
    pos: [this.pos[0], this.pos[1]],
    vel: Vel,
    color: this.color,
    radius: 5,
    game: this.game,
    size: [10,10]
  });

  this.game.add(bomb);
};


Enemy.prototype.type = "Enemy";

module.exports = Enemy;
