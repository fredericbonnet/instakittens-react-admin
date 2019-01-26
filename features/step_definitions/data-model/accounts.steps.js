const { Given } = require('cucumber');

const routes = require('../../../e2e/routes.json');

const { getAccount, login } = require('../../../e2e/utils');

Given('I am identified', async function() {
  await login(this.page, this.account.username, this.account.password);
});
