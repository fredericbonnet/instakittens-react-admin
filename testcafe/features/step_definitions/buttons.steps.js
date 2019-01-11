const { When, Then } = require('cucumber');

// Selectors.
const showButtonSel = '[role="button"][aria-label="Show"]';
const createButtonSel = '[role="button"][aria-label="Create"]';
const editButtonSel = '[role="button"][aria-label="Edit"]';
const deleteButtonSel = 'button.ra-delete-button';
const saveButtonSel = 'button[class*="SaveButton-"]';

Then('I should see a Create Button', async function() {
  await this.t.expect(this.Selector(createButtonSel).exists).ok();
});
When('I click the Create Button', async function() {
  await this.t.click(this.Selector(createButtonSel));
});

Then('I should see a Show Button', async function() {
  await this.t.expect(this.Selector(showButtonSel).exists).ok();
});
When('I click the Show Button', async function() {
  await this.t.click(this.Selector(showButtonSel));
});

Then('I should see an Edit Button', async function() {
  await this.t.expect(this.Selector(editButtonSel).exists).ok();
});
When('I click the Edit Button', async function() {
  await this.t.click(this.Selector(editButtonSel));
});

Then('I should see a Delete Button', async function() {
  await this.t.expect(this.Selector(deleteButtonSel).exists).ok();
});
When('I click the Delete Button', async function() {
  await this.t.click(this.Selector(editButtonSel));
});

Then('I should see a Save Button', async function() {
  await this.t.expect(this.Selector(saveButtonSel).exists).ok();
});
When('I click the Save Button', async function() {
  await this.t.click(this.Selector(saveButtonSel));
});
