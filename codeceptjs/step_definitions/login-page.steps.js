/// <reference path="../steps.d.ts" />

const I = actor();

const routes = require('../routes.json');

// Selectors.
const loginFormSel = '[class^="Login-main-"]';
const usernameInputSel = `${loginFormSel} input[name=username]`;
const passwordInputSel = `${loginFormSel} input[name=password]`;
const usernameHelperSel = `${loginFormSel} #username-helper-text`;
const passwordHelperSel = `${loginFormSel} #password-helper-text`;
const loginSubmitButtonSel = `${loginFormSel} button[type=submit]`;
const warningSel = '[class*=" Connect-Notification--warning"]';

// Login Page
When('I go to the Login Page', () => {
  I.amOnPage(routes.login);
  I.refreshPage();
});

// Login Form
Then('I should see the Login Form', () => {
  I.seeElement(loginFormSel);
});
Then('I should not see the Login Form', () => {
  I.dontSeeElement(loginFormSel);
});

// Username Input
Then('the Login Form should have a Username Input', () => {
  I.seeElement(usernameInputSel);
});
When('I click on the Username Input of the Login Form', () => {
  I.click(usernameInputSel);
});
When('I type {string} into the Username Input of the Login Form', function(
  username
) {
  I.fillField(usernameInputSel, username);
});
When(
  'I type my username into the Username Input of the Login Form',
  async () => {
    const world = await I.getWorld();
    I.fillField(usernameInputSel, world.account.username);
  }
);
Then('the Username Input of the Login Form should have a helper text', () => {
  I.seeElement(usernameHelperSel);
});
Then(
  'the Username Input of the Login Form should not have a helper text',
  () => {
    I.dontSeeElement(usernameHelperSel);
  }
);

// Password Input
Then('the Login Form should have a Password Input', () => {
  I.seeElement(passwordInputSel);
});
When('I click on the Password Input of the Login Form', () => {
  I.click(passwordInputSel);
});
When('I type {string} into the Password Input of the Login Form', function(
  password
) {
  I.fillField(passwordInputSel, password);
});
When(
  'I type my password into the Password Input of the Login Form',
  async () => {
    const world = await I.getWorld();
    I.fillField(passwordInputSel, world.account.password);
  }
);
Then('the Password Input of the Login Form should have a helper text', () => {
  I.seeElement(passwordHelperSel);
});
Then(
  'the Password Input of the Login Form should not have a helper text',
  () => {
    I.dontSeeElement(passwordHelperSel);
  }
);

// Sign In Button
Then('the Login Form should have a Sign In Button', () => {
  I.seeElement(loginSubmitButtonSel);
});
When('I click on the Sign In Button of the Login Form', () => {
  I.click(loginSubmitButtonSel);
});

// Warning Message
Then('I should see a Warning Message', () => {
  I.seeElement(warningSel);
});
Then('I should not see a Warning Message', () => {
  I.dontSeeElement(warningSel);
});
