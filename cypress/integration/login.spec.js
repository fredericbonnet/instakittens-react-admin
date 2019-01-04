/// <reference types="Cypress" />

describe('Login form', () => {
  /** Routes */
  let routes;
  before(() => {
    cy.fixture('routes.json').then(r => {
      routes = r;
    });
  });

  // Selectors.
  const loginFormSel = '[class^="Login-main-"]';
  const usernameInputSel = `${loginFormSel} input[name=username]`;
  const passwordInputSel = `${loginFormSel} input[name=password]`;
  const usernameHelperSel = `${loginFormSel} #username-helper-text`;
  const passwordHelperSel = `${loginFormSel} #password-helper-text`;
  const loginSubmitButtonSel = `${loginFormSel} button[type=submit]`;
  const warningSel = '[class*=" Connect-Notification--warning"]';

  beforeEach(() => {
    // Go to login page.
    cy.visit(routes.login);
    cy.get(loginFormSel).should('be.visible');
  });

  it('should render', () => {
    cy.get(usernameInputSel).should('be.visible');
    cy.get(passwordInputSel).should('be.visible');
    cy.get(loginSubmitButtonSel).should('be.visible');
    cy.get(usernameHelperSel).should('not.be.visible');
    cy.get(passwordHelperSel).should('not.be.visible');
  });

  describe('Validation', () => {
    it('should require username', () => {
      cy.get(loginSubmitButtonSel).click();
      cy.get(usernameHelperSel).should('be.visible');
      cy.get(usernameInputSel).type('username');
      cy.get(loginSubmitButtonSel).click();
      cy.get(usernameHelperSel).should('not.be.visible');
    });

    it('should require password', () => {
      cy.get(loginSubmitButtonSel).click();
      cy.get(passwordHelperSel).should('be.visible');
      cy.get(passwordInputSel).type('password');
      cy.get(loginSubmitButtonSel).click();
      cy.get(passwordHelperSel).should('not.be.visible');
    });
  });

  describe('Submit', () => {
    it('should reject unknown users', () => {
      cy.get(usernameInputSel).type('Unknown user');
      cy.get(passwordInputSel).type('Unknown password');
      cy.get(loginSubmitButtonSel).click();
      cy.get(usernameHelperSel).should('not.be.visible');
      cy.get(passwordHelperSel).should('not.be.visible');
      cy.get(warningSel).should('be.visible');
    });

    it('should reject users with bad password', () => {
      cy.getAccount('user').then(account => {
        cy.get(usernameInputSel).type(account.username);
        cy.get(passwordInputSel).type('Bad password');
        cy.get(loginSubmitButtonSel).click();
        cy.get(usernameHelperSel).should('not.be.visible');
        cy.get(passwordHelperSel).should('not.be.visible');
        cy.get(warningSel).should('be.visible');
      });
    });

    it('should redirect users with correct credentials to the login form', () => {
      cy.getAccount('user').then(account => {
        cy.get(usernameInputSel).type(account.username);
        cy.get(passwordInputSel).type(account.password);
        cy.get(loginSubmitButtonSel).click();
        cy.get(usernameHelperSel).should('not.be.visible');
        cy.get(passwordHelperSel).should('not.be.visible');
        cy.get(loginFormSel).should('be.visible');
      });
    });

    it('should accept admin with correct credentials', () => {
      cy.getAccount('admin').then(account => {
        cy.get(usernameInputSel).type(account.username);
        cy.get(passwordInputSel).type(account.password);
        cy.get(loginSubmitButtonSel).click();
        cy.get(usernameHelperSel).should('not.be.visible');
        cy.get(passwordHelperSel).should('not.be.visible');
        cy.get(loginFormSel).should('not.be.visible');
        cy.get(warningSel).should('not.be.visible');
      });
    });
  });
});
