/// <reference types="Cypress" />

const { Given } = require('cypress-cucumber-preprocessor/steps');

Given('I am identified', function() {
  cy.get('@account').then(account => {
    cy.login(account.username, account.password);
  });
});
