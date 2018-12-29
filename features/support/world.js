/*
 * Cucumber world setup.
 */
const { setWorldConstructor } = require('cucumber');

class World {
  constructor({ attach, parameters }) {
    this.attach = attach;
    this.parameters = parameters;
  }
}
setWorldConstructor(World);
