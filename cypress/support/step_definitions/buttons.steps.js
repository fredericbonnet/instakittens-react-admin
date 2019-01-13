/// <reference types="Cypress" />

const { When, Then } = require('cypress-cucumber-preprocessor/steps');

// Selectors.
const showButtonSel = '[role="button"]:contains("Show")';
const createButtonSel = '[role="button"]:contains("Create")';
const editButtonSel = '[role="button"]:contains("Edit")';
const deleteButtonSel = 'button.ra-delete-button';
const saveButtonSel = 'button[class*="SaveButton-"]';

Then('I should see a Create Button', function() {
  cy.get(createButtonSel).should('be.visible');
});
When('I click the Create Button', function() {
  cy.get(createButtonSel).click();
});

Then('I should see a Show Button', function() {
  cy.get(showButtonSel).should('be.visible');
});
When('I click the Show Button', function() {
  cy.get(showButtonSel)
    .first()
    .click();
});

Then('I should see an Edit Button', function() {
  cy.get(editButtonSel).should('be.visible');
});
When('I click the Edit Button', function() {
  cy.get(editButtonSel)
    .first()
    .click();
});

Then('I should see a Delete Button', function() {
  cy.get(deleteButtonSel).should('be.visible');
});
When('I click the Delete Button', function() {
  cy.get(editButtonSel).click();
});

Then('I should see a Save Button', function() {
  cy.get(saveButtonSel).should('be.visible');
});
When('I click the Save Button', function() {
  cy.get(saveButtonSel).click();
});
