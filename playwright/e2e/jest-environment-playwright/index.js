const NodeEnvironment = require('jest-environment-node');
const pw = require('playwright');

// Launch options.
const options = {
  headless: true,
};

class PlaywrightEnvironment extends NodeEnvironment {
  async setup() {
    await super.setup();

    // Create a new incognito page for each test suite.
    this.global.browser = await pw.firefox.launch(options);
    this.global.context = await this.global.browser.newContext();
    this.global.page = await this.global.context.newPage();
  }

  async teardown() {
    await this.global.page.close();
    await this.global.context.close();
    await this.global.browser.close();

    await super.teardown();
  }
}

module.exports = PlaywrightEnvironment;
