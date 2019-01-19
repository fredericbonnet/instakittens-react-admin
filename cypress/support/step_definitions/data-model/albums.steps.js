/// <reference types="Cypress" />

const { Given, When, Then } = require('cypress-cucumber-preprocessor/steps');

const { getRandomElement } = require('./utils');

// Selectors
const albumReferenceListSel = '[data-testid=album-reference-list]';
const rowSel = '.datagrid-body tr';
const idColumnSel = '.column-id';
const typeColumnSel = '.column-type';
const createButtonSel = routes => `[href="${routes.albums}/create"]`;
const saveButtonSel = 'button[class*="SaveButton-"]';
const deleteButtonSel = 'button.ra-delete-button';
const messageSel = `[class*="SnackbarContent-message"]`;
const progressBarSel = '[role=progressbar]';

/** Get URL of Album List page. */
function getAlbumListUrl(world) {
  const root = world.getRoot();
  let url;
  if (root) {
    // Parent's Albums tab.
    url = `${root}/albums`;
  } else {
    // Main Album List page.
    url = world.routes.albums;
  }
  return url;
}

/** Get selector of Album List rows */
function getAlbumRowSel(world) {
  const root = world.getRoot();
  if (root) {
    // Parent's Albums tab.
    return albumReferenceListSel + ' ' + rowSel;
  } else {
    // Main Album List page.
    return rowSel;
  }
}

/** Get list of Albums with type */
function getAlbumList(sel) {
  const albums = [];
  return cy
    .get(sel)
    .each(row => {
      const id = row.find(idColumnSel).text();
      const type = row.find(typeColumnSel).text();
      albums.push({ id, type });
    })
    .then(() => {
      return albums;
    });
}

// Album list
When('I get the Album list', function() {
  cy.world().then(world => {
    cy.visit(getAlbumListUrl(world));
  });
});

Then('I should get the complete Album list', function() {
  cy.world().then(world => {
    // We are on the Album list page...
    cy.location()
      .its('hash')
      .should('equal', getAlbumListUrl(world));
    // ... and there is no active filter
    cy.location()
      .its('search')
      .should('be.empty');
  });
});

// Albums
Given('a new Album {string}', function(v) {
  cy.world().then(world => {
    const data = { Title: 'Test album' };
    world.setVariable(v, { data });
  });
});

When('I get the Album {string}', function(v) {
  cy.world().then(world => {
    const id = world.getVariable(v);
    const url = `${world.routes.albums}/${id}/show`;
    cy.visit(url);
  });
});
When('I create the Album {string}', function(v) {
  cy.world().then(world => {
    const { data } = world.getVariable(v);
    if (data['Id']) {
      // Don't create albums with an ID.
      // Remember creation status.
      return cy.wrap(false).as('albumCreationStatus');
    }

    // Go to the Album List page and click the Create button.
    cy.visit(getAlbumListUrl(world))
      .then(() => {
        return cy.get(createButtonSel(world.routes)).click();
      })
      .then(() => {
        // Ensure that page is fully loaded.
        cy.get(progressBarSel).should('not.be.visible');

        // Fill and save the form.
        world.writeEditData({ ...data, ...world.getParentData() });
        cy.get(saveButtonSel)
          .click()
          .then(() => {
            // Remember creation status.
            cy.wrap(true).as('albumCreationStatus');
          });
      });
  });
});
When('I update the Album {string} with {string}', function(v1, v2) {
  cy.world().then(world => {
    const id = world.getVariable(v1);
    const { data } = world.getVariable(v2);

    // Go to the Album Edit page.
    const url = `${world.routes.albums}/${id}`;
    cy.visit(url).then(() => {
      // Check that we're really on the edit page before proceeding.
      if (!Cypress.$(saveButtonSel).length) return;

      // Ensure that page is fully loaded.
      cy.get(progressBarSel).should('not.be.visible');

      // Fill and save the form.
      world.writeEditData({ ...data, ...world.getParentData() });
      cy.get(saveButtonSel)
        .click()
        .then(() => {
          // Remember update/replace status.
          cy.wrap(id).as('albumUpdateStatus');
        });
    });
  });
});
When('I replace the Album {string} with {string}', function(v1, v2) {
  cy.world().then(world => {
    const id = world.getVariable(v1);
    const { data } = world.getVariable(v2);

    // Go to the Album Edit page.
    const url = `${world.routes.albums}/${id}`;
    cy.visit(url).then(() => {
      // Check that we're really on the edit page before proceeding.
      if (!Cypress.$(saveButtonSel).length) return;

      // Ensure that page is fully loaded.
      cy.get(progressBarSel).should('not.be.visible');

      // Fill and save the form.
      world.writeEditData({ ...data, ...world.getParentData() }, true);
      cy.get(saveButtonSel)
        .click()
        .then(() => {
          // Remember update/replace status.
          cy.wrap(id).as('albumReplaceStatus');
        });
    });
  });
});
When('I delete the Album {string}', function(v) {
  cy.world().then(world => {
    const id = world.getVariable(v);

    // Go to the Album Edit page.
    const url = `${world.routes.albums}/${id}`;
    cy.visit(url).then(() => {
      // Check that we're really on the edit page before proceeding.
      if (!Cypress.$(deleteButtonSel).length) return;

      cy.get(deleteButtonSel).click();
    });
  });
});

Then('I should get the Album {string}', function(v) {
  cy.world().then(world => {
    const data = world.readShowData();
    const links = world.readShowLinks();
    world.setVariable(v, { data, links });
  });
});
Then('the Album should be created as {string}', function(v) {
  cy.world().then(world => {
    // Success message.
    cy.contains(messageSel, 'Element created').should('be.visible');

    // We are on a Album Edit page.
    cy.location()
      .its('hash')
      .should('match', new RegExp(`${world.routes.albums}/\\d+`));

    // Go to the Album Show page.
    cy.location().then(location => {
      const url = location + '/show';
      cy.visit(url).then(() => {
        // Extract all the Album fields.
        const data = world.readShowData();
        const links = world.readShowLinks();
        world.setVariable(v, { data, links });
      });
    });
  });
});
Then('the Album should be updated as {string}', function(v) {
  cy.world().then(world => {
    // Success message.
    cy.contains(messageSel, 'Element updated').should('be.visible');

    // Go to the Album Show page.
    cy.get('@albumUpdateStatus').then(id => {
      const url = `${world.routes.albums}/${id}/show`;
      cy.visit(url).then(() => {
        // Extract all the Album fields.
        const data = world.readShowData();
        const links = world.readShowLinks();
        world.setVariable(v, { data, links });
      });
    });
  });
});
Then('the Album should be replaced as {string}', function(v) {
  cy.world().then(world => {
    // Success message.
    cy.contains(messageSel, 'Element updated').should('be.visible');

    // Go to the Album Show page.
    cy.get('@albumReplaceStatus').then(id => {
      const url = `${world.routes.albums}/${id}/show`;
      cy.visit(url).then(() => {
        // Extract all the Album fields.
        const data = world.readShowData();
        const links = world.readShowLinks();
        world.setVariable(v, { data, links });
      });
    });
  });
});
Then('the Album should not be created', function() {
  cy.get('@albumCreationStatus').should('not.be.ok');
});

Then('the Album {string} should equal the Album {string}', function(v1, v2) {
  cy.world().then(world => {
    const { data: album1 } = world.getVariable(v1);
    const { data: album2 } = world.getVariable(v2);
    expect(album1)
      .excluding('Id')
      .to.deep.equal(album2);
  });
});
Then('the Album {string} should include the Album {string}', function(v1, v2) {
  cy.world().then(world => {
    const { data: album1 } = world.getVariable(v1);
    const { data: album2 } = world.getVariable(v2);
    expect(album1).to.include(album2);
  });
});

// Album Ids
Given('an existing Album Id {string}', function(v) {
  cy.world().then(world => {
    cy.visit(getAlbumListUrl(world));
    getAlbumList(getAlbumRowSel(world)).then(albums => {
      world.setVariable(v, getRandomElement(albums).id);
    });
  });
});
Given('an existing public Album Id {string}', function(v) {
  cy.world().then(world => {
    cy.visit(getAlbumListUrl(world));
    getAlbumList(getAlbumRowSel(world)).then(albums => {
      world.setVariable(
        v,
        getRandomElement(albums.filter(album => album.type === 'PUBLIC')).id
      );
    });
  });
});
Given('an existing restricted Album Id {string}', function(v) {
  cy.world().then(world => {
    cy.visit(getAlbumListUrl(world));
    getAlbumList(getAlbumRowSel(world)).then(albums => {
      world.setVariable(
        v,
        getRandomElement(albums.filter(album => album.type === 'RESTRICTED')).id
      );
    });
  });
});
Given('an existing private Album Id {string}', function(v) {
  cy.world().then(world => {
    cy.visit(getAlbumListUrl(world));
    getAlbumList(getAlbumRowSel(world)).then(albums => {
      world.setVariable(
        v,
        getRandomElement(albums.filter(album => album.type === 'PRIVATE')).id
      );
    });
  });
});
Given('an unknown Album Id {string}', function(v) {
  cy.world().then(world => {
    world.setVariable(v, 9999);
  });
});
Given('the Album Id {string} of the Album {string}', function(v1, v2) {
  cy.world().then(world => {
    const { data: album } = world.getVariable(v2);
    world.setVariable(v1, album['Id']);
  });
});
Given('the User Id {string} of the Album {string}', function(v1, v2) {
  cy.world().then(world => {
    const { links } = world.getVariable(v2);
    if (links && links['User']) {
      const url = links['User'].url;
      const id = url.replace(world.routes.users, '').slice(1);
      world.setVariable(v1, id);
    }
  });
});
