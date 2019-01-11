const { When, Then } = require('cucumber');

const routes = require('../../routes.json');

// Selectors.
const menuSel = '[class^="Menu-main-"]';
const menuItemSel = `${menuSel} [role=menuitem][href="${routes.albums}"]`;
const listPageSel = '.list-page';
const showPageSel = '.show-page';
const editPageSel = '.edit-page';
const showTabSel = '.show-tab[path=albums]';
const editTabSel = '.form-tab[path=albums]';
const refColumnSel = '.column-album_id a';
const refFieldSel = '.ra-field-album_id a';
const refInputSel = 'input[name=album_id]';

// Albums Menu Item
Then(`I should see a Albums Menu Item`, async function() {
  await this.t.expect(this.Selector(menuItemSel).exists).ok();
});

// Albums List Page
When(`I go to the Albums List Page`, async function() {
  await this.t.navigateTo(global.APP_ADDRESS + routes.albums);
});
Then(`I should see a Albums List Page`, async function() {
  await this.t.expect(this.Selector(listPageSel).exists).ok();
});

// Albums Show Page
Then(`I should see a Albums Show Page`, async function() {
  await this.t.expect(this.Selector(showPageSel).exists).ok();
});

// Albums Edit Page
Then(`I should see a Albums Edit Page`, async function() {
  await this.t.expect(this.Selector(editPageSel).exists).ok();
});

// Album References
Then(`I should see a Album Link in the Resource List`, async function() {
  await this.t.expect(this.Selector(refColumnSel).exists).ok();
});
Then(`I should see a Album Link on the Show Page`, async function() {
  await this.t.expect(this.Selector(refFieldSel).exists).ok();
});
Then(`I should see a Album Input on the Edit Page`, async function() {
  await this.t.expect(this.Selector(refInputSel).exists).ok();
});

// Albums Tabs
Then(`I should see a Albums tab on the Show Page`, async function() {
  await this.t.expect(this.Selector(showTabSel).exists).ok();
});
Then(`I should see a Albums tab on the Edit Page`, async function() {
  await this.t.expect(this.Selector(editTabSel).exists).ok();
});
