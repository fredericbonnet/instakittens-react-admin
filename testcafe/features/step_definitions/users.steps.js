const { When, Then } = require('cucumber');

const routes = require('../../routes.json');

// Selectors.
const menuSel = '[class^="Menu-main-"]';
const menuItemSel = `${menuSel} [role=menuitem][href="${routes.users}"]`;
const listPageSel = '.list-page';
const showPageSel = '.show-page';
const editPageSel = '.edit-page';
const refColumnSel = '.column-user_id a';
const refFieldSel = '.ra-field-user_id a';
const refInputSel = 'input[name=user_id]';

// Users Menu Item
Then(`I should see a Users Menu Item`, async function() {
  await this.t.expect(this.Selector(menuItemSel).exists).ok();
});

// Users List Page
When(`I go to the Users List Page`, async function() {
  await this.t.navigateTo(global.APP_ADDRESS + routes.users);
});
Then(`I should see a Users List Page`, async function() {
  await this.t.expect(this.Selector(listPageSel).exists).ok();
});

// Users Show Page
Then(`I should see a Users Show Page`, async function() {
  await this.t.expect(this.Selector(showPageSel).exists).ok();
});

// Users Edit Page
Then(`I should see a Users Edit Page`, async function() {
  await this.t.expect(this.Selector(editPageSel).exists).ok();
});

// User References
Then(`I should see a User Link in the Resource List`, async function() {
  await this.t.expect(this.Selector(refColumnSel).exists).ok();
});
Then(`I should see a User Link on the Show Page`, async function() {
  await this.t.expect(this.Selector(refFieldSel).exists).ok();
});
Then(`I should see a User Input on the Edit Page`, async function() {
  await this.t.expect(this.Selector(refInputSel).exists).ok();
});
