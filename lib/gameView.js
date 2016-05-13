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
