/// <reference types="Cypress" />

const { When, Then } = require('cypress-cucumber-preprocessor/steps');

// Selectors.
const menuSel = '[class^="Menu-main-"]';
const menuItemSel = routes =>
  `${menuSel} [role=menuitem][href="${routes.photos}"]`;
const listPageSel = '.list-page';
const showPageSel = '.show-page';
const editPageSel = '.edit-page';
const showTabSel = '.show-tab[path=photos]';
const editTabSel = '.form-tab[path=photos]';
const refColumnSel = '.column-photo_id a > *';
const refFieldSel = '.ra-field-photo_id a > *';
const refInputSel = 'input[name=photo_id]';

// Photos Menu Item
Then(`I should see a Photos Menu Item`, function() {
  cy.fixture('routes.json').then(routes => {
    cy.get(menuItemSel(routes)).should('be.visible');
  });
});

// Photos List Page
When(`I go to the Photos List Page`, function() {
  cy.fixture('routes.json').then(routes => {
    cy.visit(routes.photos);
  });
});
Then(`I should see a Photos List Page`, function() {
  cy.get(listPageSel).should('be.visible');
});

// Photos Show Page
Then(`I should see a Photos Show Page`, function() {
  cy.get(showPageSel).should('be.visible');
});

// Photos Edit Page
Then(`I should see a Photos Edit Page`, function() {
  cy.get(editPageSel).should('be.visible');
});

// Photo References
Then(`I should see a Photo Link in the Resource List`, function() {
  cy.get(refColumnSel).should('be.visible');
});
Then(`I should see a Photo Link on the Show Page`, function() {
  cy.get(refFieldSel).should('be.visible');
});
Then(`I should see a Photo Input on the Edit Page`, function() {
  cy.get(refInputSel).should('be.visible');
});

// Photos Tabs
Then(`I should see a Photos tab on the Show Page`, function() {
  cy.get(showTabSel).should('be.visible');
});
Then(`I should see a Photos tab on the Edit Page`, function() {
  cy.get(editTabSel).should('be.visible');
});
