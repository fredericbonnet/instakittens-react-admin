const { getAccount, setInputValue, clearInput } = require('./utils');
const routes = require('./routes.json');

describe('Login form', () => {
  // Selectors.
  const loginFormSel = '[class^="Login-main-"]';
  const usernameInputSel = `${loginFormSel} input[name=username]`;
  const passwordInputSel = `${loginFormSel} input[name=password]`;
  const usernameHelperSel = `${loginFormSel} #username-helper-text`;
  const passwordHelperSel = `${loginFormSel} #password-helper-text`;
  const loginSubmitButtonSel = `${loginFormSel} button[type=submit]`;
  const warningSel = '[class*=" Connect-Notification--warning"]';

  // DOM elements.
  let loginForm;
  let usernameInput, passwordInput, loginSubmitButton;

  beforeEach(async () => {
    // Go to login page.
    await page.goto(global.APP_ADDRESS + routes.login);
    loginForm = await page.$(loginFormSel);
    expect(loginForm).toBeDefined();

    // Get DOM elements.
    usernameInput = await page.$(usernameInputSel);
    passwordInput = await page.$(passwordInputSel);
    loginSubmitButton = await page.$(loginSubmitButtonSel);
  });

  it('should render', async () => {
    expect(usernameInput).toBeTruthy();
    expect(passwordInput).toBeTruthy();
    expect(loginSubmitButton).toBeTruthy();
    expect(await page.$(usernameHelperSel)).toBeFalsy();
    expect(await page.$(passwordHelperSel)).toBeFalsy();
  });

  describe('Validation', () => {
    beforeEach(async () => {
      // Clear form.
      await clearInput(usernameInput);
      await clearInput(passwordInput);
    });

    it('should require username', async () => {
      await loginSubmitButton.click();
      expect(await page.$(usernameHelperSel)).toBeTruthy();
      await setInputValue(usernameInput, 'username');
      await loginSubmitButton.click();
      expect(await page.$(usernameHelperSel)).toBeFalsy();
    });

    it('should require password', async () => {
      await loginSubmitButton.click();
      expect(await page.$(passwordHelperSel)).toBeTruthy();
      await setInputValue(passwordInput, 'password');
      await loginSubmitButton.click();
      expect(await page.$(passwordHelperSel)).toBeFalsy();
    });
  });

  describe('Submit', () => {
    beforeEach(async () => {
      // Clear form.
      await clearInput(usernameInput);
      await clearInput(passwordInput);
      await page.waitForSelector(warningSel, { visibility: 'hidden' });
    });

    it('should reject unknown users', async () => {
      await setInputValue(usernameInput, 'Unknown user');
      await setInputValue(passwordInput, 'Unknown password');
      await loginSubmitButton.click();
      expect(await page.$(usernameHelperSel)).toBeFalsy();
      expect(await page.$(passwordHelperSel)).toBeFalsy();
      await page.waitForSelector(warningSel, { visibility: 'visible' });
      expect(await page.$(warningSel)).toBeTruthy();
    });

    it('should reject users with bad password', async () => {
      const account = getAccount('user');
      await setInputValue(usernameInput, account.username);
      await setInputValue(passwordInput, 'Bad password');
      await loginSubmitButton.click();
      expect(await page.$(usernameHelperSel)).toBeFalsy();
      expect(await page.$(passwordHelperSel)).toBeFalsy();
      await page.waitForSelector(warningSel, { visibility: 'visible' });
      expect(await page.$(warningSel)).toBeTruthy();
    });

    it('should redirect users with correct credentials to the login form', async () => {
      const account = getAccount('user');
      await setInputValue(usernameInput, account.username);
      await setInputValue(passwordInput, account.password);
      await loginSubmitButton.click();
      expect(await page.$(usernameHelperSel)).toBeFalsy();
      expect(await page.$(passwordHelperSel)).toBeFalsy();
      loginForm = await page.$(loginFormSel);
      expect(loginForm).toBeDefined();
    });

    it('should accept admin with correct credentials', async () => {
      const account = getAccount('admin');
      await setInputValue(usernameInput, account.username);
      await setInputValue(passwordInput, account.password);
      await loginSubmitButton.click();
      expect(await page.$(usernameHelperSel)).toBeFalsy();
      expect(await page.$(passwordHelperSel)).toBeFalsy();
      await page.waitForSelector(loginFormSel, { visibility: 'hidden' });
      expect(await page.$(warningSel)).toBeFalsy();
    });
  });
});
