/// <reference types="Cypress" />

const { Given } = require('cypress-cucumber-preprocessor/steps');

const { getRandomElement } = require('./utils');

// Selectors
const rowSel = '.datagrid-body tr';
const userLinkSel = '.column-user_id a';
const typeColumnSel = '.column-type';

Given('a User Id {string} with albums', function(v) {
  cy.world().then(world => {
    // Get list of users having all three types of albums.
    cy.visit(world.routes.albums + '?perPage=1000');
    const typesPerUser = {};
    cy.get(rowSel)
      .each(row => {
        const url = row.find(userLinkSel).attr('href');
        const userId = url.replace(world.routes.users, '').slice(1);
        const type = row.find(typeColumnSel).text();
        typesPerUser[userId] = [...(typesPerUser[userId] || []), type];
      })
      .then(() => {
        const users = Object.entries(typesPerUser)
          .filter(([userId, types]) => {
            return (
              types.includes('PUBLIC') &&
              types.includes('RESTRICTED') &&
              types.includes('PRIVATE')
            );
          })
          .map(([userId, types]) => userId);

        // Select a random user.
        const user = getRandomElement(users);
        world.setVariable(v, user);
      });
  });
});

Given('I open the User {string}', function(v) {
  cy.world().then(world => {
    const { data } = world.getVariable(v);
    const url = `${world.routes.users}/${data['Id']}`;
    world.setParent('User', { id: data['Username'], data, url });
  });
});
Given('I open the Album {string}', function(v) {
  cy.world().then(world => {
    const { data } = world.getVariable(v);
    const url = `${world.routes.albums}/${data['Id']}`;
    world.setParent('Album', { id: data['Title'], data, url });
  });
});
Given('I open the Photo {string}', function(v) {
  cy.world().then(world => {
    const { data } = world.getVariable(v);
    const url = `${world.routes.photos}/${data['Id']}`;
    world.setParent('Photo', { id: data['Title'], data, url });
  });
});
