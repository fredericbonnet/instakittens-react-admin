/// <reference types="Cypress" />

const { Then } = require('cypress-cucumber-preprocessor/steps');

// Selectors.
const pageTitleSel = '#react-admin-title';

Then('the Page Title should contain {string}', function(string) {
  cy.contains(pageTitleSel, string).should('be.visible');
});
