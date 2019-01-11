const { When, Then } = require('cucumber');

const routes = require('../../routes.json');

// Selectors.
const menuSel = '[class^="Menu-main-"]';
const menuItemSel = `${menuSel} [role=menuitem][href="${routes.photos}"]`;
const listPageSel = '.list-page';
const showPageSel = '.show-page';
const editPageSel = '.edit-page';
const showTabSel = '.show-tab[path=photos]';
const editTabSel = '.form-tab[path=photos]';
const refColumnSel = '.column-photo_id a';
const refFieldSel = '.ra-field-photo_id a';
const refInputSel = 'input[name=photo_id]';

// Photos Menu Item
Then(`I should see a Photos Menu Item`, async function() {
  await this.t.expect(this.Selector(menuItemSel).exists).ok();
});

// Photos List Page
When(`I go to the Photos List Page`, async function() {
  await this.t.navigateTo(global.APP_ADDRESS + routes.photos);
});
Then(`I should see a Photos List Page`, async function() {
  await this.t.expect(this.Selector(listPageSel).exists).ok();
});

// Photos Show Page
Then(`I should see a Photos Show Page`, async function() {
  await this.t.expect(this.Selector(showPageSel).exists).ok();
});

// Photos Edit Page
Then(`I should see a Photos Edit Page`, async function() {
  await this.t.expect(this.Selector(editPageSel).exists).ok();
});

// Photo References
Then(`I should see a Photo Link in the Resource List`, async function() {
  await this.t.expect(this.Selector(refColumnSel).exists).ok();
});
Then(`I should see a Photo Link on the Show Page`, async function() {
  await this.t.expect(this.Selector(refFieldSel).exists).ok();
});
Then(`I should see a Photo Input on the Edit Page`, async function() {
  await this.t.expect(this.Selector(refInputSel).exists).ok();
});

// Photos Tabs
Then(`I should see a Photos tab on the Show Page`, async function() {
  await this.t.expect(this.Selector(showTabSel).exists).ok();
});
Then(`I should see a Photos tab on the Edit Page`, async function() {
  await this.t.expect(this.Selector(editTabSel).exists).ok();
});
