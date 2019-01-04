/*
 * Utilities.
 */

/// <reference types="Cypress" />

/**
 * Get an account of the given role.
 *
 * @param role Account role (e.g. admin, user)
 */
Cypress.Commands.add('getAccount', role => {
  cy.fixture('test-accounts.json').then(accounts => {
    return accounts.find(account => account.role === role);
  });
});

/**
 * Login using the app's login form.
 *
 * @param {string} username Username.
 * @param {string} password Password.
 */
Cypress.Commands.add('login', (username, password) => {
  // Selectors.
  const loginFormSel = '[class^="Login-main-"]';
  const usernameInputSel = `${loginFormSel} input[name=username]`;
  const passwordInputSel = `${loginFormSel} input[name=password]`;
  const loginSubmitButtonSel = `${loginFormSel} button[type=submit]`;

  // Login as user.
  cy.fixture('routes.json').then(routes => {
    cy.visit(routes.login);
    cy.get(usernameInputSel).type(username);
    cy.get(passwordInputSel).type(password);
    cy.get(loginSubmitButtonSel).click();
  });
});
