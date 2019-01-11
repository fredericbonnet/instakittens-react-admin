const { When, Then } = require('cucumber');

const routes = require('../../routes.json');

// Selectors.
const menuSel = '[class^="Menu-main-"]';
const menuItemSel = `${menuSel} [role=menuitem][href="${routes.comments}"]`;
const listPageSel = '.list-page';
const showPageSel = '.show-page';
const editPageSel = '.edit-page';
const showTabSel = '.show-tab[path=comments]';
const editTabSel = '.form-tab[path=comments]';

// Comments Menu Item
Then(`I should see a Comments Menu Item`, async function() {
  await this.t.expect(this.Selector(menuItemSel).exists).ok();
});

// Comments List Page
When(`I go to the Comments List Page`, async function() {
  await this.t.navigateTo(global.APP_ADDRESS + routes.comments);
});
Then(`I should see a Comments List Page`, async function() {
  await this.t.expect(this.Selector(listPageSel).exists).ok();
});

// Comments Show Page
Then(`I should see a Comments Show Page`, async function() {
  await this.t.expect(this.Selector(showPageSel).exists).ok();
});

// Comments Edit Page
Then(`I should see a Comments Edit Page`, async function() {
  await this.t.expect(this.Selector(editPageSel).exists).ok();
});

// Comments Tabs
Then(`I should see a Comments tab on the Show Page`, async function() {
  await this.t.expect(this.Selector(showTabSel).exists).ok();
});
Then(`I should see a Comments tab on the Edit Page`, async function() {
  await this.t.expect(this.Selector(editTabSel).exists).ok();
});
