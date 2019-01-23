/*
 * Cucumber world object for TestCafé.
 */
const { Selector, ClientFunction } = require('testcafe');

/**
 * Cucumber world object for TestCafé.
 *
 * Makes it possible for Cucumber step definitions to access the current TestCafé test runner.
 * It also wraps some calls such as `Selector` so that they are automatically bound to the
 * test runner without having to call `.with({boundTestRun: this.t})` explicitly.
 *  */
class TestCafeWorld {
  /**
   * Constructor.
   *
   * @param {Object} options
   * @param {function} options.attach Function used for adding attachments to hooks/steps
   * @param {Object} options.parameters Object of parameters passed in via the Cucumber runner
   * @param {TestController} options.parameters.t TestCafé test controller
   */
  constructor({ attach, parameters }) {
    // Standard initialization.
    this.attach = attach;
    this.parameters = parameters;
  }

  /**
   * TestCafé test controller.
   */
  get t() {
    return this.parameters.t;
  }

  /**
   * Global `Selector()` function bound to the current test controller.
   */
  Selector(init, options) {
    return Selector(init, { ...options, boundTestRun: this.t });
  }

  /**
   * Global `ClientFunction()` function bound to the current test controller.
   */
  ClientFunction(fn, options) {
    return ClientFunction(fn, { ...options, boundTestRun: this.t });
  }

  /**
   * `t.eval()` method bound to the current test controller.
   */
  async eval(fn, options) {
    return await this.t.eval(fn, { ...options, boundTestRun: this.t });
  }
}

module.exports = { TestCafeWorld };
