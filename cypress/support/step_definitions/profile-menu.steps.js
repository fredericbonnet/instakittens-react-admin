/// <reference types="Cypress" />

const { When, Then } = require('cypress-cucumber-preprocessor/steps');

// Selectors.
const headerSel = '.headroom';
const profileButtonSel = `${headerSel} button[title=Profile]`;
const logoutButtonSel = '#menu-appbar .logout';

// Profile Menu Button
Then('I should see the Profile Menu Button', function() {
  cy.get(profileButtonSel).should('be.visible');
});
Then('I should not see the Profile Menu Button', function() {
  cy.get(profileButtonSel).should('not.be.visible');
});
When('I click on the Profile Menu Button', function() {
  cy.get(profileButtonSel).click();
});

// Logout Menu Item
Then('I should see the Logout Menu Item', function() {
  cy.get(logoutButtonSel).should('be.visible');
});
Then('I should not see the Logout Menu Item', function() {
  cy.get(logoutButtonSel).should('not.be.visible');
});
When('I click on the Logout Menu Item', function() {
  cy.get(logoutButtonSel).click();
});
