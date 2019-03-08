const World = require('./world');

class WorldHelper extends Helper {
  _before() {
    this.world = new World();
  }

  getWorld() {
    return this.world;
  }
}

module.exports = WorldHelper;
