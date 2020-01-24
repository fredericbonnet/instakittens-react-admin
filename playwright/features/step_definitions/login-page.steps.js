const { When, Then } = require('cucumber');

const { setInputValue } = require('../../e2e/utils');
const routes = require('../../e2e/routes.json');

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
  await this.page.goto(global.APP_ADDRESS + routes.login);
});

// Login Form
Then('I should see the Login Form', async function() {
  await this.page.waitForSelector(loginFormSel, { visibility: 'visible' });
  expect(await this.page.$(loginFormSel)).to.exist;
});
Then('I should not see the Login Form', async function() {
  await this.page.waitForSelector(loginFormSel, { visibility: 'hidden' });
  expect(await this.page.$(loginFormSel)).to.not.exist;
});

// Username Input
Then('the Login Form should have a Username Input', async function() {
  await this.page.waitForSelector(usernameInputSel, { visibility: 'visible' });
  expect(await this.page.$(usernameInputSel)).to.exist;
});
When('I click on the Username Input of the Login Form', async function() {
  await this.page.waitForSelector(usernameInputSel, { visibility: 'visible' });
  const input = await this.page.$(usernameInputSel);
  await input.click();
});
When(
  'I type {string} into the Username Input of the Login Form',
  async function(username) {
    const input = await this.page.$(usernameInputSel);
    await setInputValue(input, username);
  }
);
When(
  'I type my username into the Username Input of the Login Form',
  async function() {
    const input = await this.page.$(usernameInputSel);
    await setInputValue(input, this.account.username);
  }
);
Then(
  'the Username Input of the Login Form should have a helper text',
  async function() {
    await this.page.waitForSelector(usernameHelperSel, {
      visibility: 'visible',
    });
    expect(await this.page.$(usernameHelperSel)).to.exist;
  }
);
Then(
  'the Username Input of the Login Form should not have a helper text',
  async function() {
    await this.page.waitForSelector(usernameHelperSel, {
      visibility: 'hidden',
    });
    expect(await this.page.$(usernameHelperSel)).to.not.exist;
  }
);

// Password Input
Then('the Login Form should have a Password Input', async function() {
  await this.page.waitForSelector(passwordInputSel, { visibility: 'visible' });
  expect(await this.page.$(passwordInputSel)).to.exist;
});
When('I click on the Password Input of the Login Form', async function() {
  await this.page.waitForSelector(passwordInputSel, { visibility: 'visible' });
  const input = await this.page.$(passwordInputSel);
  await input.click();
});
When(
  'I type {string} into the Password Input of the Login Form',
  async function(password) {
    const input = await this.page.$(passwordInputSel);
    await setInputValue(input, password);
  }
);
When(
  'I type my password into the Password Input of the Login Form',
  async function() {
    const input = await this.page.$(passwordInputSel);
    await setInputValue(input, this.account.password);
  }
);
Then(
  'the Password Input of the Login Form should have a helper text',
  async function() {
    await this.page.waitForSelector(passwordHelperSel, {
      visibility: 'visible',
    });
    expect(await this.page.$(passwordHelperSel)).to.exist;
  }
);
Then(
  'the Password Input of the Login Form should not have a helper text',
  async function() {
    await this.page.waitForSelector(passwordHelperSel, {
      visibility: 'hidden',
    });
    expect(await this.page.$(passwordHelperSel)).to.not.exist;
  }
);

// Sign In Button
Then('the Login Form should have a Sign In Button', async function() {
  await this.page.waitForSelector(loginSubmitButtonSel, {
    visibility: 'visible',
  });
  expect(await this.page.$(loginSubmitButtonSel)).to.exist;
});
When('I click on the Sign In Button of the Login Form', async function() {
  await this.page.waitForSelector(loginSubmitButtonSel, {
    visibility: 'visible',
  });
  const button = await this.page.$(loginSubmitButtonSel);
  await button.click();
});

// Warning Message
Then('I should see a Warning Message', async function() {
  await this.page.waitForSelector(warningSel, { visibility: 'visible' });
  expect(await this.page.$(warningSel)).to.exist;
});
Then('I should not see a Warning Message', async function() {
  await this.page.waitForSelector(warningSel, { visibility: 'hidden' });
  expect(await this.page.$(warningSel)).to.not.exist;
});
