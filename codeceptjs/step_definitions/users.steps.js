/// <reference path="../steps.d.ts" />

const I = actor();

const routes = require('../routes.json');

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
Then(`I should see a Users Menu Item`, () => {
  I.seeElement(menuItemSel);
});

// Users List Page
When(`I go to the Users List Page`, () => {
  I.amOnPage(routes.users);
});
Then(`I should see a Users List Page`, () => {
  I.seeElement(listPageSel);
});

// Users Show Page
Then(`I should see a Users Show Page`, () => {
  I.seeElement(showPageSel);
});

// Users Edit Page
Then(`I should see a Users Edit Page`, () => {
  I.seeElement(editPageSel);
});

// User References
Then(`I should see a User Link in the Resource List`, () => {
  I.seeElement(refColumnSel);
});
Then(`I should see a User Link on the Show Page`, () => {
  I.seeElement(refFieldSel);
});
Then(`I should see a User Input on the Edit Page`, () => {
  I.seeElement(refInputSel);
});
