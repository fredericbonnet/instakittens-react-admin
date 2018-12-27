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
 * Login using the app's login form.
 *
 * @param {Page} page Puppeteer page.
 * @param {string} username Username.
 * @param {string} password Password.
 */
async function login(page, username, password) {
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
  await page.waitForSelector(loginFormSel, { hidden: true });
}

module.exports = { getAccount, setInputValue, clearInput, login };
