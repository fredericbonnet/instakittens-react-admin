const { Then } = require('cucumber');

// Selectors
const messageSel = `[class*="SnackbarContent-message"]`;
const warningSel = '[class*=" Connect-Notification--warning"]';

Then('the resource should not be found', async function() {
  await this.page.waitForSelector(warningSel, { visibility: 'visible' });
  expect(await this.page.$(warningSel)).to.exist;
});
Then(
  'the resource should be deleted',
  { timeout: 10000 }, // FIXME see below
  async function() {
    await this.page.waitForSelector(messageSel, { visibility: 'visible' });
    expect(await this.page.$(messageSel)).to.exist;
    expect(await this.page.$eval(messageSel, e => e.textContent)).to.include(
      'Element deleted'
    );
    await this.page.waitFor(5000); // FIXME configure or disable undo delay.
    await this.page.waitForSelector(messageSel, { visibility: 'hidden' });
    expect(await this.page.$(messageSel)).to.not.exist;
  }
);

Then('the Id {string} should equal the Id {string}', async function(v1, v2) {
  const id1 = this.getVariable(v1);
  const id2 = this.getVariable(v2);
  expect(id1).to.equal(id2);
});
