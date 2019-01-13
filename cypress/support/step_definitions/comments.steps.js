/// <reference types="Cypress" />

const { When, Then } = require('cypress-cucumber-preprocessor/steps');

// Selectors.
const menuSel = '[class^="Menu-main-"]';
const menuItemSel = routes =>
  `${menuSel} [role=menuitem][href="${routes.comments}"]`;
const listPageSel = '.list-page';
const showPageSel = '.show-page';
const editPageSel = '.edit-page';
const showTabSel = '.show-tab[path=comments]';
const editTabSel = '.form-tab[path=comments]';

// Comments Menu Item
Then(`I should see a Comments Menu Item`, function() {
  cy.fixture('routes.json').then(routes => {
    cy.get(menuItemSel(routes)).should('be.visible');
  });
});

// Comments List Page
When(`I go to the Comments List Page`, function() {
  cy.fixture('routes.json').then(routes => {
    cy.visit(routes.comments);
  });
});
Then(`I should see a Comments List Page`, function() {
  cy.get(listPageSel).should('be.visible');
});

// Comments Show Page
Then(`I should see a Comments Show Page`, function() {
  cy.get(showPageSel).should('be.visible');
});

// Comments Edit Page
Then(`I should see a Comments Edit Page`, function() {
  cy.get(editPageSel).should('be.visible');
});

// Comments Tabs
Then(`I should see a Comments tab on the Show Page`, function() {
  cy.get(showTabSel).should('be.visible');
});
Then(`I should see a Comments tab on the Edit Page`, function() {
  cy.get(editTabSel).should('be.visible');
});
