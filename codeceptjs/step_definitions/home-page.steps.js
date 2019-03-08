/// <reference path="../steps.d.ts" />

const I = actor();

const routes = require('../routes.json');

// Home Page
When('I go to the Home Page', () => {
  I.amOnPage(routes.home);
});
