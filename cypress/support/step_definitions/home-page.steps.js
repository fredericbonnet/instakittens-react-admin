/// <reference types="Cypress" />

const { When } = require('cypress-cucumber-preprocessor/steps');

// Home Page
When('I go to the Home Page', function() {
  cy.fixture('routes.json').then(routes => {
    cy.visit(routes.home);
  });
});
