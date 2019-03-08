/// <reference path="./steps.d.ts" />

const { getAccount } = require('./utils');
const routes = require('./routes.json');

Feature('Login form');

// Selectors.
const loginFormSel = '[class^="Login-main-"]';
const usernameInputSel = `${loginFormSel} input[name=username]`;
const passwordInputSel = `${loginFormSel} input[name=password]`;
const usernameHelperSel = `${loginFormSel} #username-helper-text`;
const passwordHelperSel = `${loginFormSel} #password-helper-text`;
const loginSubmitButtonSel = `${loginFormSel} button[type=submit]`;
const warningSel = '[class*=" Connect-Notification--warning"]';

Scenario('should render', I => {
  I.amOnPage(routes.login);
  I.seeElement(loginFormSel);
});

Feature('Login form > Validation');

Before(I => {
  I.amOnPage(routes.login);
  I.refreshPage();
  I.seeElement(loginFormSel);
});

Scenario('should require username', I => {
  I.click(usernameInputSel);
  I.click(loginSubmitButtonSel);
  I.seeElement(usernameHelperSel);
  I.fillField(usernameInputSel, 'username');
  I.click(loginSubmitButtonSel);
  I.dontSeeElement(usernameHelperSel);
});

Scenario('should require password', I => {
  I.click(passwordInputSel);
  I.click(loginSubmitButtonSel);
  I.seeElement(passwordHelperSel);
  I.fillField(passwordInputSel, 'username');
  I.click(loginSubmitButtonSel);
  I.dontSeeElement(passwordHelperSel);
});

Feature('Login form > Submit');

Before(I => {
  I.amOnPage(routes.login);
  I.refreshPage();
  I.seeElement(loginFormSel);
});

Scenario('should reject unknown users', I => {
  I.fillField(usernameInputSel, 'Unknown user');
  I.fillField(passwordInputSel, 'Unknown password');
  I.click(loginSubmitButtonSel);
  I.dontSeeElement(usernameHelperSel);
  I.dontSeeElement(passwordHelperSel);
  I.seeElement(warningSel);
});

Scenario('should reject users with bad password', I => {
  const account = getAccount('user');
  I.fillField(usernameInputSel, account.username);
  I.fillField(passwordInputSel, 'Unknown password');
  I.click(loginSubmitButtonSel);
  I.dontSeeElement(usernameHelperSel);
  I.dontSeeElement(passwordHelperSel);
  I.seeElement(warningSel);
});

Scenario(
  'should redirect users with correct credentials to the login form',
  I => {
    const account = getAccount('user');
    I.fillField(usernameInputSel, account.username);
    I.fillField(passwordInputSel, account.password);
    I.click(loginSubmitButtonSel);
    I.dontSeeElement(usernameHelperSel);
    I.dontSeeElement(passwordHelperSel);
    I.seeElement(loginFormSel);
  }
);

Scenario('should accept admin with correct credentials', I => {
  const account = getAccount('admin');
  I.fillField(usernameInputSel, account.username);
  I.fillField(passwordInputSel, account.password);
  I.click(loginSubmitButtonSel);
  I.dontSeeElement(usernameHelperSel);
  I.dontSeeElement(passwordHelperSel);
  I.dontSeeElement(loginFormSel);
  I.dontSeeElement(warningSel);
});
