/// <reference types="Cypress" />

describe('Logout', () => {
  /** Routes */
  let routes;
  before(() => {
    cy.fixture('routes.json').then(r => {
      routes = r;
    });
  });

  // Selectors.
  const loginFormSel = '[class^="Login-main-"]';
  const headerSel = '.headroom';
  const profileButtonSel = `${headerSel} button[title=Profile]`;
  const logoutButtonSel = '#menu-appbar .logout';

  beforeEach(() => {
    // Login as admin.
    cy.getAccount('admin').then(account => {
      cy.login(account.username, account.password);
      cy.visit(routes.home);
    });
  });

  it('App should have a Profile menu', () => {
    cy.get(profileButtonSel).should('be.visible');
  });

  it('App should have a Logout menu item', () => {
    cy.get(profileButtonSel).click();
    cy.get(logoutButtonSel).should('be.visible');
  });

  it('Logout menu item should log out the user back to the login form', () => {
    cy.get(profileButtonSel).click();
    cy.get(logoutButtonSel).click();
    cy.get(loginFormSel).should('be.visible');
  });
});
