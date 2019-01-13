/*
 * Cypress plugin initialization.
 */
const cucumber = require('cypress-cucumber-preprocessor').default;

module.exports = (on, config) => {
  // Register Cucumber feature preprocessor.
  on('file:preprocessor', cucumber());
};
