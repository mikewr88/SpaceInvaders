var Enemy =  require('./enemies');
var Bullet = require('./bullet');
var Ship = require('./spaceShip');
var Bomb = require('./bomb');
var Explosion = require('./explosion');

var Game = function () {
  this.enemies = [];
  this.bullets = [];
  this.ship = [];
  this.bombs = [];
  this.explosions = [];
  this.score = 0;
  this.rateOfBomb = .003;
  this.level = 0;
  this.bulletMax = 1.7;

  // this.addEnemies();

};

Game.BACK_COLOR = '#000000';
Game.DIM_X = 1000;
Game.DIM_Y = 600;
Game.FPS = 40;
Game.NUM_ENEMIES = 50;

var background = new Image();
background.src = './images/background1.jpg';

Game.prototype.draw = function (ctx, gameOver) {

  ctx.clearRect(0, 0, Game.DIM_X, Game.DIM_Y);
  ctx.fillStyle = Game.BACK_COLOR;
  ctx.fillRect(0, 0, Game.DIM_X, Game.DIM_Y);
  ctx.drawImage(background, 0, 0, Game.DIM_X, Game.DIM_Y);
  ctx.font = "14px Arial";
  ctx.fillStyle = 'green';
  ctx.fillText("A: Left   D: Right   Enter: Shoot    SpaceBar: Restart" ,50,560);
  ctx.font = "30px Arial";
  ctx.fillStyle = 'green';
  ctx.fillText("Score:" + this.score ,800,550);
  ctx.font = "30px Arial";
  ctx.fillStyle = 'green';
  ctx.fillText("Level:" + this.level ,840,23);
  if (gameOver) {
    ctx.font = "80px Arial";
    ctx.fillStyle = 'green';
    ctx.fillText("GAME OVER" ,280,300);
  }
  this.allObjects().forEach(function (object) {
      object.draw(ctx);
  });
};

Game.prototype.assignShooters = function () {
  var shooters = {};
  for (var i = 0; i < this.enemies.length; i++) {
    var enemy1 = this.enemies[i];
    this.enemies.forEach(function (enemy2) {
      if (enemy1.pos[0] === enemy2.pos[0] && enemy1.pos[1] >= enemy2.pos[1]){
        shooters[enemy1.pos[0]] = enemy1;
        enemy2.shooter = false;
      }
    });
  }
  for (var key in shooters) {
    shooters[key].shooter = true;
  }
};

Game.prototype.reverseEnemies = function () {
  var newEnemies = [];
  var velocity;
  this.enemies.forEach(function (enemy) {
    if (enemy.vel[0] > 0) {
      velocity = enemy.vel[0] + 0.06;
    }
    if (enemy.vel[0] < 0) {
      velocity = enemy.vel[0] - 0.06;
    }
    enemy.vel[0] = -velocity;
    enemy.pos[1] += 20;
    newEnemies.push(enemy);
  });
};

var explosionSound = new Audio("./images/atari_boom3.wav");
explosionSound.volume = .2;
var shipSound = new Audio('./images/atari_boom5.wav');
shipSound.volume = .2;

Game.prototype.remove = function (object) {
  if (object instanceof Bullet) {
    this.bullets.splice(this.bullets.indexOf(object), 1);
  } else if (object instanceof Enemy) {
    var pos = object.pos;
    var idx = this.enemies.indexOf(object);
    explosionSound.currentTime = 0;
    explosionSound.play();
    this.enemies.splice(this.enemies.indexOf(object), 1);
    this.score += 50;
    this.addExplosion(pos);
  } else if (object instanceof Ship) {
    var pos = object.pos;
    this.ship.splice(this.ship.indexOf(object), 1);
    shipSound.play();
    this.addExplosion(pos);
  } else if (object instanceof Bomb) {
    this.bombs.splice(this.bombs.indexOf(object), 1);
  } else if (object instanceof Explosion) {
    this.explosions.splice(this.explosions.indexOf(object), 1);
  } else {
    throw "wtf?";
  }
  this.assignShooters();
};


Game.prototype.isOutOfBounds = function (bullet) {
  if ((bullet.pos[1] < 0) || (bullet.pos[1] > Game.DIM_Y)){
    this.bullets.splice(this.bullets.indexOf(bullet), 1);
  }
};

Game.prototype.add = function (object) {

  if (object.type === "Enemy") {
    this.enemies.push(object);
  } else if (object.type === "Bullet") {
    this.bullets.push(object);
  } else if (object.type === "Ship") {
    this.ship.push(object);
  } else if (object.type === 'Bomb') {
    this.bombs.push(object);
  } else if (object.type === 'Explosion') {
    this.explosions.push(object);
  } else {
    throw 'wtf';
  }
};

Game.prototype.addEnemies = function () {
  this.enemies = [];
  this.rateOfBomb += .002;
  this.level += 1;
  if (this.level%2 === 1){
    this.bulletMax += .3;
  }

  var startX = 0, startY = 0;
  for (var i = 0; i < Game.NUM_ENEMIES; i++) {
    if (i % 10 === 0) {
      startY += 30;
      startX = 0;
    }
    startX += 60;

    this.add(new Enemy({ game: this , pos: [startX, startY]}));
  }
};

Game.prototype.addShip = function () {
  var ship = new Ship({
    pos: [500, 500],
    game: this
  });
  this.add(ship);

  return ship;
};

Game.prototype.addExplosion = function (pos) {
  var explosion = new Explosion({
    pos: pos,
    game: this
  });
  this.add(explosion);

  return explosion;
};

Game.prototype.allObjects = function () {
  return [].concat(this.ship, this.enemies, this.bullets, this.bombs, this.explosions);
};

Game.prototype.checkCollisions = function () {
  var game = this;
  this.allObjects().forEach(function (obj1) {
    game.allObjects().forEach(function (obj2) {
      if (obj1 === obj2 || obj1.type === "Explosion" || obj2.type === "Explosion") {
        return;
      }

      if (obj1.isCollidedWith(obj2)) {
        obj1.collideWith(obj2);
      }
    });
  });
};

Game.prototype.checkBoundary = function () {
  if (this.ship[0]) {
    var ship = this.ship[0];
    if (ship.pos[0] > 900 || ship.pos[0] < 100) {
      ship.vel[0] = 0;
    }
  }
  this.bullets.forEach(function (bullet) {
    this.isOutOfBounds(bullet);
  }.bind(this));
};

Game.prototype.shootBombs = function () {
  this.enemies.forEach(function (enemy) {
    if (enemy.shooter) {
      var rand = Math.random();
      if (rand < this.rateOfBomb) {
        enemy.fireBomb();
      }
    }
  }.bind(this));
};

Game.prototype.reachShip = function () {
  var reached = false;
  this.enemies.forEach(function (enemy) {
    if (enemy.pos[1] >= 480) {
      reached = true;
    }
  });
  return reached;
};

Game.prototype.checkGameOver = function () {
  if (this.ship.length === 0 || this.reachShip()){
    return true;
  }else {
    return false;
  }
};

Game.prototype.checkWinRound = function () {
  if (this.enemies.length === 0) {
    return true;
  } else {
    return false;
  }
};

Game.prototype.step = function (delta) {
  this.checkGameOver();
  this.checkWinRound();
  this.moveObjects(delta);
  this.checkCollisions();
  this.checkBoundary();
  this.shootBombs();
};

Game.prototype.randomPosition = function () {
  return [
    Game.DIM_X * Math.random(),
    Game.DIM_Y * Math.random()
  ];
};

Game.prototype.moveObjects = function (delta) {
  this.allObjects().forEach(function (object) {
    object.move(delta);
  });
};

Game.prototype.numBullets = function () {
  return this.bullets.length;
};
module.exports = Game;
