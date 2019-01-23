const { Given } = require('cucumber');

const routes = require('../../../routes.json');

const { getAccount, login } = require('../../../utils');

Given('I am identified', async function() {
  await this.t.navigateTo(global.APP_ADDRESS + routes.login);
  await login(this.t, this.account.username, this.account.password);
});
