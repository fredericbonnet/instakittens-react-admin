const { Then } = require('cucumber');

// Selectors
const messageSel = `[class*="SnackbarContent-message"]`;
const warningSel = '[class*=" Connect-Notification--warning"]';

Then('the resource should not be found', async function() {
  await this.t.expect(this.Selector(warningSel).exists).ok();
});
Then(
  'the resource should be deleted',
  { timeout: 10000 }, // FIXME see below
  async function() {
    await this.t
      .expect(this.Selector(messageSel).withText('Element deleted').exists)
      .ok();
    await this.t.wait(5000); // FIXME configure or disable undo delay.
    await this.t
      .expect(this.Selector(messageSel).withText('Element deleted').exists)
      .notOk();
  }
);

Then('the Id {string} should equal the Id {string}', async function(v1, v2) {
  const id1 = this.getVariable(v1);
  const id2 = this.getVariable(v2);
  await this.t.expect(id1).eql(id2);
});
