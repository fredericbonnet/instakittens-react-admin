const { When, Then } = require('cucumber');

require('../../globals');

const { setInputValue } = require('../../utils');
const routes = require('../../routes.json');

// Selectors.
const loginFormSel = '[class^="Login-main-"]';
const usernameInputSel = `${loginFormSel} input[name=username]`;
const passwordInputSel = `${loginFormSel} input[name=password]`;
const usernameHelperSel = `${loginFormSel} #username-helper-text`;
const passwordHelperSel = `${loginFormSel} #password-helper-text`;
const loginSubmitButtonSel = `${loginFormSel} button[type=submit]`;
const warningSel = '[class*=" Connect-Notification--warning"]';

// Login Page
When('I go to the Login Page', async function() {
  await this.t.navigateTo(global.APP_ADDRESS + routes.login);
});

// Login Form
Then('I should see the Login Form', async function() {
  await this.t.expect(this.Selector(loginFormSel).exists).ok();
});
Then('I should not see the Login Form', async function() {
  await this.t.expect(this.Selector(loginFormSel).exists).notOk();
});

// Username Input
Then('the Login Form should have a Username Input', async function() {
  await this.t.expect(this.Selector(usernameInputSel).exists).ok();
});
When('I click on the Username Input of the Login Form', async function() {
  await this.t.click(this.Selector(usernameInputSel));
});
When(
  'I type {string} into the Username Input of the Login Form',
  async function(username) {
    await setInputValue(this.t, this.Selector(usernameInputSel), username);
  }
);
When(
  'I type my username into the Username Input of the Login Form',
  async function() {
    await setInputValue(
      this.t,
      this.Selector(usernameInputSel),
      this.account.username
    );
  }
);
Then(
  'the Username Input of the Login Form should have a helper text',
  async function() {
    await this.t.expect(this.Selector(usernameHelperSel).exists).ok();
  }
);
Then(
  'the Username Input of the Login Form should not have a helper text',
  async function() {
    await this.t.expect(this.Selector(usernameHelperSel).exists).notOk();
  }
);

// Password Input
Then('the Login Form should have a Password Input', async function() {
  await this.t.expect(this.Selector(passwordInputSel).exists).ok();
});
When('I click on the Password Input of the Login Form', async function() {
  await this.t.click(this.Selector(passwordInputSel));
});
When(
  'I type {string} into the Password Input of the Login Form',
  async function(password) {
    await setInputValue(this.t, this.Selector(passwordInputSel), password);
  }
);
When(
  'I type my password into the Password Input of the Login Form',
  async function() {
    await setInputValue(
      this.t,
      this.Selector(passwordInputSel),
      this.account.password
    );
  }
);
Then(
  'the Password Input of the Login Form should have a helper text',
  async function() {
    await this.t.expect(this.Selector(passwordHelperSel).exists).ok();
  }
);
Then(
  'the Password Input of the Login Form should not have a helper text',
  async function() {
    await this.t.expect(this.Selector(passwordHelperSel).exists).notOk();
  }
);

// Sign In Button
Then('the Login Form should have a Sign In Button', async function() {
  await this.t.expect(this.Selector(loginSubmitButtonSel).exists).ok();
});
When('I click on the Sign In Button of the Login Form', async function() {
  await this.t.click(this.Selector(loginSubmitButtonSel));
});

// Warning Message
Then('I should see a Warning Message', async function() {
  await this.t.expect(this.Selector(warningSel).exists).ok();
});
Then('I should not see a Warning Message', async function() {
  await this.t.expect(this.Selector(warningSel).exists).notOk();
});
