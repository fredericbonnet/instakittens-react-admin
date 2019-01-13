/// <reference types="Cypress" />

const { When, Then } = require('cypress-cucumber-preprocessor/steps');

// Selectors.
const menuSel = '[class^="Menu-main-"]';
const menuItemSel = routes =>
  `${menuSel} [role=menuitem][href="${routes.albums}"]`;
const listPageSel = '.list-page';
const showPageSel = '.show-page';
const editPageSel = '.edit-page';
const showTabSel = '.show-tab[path=albums]';
const editTabSel = '.form-tab[path=albums]';
const refColumnSel = '.column-album_id a > *';
const refFieldSel = '.ra-field-album_id a > *';
const refInputSel = 'input[name=album_id]';

// Albums Menu Item
Then(`I should see a Albums Menu Item`, function() {
  cy.fixture('routes.json').then(routes => {
    cy.get(menuItemSel(routes)).should('be.visible');
  });
});

// Albums List Page
When(`I go to the Albums List Page`, function() {
  cy.fixture('routes.json').then(routes => {
    cy.visit(routes.albums);
  });
});
Then(`I should see a Albums List Page`, function() {
  cy.get(listPageSel).should('be.visible');
});

// Albums Show Page
Then(`I should see a Albums Show Page`, function() {
  cy.get(showPageSel).should('be.visible');
});

// Albums Edit Page
Then(`I should see a Albums Edit Page`, function() {
  cy.get(editPageSel).should('be.visible');
});

// Album References
Then(`I should see a Album Link in the Resource List`, function() {
  cy.get(refColumnSel).should('be.visible');
});
Then(`I should see a Album Link on the Show Page`, function() {
  cy.get(refFieldSel).should('be.visible');
});
Then(`I should see a Album Input on the Edit Page`, function() {
  cy.get(refInputSel).should('be.visible');
});

// Albums Tabs
Then(`I should see a Albums tab on the Show Page`, function() {
  cy.get(showTabSel).should('be.visible');
});
Then(`I should see a Albums tab on the Edit Page`, function() {
  cy.get(editTabSel).should('be.visible');
});
