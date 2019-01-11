const { Then } = require('cucumber');

// Selectors.
const pageTitleSel = '#react-admin-title';

Then('the Page Title should contain {string}', async function(string) {
  await this.t.expect(this.Selector(pageTitleSel).withText(string).exists).ok();
});
