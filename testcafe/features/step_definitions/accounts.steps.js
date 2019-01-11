const { Given } = require('cucumber');

const routes = require('../../routes.json');

const { getAccount, login } = require('../../utils');

Given('I am an unknown user', function() {
  this.account = { username: 'unknown', password: 'unknown' };
});
Given('I am a registered user', function() {
  this.account = getAccount('user');
});
Given('I am an administrator', function() {
  this.account = getAccount('admin');
});

Given('I sign into the application', async function() {
  await this.t.navigateTo(global.APP_ADDRESS + routes.login);
  await login(this.t, this.account.username, this.account.password);
});
