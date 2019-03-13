/// <reference path="../../steps.d.ts" />

/** @type {CodeceptJS.I} */
const I = require('../../steps')();

Given('I am identified', async () => {
  const world = await I.getWorld();
  I.login(world.account.username, world.account.password);
});
