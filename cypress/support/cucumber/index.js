/*
 * Cucumber initialization.
 */
const { World } = require('./world');

/**
 * Register world object in Cucumber steps.
 */
Cypress.Commands.add('world', function() {
  if (this.world) {
    // Already registered.
    return this.world;
  }

  // Create new world object.
  this.world = new World();

  // Store routes once and for all.
  cy.fixture('routes.json').then(routes => {
    this.world.routes = routes;
    return this.world;
  });
});
