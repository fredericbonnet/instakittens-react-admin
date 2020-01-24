const { Then } = require('cucumber');

// Selectors.
const menuSel = '[class^="Menu-main-"]';
const resourceListSel = '[class*="Datagrid-"]';
const showTabSel = '.show-tab';
const editTabSel = '.form-tab';

// Resource Menu
Then('I should see the Resource Menu', async function() {
  await this.page.waitForSelector(menuSel, { visibility: 'visible' });
  expect(await this.page.$(menuSel)).to.exist;
});

// Resource List
Then(`I should see a Resource List`, async function() {
  await this.page.waitForSelector(resourceListSel, { visibility: 'visible' });
  expect(await this.page.$(resourceListSel)).to.exist;
});

// Resource Show Tabs
Then(`I should see {int} tabs on the Show Page`, async function(nb) {
  await this.page.waitForSelector(showTabSel, { visibility: 'visible' });
  expect(await this.page.$$(showTabSel)).to.have.lengthOf(nb);
});

// Resource Edit Tabs
Then(`I should see {int} tabs on the Edit Page`, async function(nb) {
  await this.page.waitForSelector(editTabSel, { visibility: 'visible' });
  expect(await this.page.$$(editTabSel)).to.have.lengthOf(nb);
});
