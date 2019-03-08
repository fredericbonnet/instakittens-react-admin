/// <reference path="../steps.d.ts" />

const I = actor();

const routes = require('../routes.json');

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
Then(`I should see a Albums Menu Item`, () => {
  I.seeElement(menuItemSel);
});

// Albums List Page
When(`I go to the Albums List Page`, () => {
  I.amOnPage(routes.albums);
});
Then(`I should see a Albums List Page`, () => {
  I.seeElement(listPageSel);
});

// Albums Show Page
Then(`I should see a Albums Show Page`, () => {
  I.seeElement(showPageSel);
});

// Albums Edit Page
Then(`I should see a Albums Edit Page`, () => {
  I.seeElement(editPageSel);
});

// Album References
Then(`I should see a Album Link in the Resource List`, () => {
  I.seeElement(refColumnSel);
});
Then(`I should see a Album Link on the Show Page`, () => {
  I.seeElement(refFieldSel);
});
Then(`I should see a Album Input on the Edit Page`, () => {
  I.seeElement(refInputSel);
});

// Albums Tabs
Then(`I should see a Albums tab on the Show Page`, () => {
  I.seeElement(showTabSel);
});
Then(`I should see a Albums tab on the Edit Page`, () => {
  I.seeElement(editTabSel);
});
