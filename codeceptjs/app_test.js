/// <reference path="./steps.d.ts" />

Feature('App');

Scenario('should be running', I => {
  I.amOnPage(global.SERVER_ADDRESS);
});
