
var MovingObject = require("./movingObject");
var Util = require("./util");
var Bullet = require("./bullet");

function randomColor() {
  var hexDigits = "0123456789ABCDEF";

  var color = "#";
  for (var i = 0; i < 3; i ++) {
    color += hexDigits[Math.floor((Math.random() * 16))];
  }

  return color;
}

var Ship = function (options) {

  options.vel = options.vel || [0, 0];
  options.color = "#00ff00";
  options.pos = options.pos;
  options.radius = 11;
  options.size = [40,40];
  options.type = 'Ship';
  MovingObject.call(this, options);
  this.aPress = false;
  this.dPress = false;
};

Util.inherits(Ship, MovingObject);

Ship.prototype.keydown = function (event, game) {
  if (game.ship[0].pos[0] > 100) {
    if (event.keyCode === 65) {
      this.aPress = true;
      this.vel[0] = -3;
    }
  }

  if (game.ship[0].pos[0] < 900) {
    if (event.keyCode === 68) {
      this.dPress = true;
      this.vel[0] = 3;
    }
  }

};

Ship.prototype.keyup = function (event) {
  if (event.keyCode === 65) {
    if (this.dPress) {
      this.vel[0] = 4;
    } else {
      this.vel[0] = 0;
    }
    this.aPress = false;
  } else if (event.keyCode === 68) {
    if (this.aPress) {
      this.vel[0] = -4;
    } else {
      this.vel[0] = 0;
    }
    this.dPress = false;
  }

};

var bulletSound = new Audio("./images/laser7.wav");
bulletSound.volume = .2;

Ship.prototype.fireBullet = function (numBullets) {
    bulletSound.currentTime = 0;
    bulletSound.play();

  var norm = Util.norm(this.vel);

  var relVel = Util.scale(
    [0,-1],
    Bullet.SPEED
  );

  var bulletVel = [
    relVel[0] + this.vel[0], relVel[1] + this.vel[1]
  ];

  var bullet = new Bullet({
    pos: [this.pos[0], this.pos[1]],
    vel: relVel,
    color: this.color,
    radius: 2.5,
    game: this.game,
    size: [30,30]
  });

  this.game.add(bullet);
};

Ship.prototype.power = function (impulse) {
  document.addEventListener('keydown', function (event) {
    if (event.keyCode === 65 || event.keyCode === 68) {
      this.vel[0] = impulse[0]*3;

    }
  }.bind(this));
  // document.addEventListener('keyup', function () {
  //   this.vel[0] = 0;
  // }.bind(this));
  document.addEventListener('keyup', function (event) {
    if (event.keyCode === 65 || event.keyCode === 68) {
      this.vel[0] = 0;

    }
  }.bind(this));
  // this.vel[1] += impulse[1];
};

Ship.prototype.relocate = function () {
  this.pos = this.game.randomPosition();
  this.vel = [0, 0];
};

Ship.prototype.type = "Ship";
module.exports = Ship;
