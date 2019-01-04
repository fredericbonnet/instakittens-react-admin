/// <reference types="Cypress" />

describe('App', () => {
  it('should be running', () => {
    cy.visit(Cypress.env('APP_ADDRESS'));
  });
});
