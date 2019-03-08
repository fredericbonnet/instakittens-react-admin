/// <reference path="../steps.d.ts" />

const I = actor();

// Selectors.
const pageTitleSel = '#react-admin-title';

Then('the Page Title should contain {string}', string => {
  I.see(string, pageTitleSel);
});
