/// <reference types="Cypress" />

const { Given, When, Then } = require('cypress-cucumber-preprocessor/steps');

const { getRandomElement } = require('./utils');

// Selectors
const rowSel = '.datagrid-body tr';
const idColumnSel = '.column-id';
const createButtonSel = routes => `[href="${routes.users}/create"]`;
const saveButtonSel = 'button[class*="SaveButton-"]';
const deleteButtonSel = 'button.ra-delete-button';
const messageSel = `[class*="SnackbarContent-message"]`;
const progressBarSel = '[role=progressbar]';

/** Get URL of User List page. */
function getUserListUrl(world) {
  return world.routes.users;
}

/** Get selector of User List rows */
function getUserRowSel(world) {
  // Main User List page.
  return rowSel;
}

/** Get list of Users  */
function getUserList(sel) {
  const users = [];
  return cy
    .get(sel)
    .each(row => {
      const id = row.find(idColumnSel).text();
      users.push({ id });
    })
    .then(() => {
      return users;
    });
}

// User list
When('I get the User list', function() {
  cy.world().then(world => {
    cy.visit(getUserListUrl(world));
  });
});

Then('I should get the complete User list', function() {
  cy.world().then(world => {
    // We are on the User list page...
    cy.location()
      .its('hash')
      .should('equal', getUserListUrl(world));
    // ... and there is no active filter
    cy.location()
      .its('search')
      .should('be.empty');
  });
});

// Users
Given('a new User {string}', function(v) {
  cy.world().then(world => {
    const data = { Username: 'Test user' };
    world.setVariable(v, { data });
  });
});

When('I get the User {string}', function(v) {
  cy.world().then(world => {
    const id = world.getVariable(v);
    const url = `${world.routes.users}/${id}/show`;
    cy.visit(url);
  });
});
When('I create the User {string}', function(v) {
  cy.world().then(world => {
    const { data } = world.getVariable(v);
    if (data['Id']) {
      // Don't create users with an ID.
      // Remember creation status.
      return cy.wrap(false).as('userCreationStatus');
    }

    // Go to the User List page and click the Create button.
    cy.visit(getUserListUrl(world))
      .then(() => {
        return cy.get(createButtonSel(world.routes)).click();
      })
      .then(() => {
        // Ensure that page is fully loaded.
        cy.get(progressBarSel).should('not.be.visible');

        // Fill and save the form.
        world.writeEditData(data);
        cy.get(saveButtonSel)
          .click()
          .then(() => {
            // Remember creation status.
            cy.wrap(true).as('userCreationStatus');
          });
      });
  });
});
When('I update the User {string} with {string}', function(v1, v2) {
  cy.world().then(world => {
    const id = world.getVariable(v1);
    const { data } = world.getVariable(v2);

    // Go to the User Edit page.
    const url = `${world.routes.users}/${id}`;
    cy.visit(url).then(() => {
      // Check that we're really on the edit page before proceeding.
      if (!Cypress.$(saveButtonSel).length) return;

      // Ensure that page is fully loaded.
      cy.get(progressBarSel).should('not.be.visible');

      // Fill and save the form.
      world.writeEditData(data);
      cy.get(saveButtonSel)
        .click()
        .then(() => {
          // Remember update/replace status.
          cy.wrap(id).as('userUpdateStatus');
        });
    });
  });
});
When('I replace the User {string} with {string}', function(v1, v2) {
  cy.world().then(world => {
    const id = world.getVariable(v1);
    const { data } = world.getVariable(v2);

    // Go to the User Edit page.
    const url = `${world.routes.users}/${id}`;
    cy.visit(url).then(() => {
      // Check that we're really on the edit page before proceeding.
      if (!Cypress.$(saveButtonSel).length) return;

      // Ensure that page is fully loaded.
      cy.get(progressBarSel).should('not.be.visible');

      // Fill and save the form.
      world.writeEditData(data, true);
      cy.get(saveButtonSel)
        .click()
        .then(() => {
          // Remember update/replace status.
          cy.wrap(id).as('userReplaceStatus');
        });
    });
  });
});
When('I delete the User {string}', function(v) {
  cy.world().then(world => {
    const id = world.getVariable(v);

    // Go to the User Edit page.
    const url = `${world.routes.users}/${id}`;
    cy.visit(url).then(() => {
      // Check that we're really on the edit page before proceeding.
      if (!Cypress.$(deleteButtonSel).length) return;

      cy.get(deleteButtonSel).click();
    });
  });
});

Then('I should get the User {string}', function(v) {
  cy.world().then(world => {
    const data = world.readShowData();
    const links = world.readShowLinks();
    world.setVariable(v, { data, links });
  });
});
Then('the User should be created as {string}', function(v) {
  cy.world().then(world => {
    // Success message.
    cy.contains(messageSel, 'Element created').should('be.visible');

    // We are on a User Edit page.
    cy.location()
      .its('hash')
      .should('match', new RegExp(`${world.routes.users}/\\d+`));

    // Go to the User Show page.
    cy.location().then(location => {
      const url = location + '/show';
      cy.visit(url).then(() => {
        // Extract all the User fields.
        const data = world.readShowData();
        const links = world.readShowLinks();
        world.setVariable(v, { data, links });
      });
    });
  });
});
Then('the User should be updated as {string}', function(v) {
  cy.world().then(world => {
    // Success message.
    cy.contains(messageSel, 'Element updated').should('be.visible');

    // Go to the User Show page.
    cy.get('@userUpdateStatus').then(id => {
      const url = `${world.routes.users}/${id}/show`;
      cy.visit(url).then(() => {
        // Extract all the User fields.
        const data = world.readShowData();
        const links = world.readShowLinks();
        world.setVariable(v, { data, links });
      });
    });
  });
});
Then('the User should be replaced as {string}', function(v) {
  cy.world().then(world => {
    // Success message.
    cy.contains(messageSel, 'Element updated').should('be.visible');

    // Go to the User Show page.
    cy.get('@userReplaceStatus').then(id => {
      const url = `${world.routes.users}/${id}/show`;
      cy.visit(url).then(() => {
        // Extract all the User fields.
        const data = world.readShowData();
        const links = world.readShowLinks();
        world.setVariable(v, { data, links });
      });
    });
  });
});
Then('the User should not be created', function() {
  cy.get('@userCreationStatus').should('not.be.ok');
});

Then('the User {string} should equal the User {string}', function(v1, v2) {
  cy.world().then(world => {
    const { data: user1 } = world.getVariable(v1);
    const { data: user2 } = world.getVariable(v2);
    expect(user1)
      .excluding('Id')
      .to.deep.equal(user2);
  });
});
Then('the User {string} should include the User {string}', function(v1, v2) {
  cy.world().then(world => {
    const { data: user1 } = world.getVariable(v1);
    const { data: user2 } = world.getVariable(v2);
    expect(user1).to.include(user2);
  });
});

// User Ids
Given('an existing User Id {string}', function(v) {
  cy.world().then(world => {
    cy.visit(getUserListUrl(world));
    getUserList(getUserRowSel(world)).then(users => {
      world.setVariable(v, getRandomElement(users).id);
    });
  });
});
Given('an unknown User Id {string}', function(v) {
  cy.world().then(world => {
    world.setVariable(v, 9999);
  });
});
Given('the User Id {string} of the User {string}', function(v1, v2) {
  cy.world().then(world => {
    const { data: user } = world.getVariable(v2);
    world.setVariable(v1, user['Id']);
  });
});
