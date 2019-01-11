const { Selector } = require('testcafe');

require('./globals');

const { getAccount, login } = require('./utils');
const routes = require('./routes.json');

// Selectors.
const loginFormSel = '[class^="Login-main-"]';
const headerSel = '.headroom';
const profileButtonSel = `${headerSel} button[title=Profile]`;
const logoutButtonSel = '#menu-appbar .logout';

fixture('Logout')
  .page(global.APP_ADDRESS + routes.home)
  .beforeEach(async t => {
    // Login as admin.
    const account = getAccount('admin');
    await login(t, account.username, account.password);
    await t.navigateTo(global.APP_ADDRESS + routes.home);
  });

test('App should have a Profile menu', async t => {
  await t.expect(Selector(profileButtonSel).exists).ok();
});

test('App should have a Logout menu item', async t => {
  await t.click(Selector(profileButtonSel));
  await t.expect(Selector(logoutButtonSel).exists).ok();
});

test('Logout menu item should log out the user back to the login form', async t => {
  await t.click(Selector(profileButtonSel));
  await t.click(Selector(logoutButtonSel));
  await t.expect(Selector(loginFormSel).exists).ok();
});
