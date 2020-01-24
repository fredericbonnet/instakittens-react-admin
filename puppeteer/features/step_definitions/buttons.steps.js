const { When, Then } = require('cucumber');

// Selectors.
const showButtonSel = '[role="button"][title="Show"]';
const createButtonSel = '[role="button"][class*="CreateButton-"]';
const editButtonSel = '[role="button"][title="Edit"]';
const deleteButtonSel = 'button.ra-delete-button';
const saveButtonSel = 'button[class*="SaveButton-"]';

Then('I should see a Create Button', async function() {
  await this.page.waitForSelector(createButtonSel, { visible: true });
  expect(await this.page.$(createButtonSel)).to.exist;
});
When('I click the Create Button', async function() {
  await this.page.waitForSelector(createButtonSel, { visible: true });
  const button = await this.page.$(createButtonSel);
  await button.click();
});

Then('I should see a Show Button', async function() {
  await this.page.waitForSelector(showButtonSel, { visible: true });
  expect(await this.page.$(showButtonSel)).to.exist;
});
When('I click the Show Button', async function() {
  await this.page.waitForSelector(showButtonSel, { visible: true });
  const button = await this.page.$(showButtonSel);
  await button.click();
});

Then('I should see an Edit Button', async function() {
  await this.page.waitForSelector(editButtonSel, { visible: true });
  expect(await this.page.$(editButtonSel)).to.exist;
});
When('I click the Edit Button', async function() {
  await this.page.waitForSelector(editButtonSel, { visible: true });
  const button = await this.page.$(editButtonSel);
  await button.click();
});

Then('I should see a Delete Button', async function() {
  await this.page.waitForSelector(deleteButtonSel, { visible: true });
  expect(await this.page.$(deleteButtonSel)).to.exist;
});
When('I click the Delete Button', async function() {
  await this.page.waitForSelector(editButtonSel, { visible: true });
  const button = await this.page.$(editButtonSel);
  await button.click();
});

Then('I should see a Save Button', async function() {
  await this.page.waitForSelector(saveButtonSel, { visible: true });
  expect(await this.page.$(saveButtonSel)).to.exist;
});
When('I click the Save Button', async function() {
  await this.page.waitForSelector(saveButtonSel, { visible: true });
  const button = await this.page.$(saveButtonSel);
  await button.click();
});
