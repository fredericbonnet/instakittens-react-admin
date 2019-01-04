/// <reference types="Cypress" />

/*
 * Workaround for bug in cy.visit() when visiting the current URL. As our
 * routing is hash-based, we compare the current location hash to the URL to
 * visit, and if they are the same then we just yield the current window.
 */
Cypress.Commands.overwrite('visit', (orig, url, options) => {
  cy.location().then(location => {
    if (location.hash === url) {
      return orig(url + '?', options);
    } else {
      return orig(url, options);
    }
  });
});
