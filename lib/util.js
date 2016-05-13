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
