const { getAccount, login } = require('./utils');

describe('Logout', () => {
  // Selectors.
  const loginFormSel = '[class^="Login-main-"]';
  const headerSel = '.headroom';
  const profileButtonSel = `${headerSel} button[title=Profile]`;
  const logoutButtonSel = '#menu-appbar .logout';

  // DOM elements.
  let profileButton;

  beforeEach(async () => {
    // Login as admin.
    const account = getAccount('admin');
    await login(page, account.username, account.password);

    // Get DOM elements.
    profileButton = await page.$(profileButtonSel);
  });

  it('App should have a Profile menu', async () => {
    expect(profileButton).toBeTruthy();
  });

  it('App should have a Logout menu item', async () => {
    await profileButton.click();
    const logoutButton = await page.$(logoutButtonSel);
    expect(logoutButton).toBeTruthy();
  });

  it('Logout menu item should log out the user back to the login form', async () => {
    await profileButton.click();
    const logoutButton = await page.$(logoutButtonSel);
    await logoutButton.click();
    await page.waitForNavigation();
    await page.waitForSelector(loginFormSel, { visible: true });
  });
});
