/// <reference path="../steps.d.ts" />

const I = actor();

// Selectors.
const menuSel = '[class^="Menu-main-"]';
const resourceListSel = '[class*="Datagrid-"]';
const showTabSel = '.show-tab';
const editTabSel = '.form-tab';

// Resource Menu
Then('I should see the Resource Menu', () => {
  I.seeElement(menuSel);
});

// Resource List
Then(`I should see a Resource List`, () => {
  I.seeElement(resourceListSel);
});

// Resource Show Tabs
Then(`I should see {int} tabs on the Show Page`, nb => {
  // await this.t.expect(this.Selector(showTabSel).count).eql(nb);
  I.seeNumberOfElements(showTabSel, nb);
});

// Resource Edit Tabs
Then(`I should see {int} tabs on the Edit Page`, nb => {
  I.seeNumberOfElements(editTabSel, nb);
});
