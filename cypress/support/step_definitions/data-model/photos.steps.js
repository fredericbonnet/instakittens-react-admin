/// <reference types="Cypress" />

const { Given, When, Then } = require('cypress-cucumber-preprocessor/steps');

const { getRandomElement } = require('./utils');

// Selectors
const photoReferenceListSel = '[data-testid=photo-reference-list]';
const rowSel = '.datagrid-body tr';
const idColumnSel = '.column-id';
const createButtonSel = routes => `[href="${routes.photos}/create"]`;
const saveButtonSel = 'button[class*="SaveButton-"]';
const deleteButtonSel = 'button.ra-delete-button';
const messageSel = `[class*="SnackbarContent-message"]`;
const progressBarSel = '[role=progressbar]';

/** Get URL of Photo List page. */
function getPhotoListUrl(world) {
  const root = world.getRoot();
  let url;
  if (root) {
    // Parent's Photos tab.
    url = `${root}/photos`;
  } else {
    // Main Photo List page.
    url = world.routes.photos;
  }
  return url;
}

/** Get selector of Photo List rows */
function getPhotoRowSel(world) {
  const root = world.getRoot();
  if (root) {
    // Parent's Photos tab.
    return photoReferenceListSel + ' ' + rowSel;
  } else {
    // Main Photo List page.
    return rowSel;
  }
}

/** Get list of Photos  */
function getPhotoList(sel) {
  const photos = [];
  return cy
    .get(sel)
    .each(row => {
      const id = row.find(idColumnSel).text();
      photos.push({ id });
    })
    .then(() => {
      return photos;
    });
}

// Photo list
When('I get the Photo list', function() {
  cy.world().then(world => {
    cy.visit(getPhotoListUrl(world));
  });
});

Then('I should get the complete Photo list', function() {
  cy.world().then(world => {
    // We are on the Photo list page...
    cy.location()
      .its('hash')
      .should('equal', getPhotoListUrl(world));
    // ... and there is no active filter
    cy.location()
      .its('search')
      .should('be.empty');
  });
});

// Photos
Given('a new Photo {string}', function(v) {
  cy.world().then(world => {
    const data = { Title: 'Test photo' };
    world.setVariable(v, { data });
  });
});

When('I get the Photo {string}', function(v) {
  cy.world().then(world => {
    const id = world.getVariable(v);
    const url = `${world.routes.photos}/${id}/show`;
    cy.visit(url);
  });
});
When('I create the Photo {string}', function(v) {
  cy.world().then(world => {
    const { data } = world.getVariable(v);
    if (data['Id']) {
      // Don't create photos with an ID.
      // Remember creation status.
      return cy.wrap(false).as('photoCreationStatus');
    }

    // Go to the Photo List page and click the Create button.
    cy.visit(getPhotoListUrl(world))
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
            cy.wrap(true).as('photoCreationStatus');
          });
      });
  });
});
When('I update the Photo {string} with {string}', function(v1, v2) {
  cy.world().then(world => {
    const id = world.getVariable(v1);
    const { data } = world.getVariable(v2);

    // Go to the Photo Edit page.
    const url = `${world.routes.photos}/${id}`;
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
          cy.wrap(id).as('photoUpdateStatus');
        });
    });
  });
});
When('I replace the Photo {string} with {string}', function(v1, v2) {
  cy.world().then(world => {
    const id = world.getVariable(v1);
    const { data } = world.getVariable(v2);

    // Go to the Photo Edit page.
    const url = `${world.routes.photos}/${id}`;
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
          cy.wrap(id).as('photoReplaceStatus');
        });
    });
  });
});
When('I delete the Photo {string}', function(v) {
  cy.world().then(world => {
    const id = world.getVariable(v);

    // Go to the Photo Edit page.
    const url = `${world.routes.photos}/${id}`;
    cy.visit(url).then(() => {
      // Check that we're really on the edit page before proceeding.
      if (!Cypress.$(deleteButtonSel).length) return;

      cy.get(deleteButtonSel).click();
    });
  });
});

Then('I should get the Photo {string}', function(v) {
  cy.world().then(world => {
    const data = world.readShowData();
    const links = world.readShowLinks();
    world.setVariable(v, { data, links });
  });
});
Then('the Photo should be created as {string}', function(v) {
  cy.world().then(world => {
    // Success message.
    cy.contains(messageSel, 'Element created').should('be.visible');

    // We are on a Photo Edit page.
    cy.location()
      .its('hash')
      .should('match', new RegExp(`${world.routes.photos}/\\d+`));

    // Go to the Photo Show page.
    cy.location().then(location => {
      const url = location + '/show';
      cy.visit(url).then(() => {
        // Extract all the Photo fields.
        const data = world.readShowData();
        const links = world.readShowLinks();
        world.setVariable(v, { data, links });
      });
    });
  });
});
Then('the Photo should be updated as {string}', function(v) {
  cy.world().then(world => {
    // Success message.
    cy.contains(messageSel, 'Element updated').should('be.visible');

    // Go to the Photo Show page.
    cy.get('@photoUpdateStatus').then(id => {
      const url = `${world.routes.photos}/${id}/show`;
      cy.visit(url).then(() => {
        // Extract all the Photo fields.
        const data = world.readShowData();
        const links = world.readShowLinks();
        world.setVariable(v, { data, links });
      });
    });
  });
});
Then('the Photo should be replaced as {string}', function(v) {
  cy.world().then(world => {
    // Success message.
    cy.contains(messageSel, 'Element updated').should('be.visible');

    // Go to the Photo Show page.
    cy.get('@photoReplaceStatus').then(id => {
      const url = `${world.routes.photos}/${id}/show`;
      cy.visit(url).then(() => {
        // Extract all the Photo fields.
        const data = world.readShowData();
        const links = world.readShowLinks();
        world.setVariable(v, { data, links });
      });
    });
  });
});
Then('the Photo should not be created', function() {
  cy.get('@photoCreationStatus').should('not.be.ok');
});

Then('the Photo {string} should equal the Photo {string}', function(v1, v2) {
  cy.world().then(world => {
    const { data: photo1 } = world.getVariable(v1);
    const { data: photo2 } = world.getVariable(v2);
    expect(photo1)
      .excluding('Id')
      .to.deep.equal(photo2);
  });
});
Then('the Photo {string} should include the Photo {string}', function(v1, v2) {
  cy.world().then(world => {
    const { data: photo1 } = world.getVariable(v1);
    const { data: photo2 } = world.getVariable(v2);
    expect(photo1).to.include(photo2);
  });
});

// Photo Ids
Given('an existing Photo Id {string}', function(v) {
  cy.world().then(world => {
    cy.visit(getPhotoListUrl(world));
    getPhotoList(getPhotoRowSel(world)).then(photos => {
      world.setVariable(v, getRandomElement(photos).id);
    });
  });
});
Given('an unknown Photo Id {string}', function(v) {
  cy.world().then(world => {
    world.setVariable(v, 9999);
  });
});
Given('the Photo Id {string} of the Photo {string}', function(v1, v2) {
  cy.world().then(world => {
    const { data: photo } = world.getVariable(v2);
    world.setVariable(v1, photo['Id']);
  });
});
Given('the Album Id {string} of the Photo {string}', function(v1, v2) {
  cy.world().then(world => {
    const { links } = world.getVariable(v2);
    if (links && links['Album']) {
      const url = links['Album'].url;
      const id = url.replace(world.routes.albums, '').slice(1);
      world.setVariable(v1, id);
    }
  });
});
