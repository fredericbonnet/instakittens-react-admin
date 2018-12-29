const { When, Then } = require('cucumber');

// Selectors.
const headerSel = '.headroom';
const profileButtonSel = `${headerSel} button[title=Profile]`;
const logoutButtonSel = '#menu-appbar .logout';

// Profile Menu Button
Then('I should see the Profile Menu Button', async function() {
  await this.page.waitForSelector(profileButtonSel, { visible: true });
  expect(await this.page.$(profileButtonSel)).to.exist;
});
Then('I should not see the Profile Menu Button', async function() {
  await this.page.waitForSelector(profileButtonSel, { hidden: true });
  expect(await this.page.$(profileButtonSel)).to.not.exist;
});
When('I click on the Profile Menu Button', async function() {
  const button = await this.page.$(profileButtonSel);
  await button.click();
});

// Logout Menu Item
Then('I should see the Logout Menu Item', async function() {
  await this.page.waitForSelector(logoutButtonSel, { visible: true });
  expect(await this.page.$(logoutButtonSel)).to.exist;
});
Then('I should not see the Logout Menu Item', async function() {
  await this.page.waitForSelector(logoutButtonSel, { hidden: true });
  expect(await this.page.$(logoutButtonSel)).to.not.exist;
});
When('I click on the Logout Menu Item', async function() {
  const button = await this.page.$(logoutButtonSel);
  await button.click();
});
