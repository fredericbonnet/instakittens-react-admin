const { When, Then } = require('cucumber');

const routes = require('../../e2e/routes.json');

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
  await this.page.waitForSelector(menuItemSel, { visible: true });
  expect(await this.page.$(menuItemSel)).to.exist;
});

// Photos List Page
When(`I go to the Photos List Page`, async function() {
  await this.page.goto(global.APP_ADDRESS + routes.photos);
  await this.page.waitForSelector(listPageSel, { visible: true });
});
Then(`I should see a Photos List Page`, async function() {
  await this.page.waitForSelector(listPageSel, { visible: true });
  expect(await this.page.$(listPageSel)).to.exist;
});

// Photos Show Page
Then(`I should see a Photos Show Page`, async function() {
  await this.page.waitForSelector(showPageSel, { visible: true });
  expect(await this.page.$(showPageSel)).to.exist;
});

// Photos Edit Page
Then(`I should see a Photos Edit Page`, async function() {
  await this.page.waitForSelector(editPageSel, { visible: true });
  expect(await this.page.$(editPageSel)).to.exist;
});

// Photo References
Then(`I should see a Photo Link in the Resource List`, async function() {
  await this.page.waitForSelector(refColumnSel, { visible: true });
  expect(await this.page.$(refColumnSel)).to.exist;
});
Then(`I should see a Photo Link on the Show Page`, async function() {
  await this.page.waitForSelector(refFieldSel, { visible: true });
  expect(await this.page.$(refFieldSel)).to.exist;
});
Then(`I should see a Photo Input on the Edit Page`, async function() {
  await this.page.waitForSelector(refInputSel, { visible: true });
  expect(await this.page.$(refInputSel)).to.exist;
});

// Photos Tabs
Then(`I should see a Photos tab on the Show Page`, async function() {
  await this.page.waitForSelector(showTabSel, { visible: true });
  expect(await this.page.$(showTabSel)).to.exist;
});
Then(`I should see a Photos tab on the Edit Page`, async function() {
  await this.page.waitForSelector(editTabSel, { visible: true });
  expect(await this.page.$(editTabSel)).to.exist;
});
