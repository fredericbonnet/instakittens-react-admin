const { Then } = require('cucumber');

// Selectors.
const pageTitleSel = '#react-admin-title';

Then('the Page Title should contain {string}', async function(string) {
  await this.page.waitForSelector(pageTitleSel);
  const title = await this.page.$(pageTitleSel);
  const textContent = await title.getProperty('textContent');
  expect(await textContent.jsonValue()).to.include(string);
});
