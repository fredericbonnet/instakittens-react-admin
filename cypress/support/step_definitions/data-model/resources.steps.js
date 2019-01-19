/// <reference types="Cypress" />

const { Then } = require('cypress-cucumber-preprocessor/steps');

// Selectors
const messageSel = `[class*="SnackbarContent-message"]`;
const warningSel = '[class*=" Connect-Notification--warning"]';

Then('the resource should not be found', function() {
  cy.get(warningSel).should('be.visible');
});
Then('the resource should be deleted', function() {
  cy.contains(messageSel, 'Element deleted').should('be.visible');
  cy.wait(5000); // FIXME configure or disable undo delay.
  cy.contains(messageSel, 'Element deleted').should('not.be.visible');
});

Then('the Id {string} should equal the Id {string}', function(v1, v2) {
  cy.world().then(world => {
    const id1 = world.getVariable(v1);
    const id2 = world.getVariable(v2);
    expect(id1).to.equal(id2);
  });
});
