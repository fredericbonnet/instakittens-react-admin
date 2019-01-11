const { Then } = require('cucumber');

// Selectors.
const menuSel = '[class^="Menu-main-"]';
const resourceListSel = '[class*="Datagrid-"]';
const showTabSel = '.show-tab';
const editTabSel = '.form-tab';

// Resource Menu
Then('I should see the Resource Menu', async function() {
  await this.t.expect(this.Selector(menuSel).exists).ok();
});

// Resource List
Then(`I should see a Resource List`, async function() {
  await this.t.expect(this.Selector(resourceListSel).exists).ok();
});

// Resource Show Tabs
Then(`I should see {int} tabs on the Show Page`, async function(nb) {
  await this.t.expect(this.Selector(showTabSel).count).eql(nb);
});

// Resource Edit Tabs
Then(`I should see {int} tabs on the Edit Page`, async function(nb) {
  await this.t.expect(this.Selector(editTabSel).count).eql(nb);
});
