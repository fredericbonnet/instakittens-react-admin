const { Given } = require('cucumber');

const { getAccount, login } = require('../../e2e/utils');

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
  await login(this.page, this.account.username, this.account.password);
});
