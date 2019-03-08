/// <reference path="../steps.d.ts" />

/** @type {CodeceptJS.I} */
const I = require('../steps')();

const { getAccount } = require('../utils');

Given('I am an unknown user', async () => {
  const world = await I.getWorld();
  world.account = { username: 'unknown', password: 'unknown' };
});
Given('I am a registered user', async () => {
  const world = await I.getWorld();
  world.account = getAccount('user');
});
Given('I am an administrator', async () => {
  const world = await I.getWorld();
  world.account = getAccount('admin');
});

Given('I sign into the application', async () => {
  const world = await I.getWorld();
  I.login(world.account.username, world.account.password);
});
