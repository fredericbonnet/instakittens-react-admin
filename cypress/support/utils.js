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
 * Log into the app.
 *
 * When *useForm* is true, use the app's login form.
 *
 * When *useForm* is false. the behavior of this function depends on the actual
 * implementation of the authorization provider. A side effect is that the app
 * isn't redirected to the Home Page automatically after login like the form does.
 *
 * @param {string} username Username.
 * @param {string} password Password.
 * @param {useForm} full Whether to use the login form.
 */
Cypress.Commands.add('login', (username, password, useForm) => {
  cy.log('Login', username, password);

  if (useForm) {
    //
    // "Slow" mode : use the login form.
    //

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
  } else {
    //
    // "Fast" mode: simulate a successful login.
    //

    cy.fixture('test-accounts.json').then(accounts => {
      const account = accounts.find(
        account =>
          account.username === username && account.password === password
      );

      /** Local storage key for Authorization HTTP header */
      const AUTHORIZATION_HEADER_KEY = 'instakittens-auth-basic-header';

      /** Local storage key for user role */
      const USER_ROLE_KEY = 'instakittens-user-role';

      // Build & store authorization header.
      const authorization =
        'Basic ' + btoa(account.username + ':' + account.password);
      localStorage.setItem(AUTHORIZATION_HEADER_KEY, authorization);

      // Store user role.
      localStorage.setItem(USER_ROLE_KEY, account.role);
    });
  }
});
