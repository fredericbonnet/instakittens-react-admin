const { When, Then } = require('cucumber');

const routes = require('../../e2e/routes.json');

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
  await this.page.waitForSelector(menuItemSel, { visibility: 'visible' });
  expect(await this.page.$(menuItemSel)).to.exist;
});

// Users List Page
When(`I go to the Users List Page`, async function() {
  await this.page.goto(global.APP_ADDRESS + routes.users);
  await this.page.waitForSelector(listPageSel, { visibility: 'visible' });
});
Then(`I should see a Users List Page`, async function() {
  await this.page.waitForSelector(listPageSel, { visibility: 'visible' });
  expect(await this.page.$(listPageSel)).to.exist;
});

// Users Show Page
Then(`I should see a Users Show Page`, async function() {
  await this.page.waitForSelector(showPageSel, { visibility: 'visible' });
  expect(await this.page.$(showPageSel)).to.exist;
});

// Users Edit Page
Then(`I should see a Users Edit Page`, async function() {
  await this.page.waitForSelector(editPageSel, { visibility: 'visible' });
  expect(await this.page.$(editPageSel)).to.exist;
});

// User References
Then(`I should see a User Link in the Resource List`, async function() {
  await this.page.waitForSelector(refColumnSel, { visibility: 'visible' });
  expect(await this.page.$(refColumnSel)).to.exist;
});
Then(`I should see a User Link on the Show Page`, async function() {
  await this.page.waitForSelector(refFieldSel, { visibility: 'visible' });
  expect(await this.page.$(refFieldSel)).to.exist;
});
Then(`I should see a User Input on the Edit Page`, async function() {
  await this.page.waitForSelector(refInputSel, { visibility: 'visible' });
  expect(await this.page.$(refInputSel)).to.exist;
});
