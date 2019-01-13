/// <reference types="Cypress" />

const { When, Then } = require('cypress-cucumber-preprocessor/steps');

// Selectors.
const loginFormSel = '[class^="Login-main-"]';
const usernameInputSel = `${loginFormSel} input[name=username]`;
const passwordInputSel = `${loginFormSel} input[name=password]`;
const usernameHelperSel = `${loginFormSel} #username-helper-text`;
const passwordHelperSel = `${loginFormSel} #password-helper-text`;
const loginSubmitButtonSel = `${loginFormSel} button[type=submit]`;
const warningSel = '[class*=" Connect-Notification--warning"]';

// Login Page
When('I go to the Login Page', function() {
  cy.fixture('routes.json').then(routes => {
    cy.visit(routes.login);
  });
});

// Login Form
Then('I should see the Login Form', function() {
  cy.get(loginFormSel).should('be.visible');
});
Then('I should not see the Login Form', function() {
  cy.get(loginFormSel).should('not.be.visible');
});

// Username Input
Then('the Login Form should have a Username Input', function() {
  cy.get(usernameInputSel).should('be.visible');
});
When('I click on the Username Input of the Login Form', function() {
  cy.get(usernameInputSel).click();
});
When('I type {string} into the Username Input of the Login Form', function(
  username
) {
  cy.get(usernameInputSel).type(username);
});
When(
  'I type my username into the Username Input of the Login Form',
  function() {
    cy.get('@account').then(account => {
      cy.get(usernameInputSel).type(account.username);
    });
  }
);
Then(
  'the Username Input of the Login Form should have a helper text',
  function() {
    cy.get(usernameHelperSel).should('be.visible');
  }
);
Then(
  'the Username Input of the Login Form should not have a helper text',
  function() {
    cy.get(usernameHelperSel).should('not.be.visible');
  }
);

// Password Input
Then('the Login Form should have a Password Input', function() {
  cy.get(passwordInputSel).should('be.visible');
});
When('I click on the Password Input of the Login Form', function() {
  cy.get(passwordInputSel).should('be.visible');
});
When('I type {string} into the Password Input of the Login Form', function(
  password
) {
  cy.get(passwordInputSel).type(password);
});
When(
  'I type my password into the Password Input of the Login Form',
  function() {
    cy.get('@account').then(account => {
      cy.get(passwordInputSel).type(account.password);
    });
  }
);
Then(
  'the Password Input of the Login Form should have a helper text',
  function() {
    cy.get(passwordHelperSel).should('be.visible');
  }
);
Then(
  'the Password Input of the Login Form should not have a helper text',
  function() {
    cy.get(passwordHelperSel).should('not.be.visible');
  }
);

// Sign In Button
Then('the Login Form should have a Sign In Button', function() {
  cy.get(loginSubmitButtonSel).should('be.visible');
});
When('I click on the Sign In Button of the Login Form', function() {
  cy.get(loginSubmitButtonSel).click();
});

// Warning Message
Then('I should see a Warning Message', function() {
  cy.get(warningSel).should('be.visible');
});
Then('I should not see a Warning Message', function() {
  cy.get(warningSel).should('not.be.visible');
});
