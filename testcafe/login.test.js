const { Selector } = require('testcafe');

const { getAccount, setInputValue, clearInput } = require('./utils');
const routes = require('./routes.json');

fixture('Login form').page(global.APP_ADDRESS + routes.login);

// Selectors.
const loginFormSel = '[class^="Login-main-"]';
const usernameInputSel = `${loginFormSel} input[name=username]`;
const passwordInputSel = `${loginFormSel} input[name=password]`;
const usernameHelperSel = `${loginFormSel} #username-helper-text`;
const passwordHelperSel = `${loginFormSel} #password-helper-text`;
const loginSubmitButtonSel = `${loginFormSel} button[type=submit]`;
const warningSel = '[class*=" Connect-Notification--warning"]';

test('should render', async t => {
  await t.expect(Selector(loginFormSel).exists).ok();

  await t.expect(Selector(usernameInputSel).exists).ok();
  await t.expect(Selector(passwordInputSel).exists).ok();
  await t.expect(Selector(loginSubmitButtonSel).exists).ok();
  await t.expect(Selector(usernameHelperSel).exists).notOk();
  await t.expect(Selector(passwordHelperSel).exists).notOk();
});

fixture('Login form > Validation')
  .page(global.APP_ADDRESS + routes.login)
  .beforeEach(async t => {
    // Clear form.
    await clearInput(t, Selector(usernameInputSel));
    await clearInput(t, Selector(passwordInputSel));
  });

test('should require username', async t => {
  await t.click(Selector(loginSubmitButtonSel));
  await t.expect(Selector(usernameHelperSel).exists).ok();
  await setInputValue(t, Selector(usernameInputSel), 'username');
  await t.click(Selector(loginSubmitButtonSel));
  await t.expect(Selector(usernameHelperSel).exists).notOk();
});

test('should require password', async t => {
  await t.click(Selector(loginSubmitButtonSel));
  await t.expect(Selector(passwordHelperSel).exists).ok();
  await setInputValue(t, Selector(passwordInputSel), 'password');
  await t.click(Selector(loginSubmitButtonSel));
  await t.expect(Selector(passwordHelperSel).exists).notOk();
});

fixture('Login form > Submit')
  .page(global.APP_ADDRESS + routes.login)
  .beforeEach(async t => {
    // Clear form.
    await clearInput(t, Selector(usernameInputSel));
    await clearInput(t, Selector(passwordInputSel));
  });

test('should reject unknown users', async t => {
  await setInputValue(t, Selector(usernameInputSel), 'Unknown user');
  await setInputValue(t, Selector(passwordInputSel), 'Unknown password');
  await t.click(Selector(loginSubmitButtonSel));
  await t.expect(Selector(usernameHelperSel).exists).notOk();
  await t.expect(Selector(passwordHelperSel).exists).notOk();
  await t.expect(Selector(warningSel).exists).ok();
});

test('should reject users with bad password', async t => {
  const account = getAccount('user');
  await setInputValue(t, Selector(usernameInputSel), account.username);
  await setInputValue(t, Selector(passwordInputSel), 'Bad password');
  await t.click(Selector(loginSubmitButtonSel));
  await t.expect(Selector(usernameHelperSel).exists).notOk();
  await t.expect(Selector(passwordHelperSel).exists).notOk();
  await t.expect(Selector(warningSel).exists).ok();
});

test('should redirect users with correct credentials to the login form', async t => {
  const account = getAccount('user');
  await setInputValue(t, Selector(usernameInputSel), account.username);
  await setInputValue(t, Selector(passwordInputSel), account.password);
  await t.click(Selector(loginSubmitButtonSel));
  await t.expect(Selector(usernameHelperSel).exists).notOk();
  await t.expect(Selector(passwordHelperSel).exists).notOk();
  await t.expect(Selector(loginFormSel).exists).ok();
});

test('should accept admin with correct credentials', async t => {
  const account = getAccount('admin');
  await setInputValue(t, Selector(usernameInputSel), account.username);
  await setInputValue(t, Selector(passwordInputSel), account.password);
  await t.click(Selector(loginSubmitButtonSel));
  await t.expect(Selector(usernameHelperSel).exists).notOk();
  await t.expect(Selector(passwordHelperSel).exists).notOk();
  await t.expect(Selector(loginFormSel).exists).notOk();
  await t.expect(Selector(warningSel).exists).notOk();
});
