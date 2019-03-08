/// <reference path="../steps.d.ts" />

const I = actor();

// Selectors.
const headerSel = '.headroom';
const profileButtonSel = `${headerSel} button[title=Profile]`;
const logoutButtonSel = '#menu-appbar .logout';

// Profile Menu Button
Then('I should see the Profile Menu Button', () => {
  I.seeElement(profileButtonSel);
});
Then('I should not see the Profile Menu Button', () => {
  I.dontSeeElement(profileButtonSel);
});
When('I click on the Profile Menu Button', () => {
  I.click(profileButtonSel);
});

// Logout Menu Item
Then('I should see the Logout Menu Item', () => {
  I.seeElement(logoutButtonSel);
});
Then('I should not see the Logout Menu Item', () => {
  I.dontSeeElement(logoutButtonSel);
});
When('I click on the Logout Menu Item', () => {
  I.click(logoutButtonSel);
});
