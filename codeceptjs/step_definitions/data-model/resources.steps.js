/// <reference path="../../steps.d.ts" />

/** @type {CodeceptJS.I} */
const I = require('../../steps')();

// Selectors
const messageSel = `[class*="SnackbarContent-message"]`;
const warningSel = '[class*=" Connect-Notification--warning"]';
const headerSel = 'header';

Then('the resource should not be found', async () => {
  I.waitForElement(warningSel);
  I.click(headerSel);
});
Then('the resource should be deleted', () => {
  I.see('Element deleted', messageSel);
  I.click(headerSel);
});

Then('the Id {string} should equal the Id {string}', async (v1, v2) => {
  const world = await I.getWorld();
  const id1 = world.getVariable(v1);
  const id2 = world.getVariable(v2);
  expect(id1).to.equal(id2);
});
