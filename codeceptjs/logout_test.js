/// <reference path="./steps.d.ts" />

const { getAccount } = require('./utils');
const routes = require('./routes.json');

Feature('Logout');

// Selectors.
const loginFormSel = '[class^="Login-main-"]';
const headerSel = '.headroom';
const profileButtonSel = `${headerSel} button[title=Profile]`;
const logoutButtonSel = '#menu-appbar .logout';

Before(I => {
  // Login as admin.
  const account = getAccount('admin');
  I.login(account.username, account.password);
  I.amOnPage(routes.home);
});

Scenario('App should have a Profile menu', I => {
  I.seeElement(profileButtonSel);
});

Scenario('App should have a Logout menu item', I => {
  I.click(profileButtonSel);
  I.seeElement(logoutButtonSel);
});

Scenario(
  'Logout menu item should log out the user back to the login form',
  I => {
    I.click(profileButtonSel);
    I.click(logoutButtonSel);
    I.seeElement(loginFormSel);
  }
);
