/// <reference types="Cypress" />

const { Then } = require('cypress-cucumber-preprocessor/steps');

// Selectors.
const menuSel = '[class^="Menu-main-"]';
const resourceListSel = '[class*="Datagrid-"]';
const showTabSel = '.show-tab';
const editTabSel = '.form-tab';

// Resource Menu
Then('I should see the Resource Menu', function() {
  cy.get(menuSel).should('be.visible');
});

// Resource List
Then(`I should see a Resource List`, function() {
  cy.get(resourceListSel).should('be.visible');
});

// Resource Show Tabs
Then(`I should see {int} tabs on the Show Page`, function(nb) {
  cy.get(showTabSel).should('have.length', nb);
});

// Resource Edit Tabs
Then(`I should see {int} tabs on the Edit Page`, function(nb) {
  cy.get(editTabSel).should('have.length', nb);
});
