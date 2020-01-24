/*
 * Utilities.
 */

const accounts = require('./test-accounts.json');
const routes = require('./routes.json');

/**
 * Get an account of the given role.
 *
 * @param role Account role (e.g. admin, user)
 */
function getAccount(role) {
  return accounts.find(account => account.role === role);
}

/**
 * Set an input value by triple-clicking then typing characters.
 *
 * @param {ElementHandle} input Input to set.
 * @param {string} value Value to set.
 */
async function setInputValue(input, value) {
  if (!value) return clearInput(input);
  await input.click({ clickCount: 3 });
  await input.type(value);
}

/**
 * Clear an input by triple-clicking then pressing delete.
 *
 * @param {ElementHandle} input Input to clear.
 */
async function clearInput(input) {
  await input.click({ clickCount: 3 });
  await input.press('Delete');
}

/**
 * Log into the app.
 *
 * When *useForm* is true, use the app's login form.
 *
 * When *useForm* is false. the behavior of this function depends on the actual
 * implementation of the authorization provider. A side effect is that the app
 * isn't redirected to the Home Page automatically after login like the form does.
 *
 * @param {Page} page Puppeteer page.
 * @param {string} username Username.
 * @param {string} password Password.
 * @param {useForm} full Whether to use the login form.
 */
async function login(page, username, password, useForm) {
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
    await page.goto(global.APP_ADDRESS + routes.login);
    const usernameInput = await page.$(usernameInputSel);
    const passwordInput = await page.$(passwordInputSel);
    const loginSubmitButton = await page.$(loginSubmitButtonSel);
    await setInputValue(usernameInput, username);
    await setInputValue(passwordInput, password);
    await loginSubmitButton.click();
    await page.waitForSelector(loginFormSel, { visibility: 'hidden' });
  } else {
    //
    // "Fast" mode: simulate a successful login.
    //

    const account = accounts.find(
      account => account.username === username && account.password === password
    );

    await page.evaluateOnNewDocument(account => {
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
    }, account);
  }
}

module.exports = { getAccount, setInputValue, clearInput, login };
