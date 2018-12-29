const { When } = require('cucumber');

const routes = require('../../e2e/routes.json');

// Home Page
When('I go to the Home Page', async function() {
  await this.page.goto(global.APP_ADDRESS + routes.home);
});
