const { When, Then } = require('cucumber');

const routes = require('../../e2e/routes.json');

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
  await this.page.waitForSelector(menuItemSel, { visible: true });
  expect(await this.page.$(menuItemSel)).to.exist;
});

// Comments List Page
When(`I go to the Comments List Page`, async function() {
  await this.page.goto(global.APP_ADDRESS + routes.comments);
  await this.page.waitForSelector(listPageSel, { visible: true });
});
Then(`I should see a Comments List Page`, async function() {
  await this.page.waitForSelector(listPageSel, { visible: true });
  expect(await this.page.$(listPageSel)).to.exist;
});

// Comments Show Page
Then(`I should see a Comments Show Page`, async function() {
  await this.page.waitForSelector(showPageSel, { visible: true });
  expect(await this.page.$(showPageSel)).to.exist;
});

// Comments Edit Page
Then(`I should see a Comments Edit Page`, async function() {
  await this.page.waitForSelector(editPageSel, { visible: true });
  expect(await this.page.$(editPageSel)).to.exist;
});

// Comments Tabs
Then(`I should see a Comments tab on the Show Page`, async function() {
  await this.page.waitForSelector(showTabSel, { visible: true });
  expect(await this.page.$(showTabSel)).to.exist;
});
Then(`I should see a Comments tab on the Edit Page`, async function() {
  await this.page.waitForSelector(editTabSel, { visible: true });
  expect(await this.page.$(editTabSel)).to.exist;
});
