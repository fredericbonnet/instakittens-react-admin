/// <reference types="Cypress" />

const { Given } = require('cypress-cucumber-preprocessor/steps');

const { getAccount } = require('../utils');

Given('I am an unknown user', function() {
  cy.wrap({ username: 'unknown', password: 'unknown' }).as('account');
});
Given('I am a registered user', function() {
  cy.getAccount('user').as('account');
});
Given('I am an administrator', function() {
  cy.getAccount('admin').as('account');
});

Given('I sign into the application', function() {
  cy.get('@account').then(account => {
    cy.login(account.username, account.password);
  });
});
