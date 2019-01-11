const { When, Then } = require('cucumber');

// Selectors.
const headerSel = '.headroom';
const profileButtonSel = `${headerSel} button[title=Profile]`;
const logoutButtonSel = '#menu-appbar .logout';

// Profile Menu Button
Then('I should see the Profile Menu Button', async function() {
  await this.t.expect(this.Selector(profileButtonSel).exists).ok();
});
Then('I should not see the Profile Menu Button', async function() {
  await this.t.expect(this.Selector(profileButtonSel).exists).notOk();
});
When('I click on the Profile Menu Button', async function() {
  await this.t.click(this.Selector(profileButtonSel));
});

// Logout Menu Item
Then('I should see the Logout Menu Item', async function() {
  await this.t.expect(this.Selector(logoutButtonSel).exists).ok();
});
Then('I should not see the Logout Menu Item', async function() {
  await this.t.expect(this.Selector(logoutButtonSel).exists).notOk();
});
When('I click on the Logout Menu Item', async function() {
  await this.t.click(this.Selector(logoutButtonSel));
});
