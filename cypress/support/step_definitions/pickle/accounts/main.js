import { type } from 'picklejs/cypress/cypressFunctions';
import { r, elInEl } from 'picklejs/common/regexBuilder';

When(r(`I type my username${elInEl}`), (...args) => {
  cy.get('@account').then(account => {
    type.apply(null, [account.username, ...args]);
  });
});
When(r(`I type my password${elInEl}`), (...args) => {
  cy.get('@account').then(account => {
    type.apply(null, [account.password, ...args]);
  });
});
