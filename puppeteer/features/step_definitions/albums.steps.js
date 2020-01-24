const { When, Then } = require('cucumber');

const routes = require('../../e2e/routes.json');

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
  await this.page.waitForSelector(menuItemSel, { visible: true });
  expect(await this.page.$(menuItemSel)).to.exist;
});

// Albums List Page
When(`I go to the Albums List Page`, async function() {
  await this.page.goto(global.APP_ADDRESS + routes.albums);
  await this.page.waitForSelector(listPageSel, { visible: true });
});
Then(`I should see a Albums List Page`, async function() {
  await this.page.waitForSelector(listPageSel, { visible: true });
  expect(await this.page.$(listPageSel)).to.exist;
});

// Albums Show Page
Then(`I should see a Albums Show Page`, async function() {
  await this.page.waitForSelector(showPageSel, { visible: true });
  expect(await this.page.$(showPageSel)).to.exist;
});

// Albums Edit Page
Then(`I should see a Albums Edit Page`, async function() {
  await this.page.waitForSelector(editPageSel, { visible: true });
  expect(await this.page.$(editPageSel)).to.exist;
});

// Album References
Then(`I should see a Album Link in the Resource List`, async function() {
  await this.page.waitForSelector(refColumnSel, { visible: true });
  expect(await this.page.$(refColumnSel)).to.exist;
});
Then(`I should see a Album Link on the Show Page`, async function() {
  await this.page.waitForSelector(refFieldSel, { visible: true });
  expect(await this.page.$(refFieldSel)).to.exist;
});
Then(`I should see a Album Input on the Edit Page`, async function() {
  await this.page.waitForSelector(refInputSel, { visible: true });
  expect(await this.page.$(refInputSel)).to.exist;
});

// Albums Tabs
Then(`I should see a Albums tab on the Show Page`, async function() {
  await this.page.waitForSelector(showTabSel, { visible: true });
  expect(await this.page.$(showTabSel)).to.exist;
});
Then(`I should see a Albums tab on the Edit Page`, async function() {
  await this.page.waitForSelector(editTabSel, { visible: true });
  expect(await this.page.$(editTabSel)).to.exist;
});
