/// <reference types="Cypress" />

describe('Navigation', () => {
  /** Routes */
  let routes;
  before(() => {
    cy.fixture('routes.json').then(r => {
      routes = r;
    });
  });

  /** Resources */
  const resources = {
    users: {
      label: 'Users',
      nested: ['albums', 'comments'],
      refColumnSel: '.column-user_id a > *',
      refFieldSel: '.ra-field-user_id a > *',
    },
    albums: {
      label: 'Albums',
      refs: ['users'],
      nested: ['photos'],
      refColumnSel: '.column-album_id a > *',
      refFieldSel: '.ra-field-album_id a > *',
      tabSel: '.show-tab[path=albums]',
    },
    photos: {
      label: 'Photos',
      refs: ['albums'],
      nested: ['comments'],
      refColumnSel: '.column-photo_id a > *',
      refFieldSel: '.ra-field-photo_id a > *',
      tabSel: '.show-tab[path=photos]',
    },
    comments: {
      label: 'Comments',
      refs: ['users', 'photos'],
      tabSel: '.show-tab[path=comments]',
    },
  };

  // Selectors.
  const menuSel = '[class^="Menu-main-"]';
  before(() => {
    for (let resourceId in resources) {
      const resource = resources[resourceId];
      resource.menuItemSel = `${menuSel} [role=menuitem][href="${
        routes[resourceId]
      }"]`;
    }
  });
  const showButtonSel = '[role="button"]:contains("Show")';
  const createButtonSel = '[role="button"]:contains("Create")';
  const editButtonSel = '[role="button"]:contains("Edit")';
  const deleteButtonSel = 'button.ra-delete-button';

  beforeEach(() => {
    // Login as admin.
    cy.getAccount('admin').then(account => {
      cy.login(account.username, account.password);
    });
  });

  describe('Home page', () => {
    beforeEach(() => {
      cy.visit(routes.home);
    });

    it('should display a resource menu', () => {
      cy.get(menuSel).should('be.visible');
    });

    // Resource menu items.
    for (let resourceId in resources) {
      const resource = resources[resourceId];
      it(`should have a ${resource.label} menu item`, () => {
        cy.get(resource.menuItemSel).should('be.visible');
      });
    }
  });

  for (let resourceId in resources) {
    const resource = resources[resourceId];
    describe(`${resource.label}`, () => {
      describe(`List page`, () => {
        beforeEach(() => {
          cy.visit(routes[resourceId]);
        });

        it('should have show buttons', () => {
          cy.get(showButtonSel).should('be.visible');
        });
        it('should have edit buttons', () => {
          cy.get(editButtonSel).should('be.visible');
        });
        it('should have a create button', () => {
          cy.get(createButtonSel).should('be.visible');
        });

        // Referenced resources
        if (resource.refs) {
          for (let refId of resource.refs) {
            let refResource = resources[refId];
            it(`should show ${refResource.label}`, () => {
              cy.get(refResource.refColumnSel).should('be.visible');
            });
          }
        }
      });

      describe(`Show page`, () => {
        beforeEach(() => {
          // Open first resource in list page.
          cy.visit(routes[resourceId]);
          cy.get(showButtonSel)
            .first()
            .click();
        });

        it('should have an edit button', () => {
          cy.get(editButtonSel).should('be.visible');
        });

        // Referenced resources.
        if (resource.refs) {
          for (let refId of resource.refs) {
            let refResource = resources[refId];
            it(`should show ${refResource.label}`, () => {
              cy.get(refResource.refFieldSel).should('be.visible');
            });
          }
        }

        // Nested resources.
        if (resource.nested) {
          for (let nestedId of resource.nested) {
            let nestedResource = resources[nestedId];
            it(`should show ${nestedResource.label}`, () => {
              cy.get(nestedResource.tabSel).should('be.visible');
            });
          }
        }
      });

      describe(`Edit page`, () => {
        beforeEach(() => {
          // Open first resource in list page.
          cy.visit(routes[resourceId]);
          cy.get(editButtonSel)
            .first()
            .click({});
        });

        it('should have a show button', () => {
          cy.get(showButtonSel).should('be.visible');
        });
        it('should have a delete button', () => {
          cy.get(deleteButtonSel).should('be.visible');
        });
      });
    });
  }
});
