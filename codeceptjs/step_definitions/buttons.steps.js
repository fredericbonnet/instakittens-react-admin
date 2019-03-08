/// <reference path="../steps.d.ts" />

const I = actor();

// Selectors.
const showButtonSel = '[role="button"][aria-label="Show"]';
const createButtonSel = '[role="button"][aria-label="Create"]';
const editButtonSel = '[role="button"][aria-label="Edit"]';
const deleteButtonSel = 'button.ra-delete-button';
const saveButtonSel = 'button[class*="SaveButton-"]';

Then('I should see a Create Button', () => {
  I.seeElement(createButtonSel);
});
When('I click the Create Button', () => {
  I.click(createButtonSel);
});

Then('I should see a Show Button', () => {
  I.seeElement(showButtonSel);
});
When('I click the Show Button', () => {
  I.click(showButtonSel);
});

Then('I should see an Edit Button', () => {
  I.seeElement(editButtonSel);
});
When('I click the Edit Button', () => {
  I.click(editButtonSel);
});

Then('I should see a Delete Button', () => {
  I.seeElement(deleteButtonSel);
});
When('I click the Delete Button', () => {
  I.click(editButtonSel);
});

Then('I should see a Save Button', () => {
  I.seeElement(saveButtonSel);
});
When('I click the Save Button', () => {
  I.click(saveButtonSel);
});
