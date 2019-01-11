const { When } = require('cucumber');

const routes = require('../../routes.json');

// Home Page
When('I go to the Home Page', async function() {
  await this.t.navigateTo(global.APP_ADDRESS + routes.home);
});
