/*
 * World object support for CodeceptJS.
 *
 * World objects are used by CucumberJS to share state between steps. The
 * documentation states:
 *
 * https://github.com/cucumber/cucumber-js/blob/master/docs/support_files/world.md
 *
 * > *World* is an isolated context for each scenario, exposed to the hooks and
 * > steps as *this*.
 *
 * The CodeceptJS Cucumber implementation has no native support for world object
 * and provides no means of sharing state between steps. However we can emulate
 * this behavior using the Helper API.
 */

/** World class */
const World = require('./world');

/**
 * World helper.
 */
class WorldHelper extends Helper {
  /**
   * Create a new world object at the beginning of each test.
   */
  _before() {
    this.world = new World();
  }

  /**
   * Delete the world object at the end of each test.
   */
  _after() {
    delete this.world;
  }

  /**
   * Return the current world object.
   *
   * @note Make sure to call I.getWorld() asynchronously!
   */
  getWorld() {
    return this.world;
  }
}

module.exports = WorldHelper;
