/// <reference types="Cypress" />

describe('Server', () => {
  it('should be listening', async () => {
    cy.request(Cypress.env('SERVER_ADDRESS'));
  });
});
