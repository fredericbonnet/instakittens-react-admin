/// <reference path="./steps.d.ts" />

Feature('Server');

Scenario('should be listening', I => {
  I.amOnPage(global.SERVER_ADDRESS);
});
