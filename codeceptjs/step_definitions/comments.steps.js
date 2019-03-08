/// <reference path="../steps.d.ts" />

const I = actor();

const routes = require('../routes.json');

// Selectors.
const menuSel = '[class^="Menu-main-"]';
const menuItemSel = `${menuSel} [role=menuitem][href="${routes.comments}"]`;
const listPageSel = '.list-page';
const showPageSel = '.show-page';
const editPageSel = '.edit-page';
const showTabSel = '.show-tab[path=comments]';
const editTabSel = '.form-tab[path=comments]';

// Comments Menu Item
Then(`I should see a Comments Menu Item`, () => {
  I.seeElement(menuItemSel);
});

// Comments List Page
When(`I go to the Comments List Page`, () => {
  I.amOnPage(routes.comments);
});
Then(`I should see a Comments List Page`, () => {
  I.seeElement(listPageSel);
});

// Comments Show Page
Then(`I should see a Comments Show Page`, () => {
  I.seeElement(showPageSel);
});

// Comments Edit Page
Then(`I should see a Comments Edit Page`, () => {
  I.seeElement(editPageSel);
});

// Comments Tabs
Then(`I should see a Comments tab on the Show Page`, () => {
  I.seeElement(showTabSel);
});
Then(`I should see a Comments tab on the Edit Page`, () => {
  I.seeElement(editTabSel);
});
