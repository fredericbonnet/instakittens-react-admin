/// <reference path="../steps.d.ts" />

const I = actor();

const routes = require('../routes.json');

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
Then(`I should see a Photos Menu Item`, () => {
  I.seeElement(menuItemSel);
});

// Photos List Page
When(`I go to the Photos List Page`, () => {
  I.amOnPage(routes.photos);
});
Then(`I should see a Photos List Page`, () => {
  I.seeElement(listPageSel);
});

// Photos Show Page
Then(`I should see a Photos Show Page`, () => {
  I.seeElement(showPageSel);
});

// Photos Edit Page
Then(`I should see a Photos Edit Page`, () => {
  I.seeElement(editPageSel);
});

// Photo References
Then(`I should see a Photo Link in the Resource List`, () => {
  I.seeElement(refColumnSel);
});
Then(`I should see a Photo Link on the Show Page`, () => {
  I.seeElement(refFieldSel);
});
Then(`I should see a Photo Input on the Edit Page`, () => {
  I.seeElement(refInputSel);
});

// Photos Tabs
Then(`I should see a Photos tab on the Show Page`, () => {
  I.seeElement(showTabSel);
});
Then(`I should see a Photos tab on the Edit Page`, () => {
  I.seeElement(editTabSel);
});
