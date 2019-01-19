/// <reference types="Cypress" />

const { Given, When, Then } = require('cypress-cucumber-preprocessor/steps');

const { getRandomElement } = require('./utils');

// Selectors
const commentReferenceListSel = '[data-testid=comment-reference-list]';
const rowSel = '.datagrid-body tr';
const idColumnSel = '.column-id';
const createButtonSel = routes => `[href="${routes.comments}/create"]`;
const saveButtonSel = 'button[class*="SaveButton-"]';
const deleteButtonSel = 'button.ra-delete-button';
const messageSel = `[class*="SnackbarContent-message"]`;
const progressBarSel = '[role=progressbar]';

/** Get URL of Comment List page. */
function getCommentListUrl(world) {
  const root = world.getRoot();
  let url;
  if (root) {
    // Parent's Comments tab.
    url = `${root}/comments`;
  } else {
    // Main Comment List page.
    url = world.routes.comments;
  }
  return url;
}

/** Get selector of Comment List rows */
function getCommentRowSel(world) {
  const root = world.getRoot();
  if (root) {
    // Parent's Comments tab.
    return commentReferenceListSel + ' ' + rowSel;
  } else {
    // Main Comment List page.
    return rowSel;
  }
}

/** Get list of Comments  */
function getCommentList(sel) {
  const comments = [];
  return cy
    .get(sel)
    .each(row => {
      const id = row.find(idColumnSel).text();
      comments.push({ id });
    })
    .then(() => {
      return comments;
    });
}

// Comment list
When('I get the Comment list', function() {
  cy.world().then(world => {
    cy.visit(getCommentListUrl(world));
  });
});

Then('I should get the complete Comment list', function() {
  cy.world().then(world => {
    // We are on the Comment list page...
    cy.location()
      .its('hash')
      .should('equal', getCommentListUrl(world));
    // ... and there is no active filter
    cy.location()
      .its('search')
      .should('be.empty');
  });
});

// Comments
Given('a new Comment {string}', function(v) {
  cy.world().then(world => {
    const data = { Message: 'Test comment' };
    world.setVariable(v, { data });
  });
});

When('I get the Comment {string}', function(v) {
  cy.world().then(world => {
    const id = world.getVariable(v);
    const url = `${world.routes.comments}/${id}/show`;
    cy.visit(url);
  });
});
When('I create the Comment {string}', function(v) {
  cy.world().then(world => {
    const { data } = world.getVariable(v);
    if (data['Id']) {
      // Don't create comments with an ID.
      // Remember creation status.
      return cy.wrap(false).as('commentCreationStatus');
    }

    // Go to the Comment List page and click the Create button.
    cy.visit(getCommentListUrl(world))
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
            cy.wrap(true).as('commentCreationStatus');
          });
      });
  });
});
When('I update the Comment {string} with {string}', function(v1, v2) {
  cy.world().then(world => {
    const id = world.getVariable(v1);
    const { data } = world.getVariable(v2);

    // Go to the Comment Edit page.
    const url = `${world.routes.comments}/${id}`;
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
          cy.wrap(id).as('commentUpdateStatus');
        });
    });
  });
});
When('I replace the Comment {string} with {string}', function(v1, v2) {
  cy.world().then(world => {
    const id = world.getVariable(v1);
    const { data } = world.getVariable(v2);

    // Go to the Comment Edit page.
    const url = `${world.routes.comments}/${id}`;
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
          cy.wrap(id).as('commentReplaceStatus');
        });
    });
  });
});
When('I delete the Comment {string}', function(v) {
  cy.world().then(world => {
    const id = world.getVariable(v);

    // Go to the Comment Edit page.
    const url = `${world.routes.comments}/${id}`;
    cy.visit(url).then(() => {
      // Check that we're really on the edit page before proceeding.
      if (!Cypress.$(deleteButtonSel).length) return;

      cy.get(deleteButtonSel).click();
    });
  });
});

Then('I should get the Comment {string}', function(v) {
  cy.world().then(world => {
    const data = world.readShowData();
    const links = world.readShowLinks();
    world.setVariable(v, { data, links });
  });
});
Then('the Comment should be created as {string}', function(v) {
  cy.world().then(world => {
    // Success message.
    cy.contains(messageSel, 'Element created').should('be.visible');

    // We are on a Comment Edit page.
    cy.location()
      .its('hash')
      .should('match', new RegExp(`${world.routes.comments}/\\d+`));

    // Go to the Comment Show page.
    cy.location().then(location => {
      const url = location + '/show';
      cy.visit(url).then(() => {
        // Extract all the Comment fields.
        const data = world.readShowData();
        const links = world.readShowLinks();
        world.setVariable(v, { data, links });
      });
    });
  });
});
Then('the Comment should be updated as {string}', function(v) {
  cy.world().then(world => {
    // Success message.
    cy.contains(messageSel, 'Element updated').should('be.visible');

    // Go to the Comment Show page.
    cy.get('@commentUpdateStatus').then(id => {
      const url = `${world.routes.comments}/${id}/show`;
      cy.visit(url).then(() => {
        // Extract all the Comment fields.
        const data = world.readShowData();
        const links = world.readShowLinks();
        world.setVariable(v, { data, links });
      });
    });
  });
});
Then('the Comment should be replaced as {string}', function(v) {
  cy.world().then(world => {
    // Success message.
    cy.contains(messageSel, 'Element updated').should('be.visible');

    // Go to the Comment Show page.
    cy.get('@commentReplaceStatus').then(id => {
      const url = `${world.routes.comments}/${id}/show`;
      cy.visit(url).then(() => {
        // Extract all the Comment fields.
        const data = world.readShowData();
        const links = world.readShowLinks();
        world.setVariable(v, { data, links });
      });
    });
  });
});
Then('the Comment should not be created', function() {
  cy.get('@commentCreationStatus').should('not.be.ok');
});

Then('the Comment {string} should equal the Comment {string}', function(
  v1,
  v2
) {
  cy.world().then(world => {
    const { data: comment1 } = world.getVariable(v1);
    const { data: comment2 } = world.getVariable(v2);
    expect(comment1)
      .excluding('Id')
      .to.deep.equal(comment2);
  });
});
Then('the Comment {string} should include the Comment {string}', function(
  v1,
  v2
) {
  cy.world().then(world => {
    const { data: comment1 } = world.getVariable(v1);
    const { data: comment2 } = world.getVariable(v2);
    expect(comment1).to.include(comment2);
  });
});

// Comment Ids
Given('an existing Comment Id {string}', function(v) {
  cy.world().then(world => {
    cy.visit(getCommentListUrl(world));
    getCommentList(getCommentRowSel(world)).then(comments => {
      world.setVariable(v, getRandomElement(comments).id);
    });
  });
});
Given('an unknown Comment Id {string}', function(v) {
  cy.world().then(world => {
    world.setVariable(v, 9999);
  });
});
Given('the Comment Id {string} of the Comment {string}', function(v1, v2) {
  cy.world().then(world => {
    const { data: comment } = world.getVariable(v2);
    world.setVariable(v1, comment['Id']);
  });
});
Given('the User Id {string} of the Comment {string}', function(v1, v2) {
  cy.world().then(world => {
    const { links } = world.getVariable(v2);
    if (links && links['User']) {
      const url = links['User'].url;
      const id = url.replace(world.routes.users, '').slice(1);
      world.setVariable(v1, id);
    }
  });
});
Given('the Photo Id {string} of the Comment {string}', function(v1, v2) {
  cy.world().then(world => {
    const { links } = world.getVariable(v2);
    if (links && links['Photo']) {
      const url = links['Photo'].url;
      const id = url.replace(world.routes.photos, '').slice(1);
      world.setVariable(v1, id);
    }
  });
});
