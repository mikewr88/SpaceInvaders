/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	var Game = __webpack_require__(1);
	var GameView = __webpack_require__(9);
	
	
	
	document.addEventListener("DOMContentLoaded", function(){
	  var canvasEl = document.getElementsByTagName("canvas")[0];
	  canvasEl.width = Game.DIM_X;
	  canvasEl.height = Game.DIM_Y;
	  var ctx = canvasEl.getContext("2d");
	  var game = new Game();
	  new GameView(game, ctx).start();
	
	
	  document.addEventListener('keydown', function (e) {
	    if (e.keyCode === 32) {
	      location.reload();
	
	    }
	  });
	
	
	});


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	var Enemy =  __webpack_require__(2);
	var Bullet = __webpack_require__(6);
	var Ship = __webpack_require__(5);
	var Bomb = __webpack_require__(7);
	var Explosion = __webpack_require__(8);
	
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


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	var Util = __webpack_require__(3);
	var MovingObject = __webpack_require__(4);
	var Ship = __webpack_require__(5);
	var Bomb = __webpack_require__(7);
	
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


/***/ },
/* 3 */
/***/ function(module, exports) {

	var Util = {
	  // Normalize the length of the vector to 1, maintaining direction.
	  dir: function (vec) {
	    var norm = Util.norm(vec);
	    return Util.scale(vec, 1 / norm);
	  },
	  // Find distance between two points.
	  dist: function (pos1, pos2) {
	    return Math.sqrt(
	      Math.pow(pos1[0] - pos2[0], 2) + Math.pow(pos1[1] - pos2[1], 2)
	    );
	  },
	
	  startVec: function (speed) {
	    return Util.scale([1, 0], speed);
	  },
	  // Find the length of the vector.
	  norm: function (vec) {
	    return Util.dist([0, 0], vec);
	  },
	  // Return a randomly oriented vector with the given length.
	  randomVec : function (length) {
	    var deg = Math.PI * (Math.random()*(.2) + .4);
	    return Util.scale([Math.cos(deg), Math.sin(deg)], length);
	  },
	  // Scale the length of a vector by the given amount.
	  scale: function (vec, length) {
	    return [vec[0] * length, vec[1] * length];
	  },
	
	  inherits: function (ChildClass, BaseClass) {
	    function Surrogate () { this.constructor = ChildClass; }
	    Surrogate.prototype = BaseClass.prototype;
	    ChildClass.prototype = new Surrogate();
	  },
	};
	
	module.exports = Util;


/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	var Util = __webpack_require__(3);
	
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


/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	
	var MovingObject = __webpack_require__(4);
	var Util = __webpack_require__(3);
	var Bullet = __webpack_require__(6);
	
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


/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	var Util = __webpack_require__(3);
	var MovingObject = __webpack_require__(4);
	var Enemy = __webpack_require__(2);
	
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


/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	var MovingObject = __webpack_require__(4);
	var Util = __webpack_require__(3);
	
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


/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	var Util = __webpack_require__(3);
	
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


/***/ },
/* 9 */
/***/ function(module, exports) {

	var GameView = function (game, ctx) {
	  this.ctx = ctx;
	  this.game = game;
	  this.ship = this.game.addShip();
	};
	
	GameView.MOVES = {
	  "w": [ 0, -1],
	  "a": [-1,  0],
	  "s": [ 0,  1],
	  "d": [ 1,  0],
	};
	
	GameView.prototype.bindKeyHandlers = function () {
	  var ship = this.ship;
	
	  // Object.keys(GameView.MOVES).forEach(function (k) {
	  //   var move = GameView.MOVES[k];
	  //   key(k, function () {
	  //
	  //     ship.power(move);
	  //   });
	  // });
	
	  key("enter", function () { ship.fireBullet() });
	};
	
	GameView.prototype.start = function () {
	  var self = this;
	  this.game.addEnemies();
	  this.game.assignShooters();
	
	    key("enter", function () {
	
	      if (this.game.numBullets() < this.game.bulletMax) {
	        this.ship.fireBullet();
	      }
	    }.bind(this));
	
	
	
	  document.addEventListener('keydown', function (event) {
	
	    self.ship.keydown(event, self.game);
	  });
	
	  document.addEventListener('keyup', function (event) {
	    self.ship.keyup(event);
	  });
	  this.lastTime = 0;
	  this.Timeout(5000);
	  requestAnimationFrame(this.animate.bind(this));
	  //start the animation
	};
	
	GameView.prototype.Timeout = function (time) {
	
	  setTimeout(function () {
	    console.log("timout");
	    this.game.reverseEnemies();
	    time -= 299;
	    if (this.game.checkWinRound()){
	      time = 5000;
	      this.game.addEnemies();
	      this.game.assignShooters();
	    }
	    if (time > -2000){
	      this.Timeout(time);
	
	    }
	    // else {
	    //   this.game.remove(this.ship);
	    // }
	  }.bind(this), time);
	};
	
	GameView.prototype.animate = function(time){
	  var timeDelta = time - this.lastTime;
	  if (this.game.checkGameOver()) {
	    this.game.draw(this.ctx, true);
	  }else{
	    this.game.step(timeDelta);
	    this.game.draw(this.ctx, false);
	    this.lastTime = time;
	    //every call to animate requests causes another call to animate
	    requestAnimationFrame(this.animate.bind(this));
	  }
	};
	
	module.exports = GameView;


/***/ }
/******/ ]);
//# sourceMappingURL=bundle.js.map