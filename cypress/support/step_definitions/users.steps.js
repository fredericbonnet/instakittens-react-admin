/// <reference types="Cypress" />

const { When, Then } = require('cypress-cucumber-preprocessor/steps');

// Selectors.
const menuSel = '[class^="Menu-main-"]';
const menuItemSel = routes =>
  `${menuSel} [role=menuitem][href="${routes.users}"]`;
const listPageSel = '.list-page';
const showPageSel = '.show-page';
const editPageSel = '.edit-page';
const refColumnSel = '.column-user_id a > *';
const refFieldSel = '.ra-field-user_id a > *';
const refInputSel = 'input[name=user_id]';

// Users Menu Item
Then(`I should see a Users Menu Item`, function() {
  cy.fixture('routes.json').then(routes => {
    cy.get(menuItemSel(routes)).should('be.visible');
  });
});

// Users List Page
When(`I go to the Users List Page`, function() {
  cy.fixture('routes.json').then(routes => {
    cy.visit(routes.users);
  });
});
Then(`I should see a Users List Page`, function() {
  cy.get(listPageSel).should('be.visible');
});

// Users Show Page
Then(`I should see a Users Show Page`, function() {
  cy.get(showPageSel).should('be.visible');
});

// Users Edit Page
Then(`I should see a Users Edit Page`, function() {
  cy.get(editPageSel).should('be.visible');
});

// User References
Then(`I should see a User Link in the Resource List`, function() {
  cy.get(refColumnSel).should('be.visible');
});
Then(`I should see a User Link on the Show Page`, function() {
  cy.get(refFieldSel).should('be.visible');
});
Then(`I should see a User Input on the Edit Page`, function() {
  cy.get(refInputSel).should('be.visible');
});
