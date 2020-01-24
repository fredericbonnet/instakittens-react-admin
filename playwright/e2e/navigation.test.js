const { getAccount, login } = require('./utils');
const routes = require('./routes.json');

describe('Navigation', () => {
  /** Resources */
  const resources = {
    users: {
      label: 'Users',
      nested: ['albums', 'comments'],
      refColumnSel: '.column-user_id a',
      refFieldSel: '.ra-field-user_id a',
    },
    albums: {
      label: 'Albums',
      refs: ['users'],
      nested: ['photos'],
      refColumnSel: '.column-album_id a',
      refFieldSel: '.ra-field-album_id a',
      tabSel: '.show-tab[path=albums]',
    },
    photos: {
      label: 'Photos',
      refs: ['albums'],
      nested: ['comments'],
      refColumnSel: '.column-photo_id a',
      refFieldSel: '.ra-field-photo_id a',
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
  for (let resourceId in resources) {
    const resource = resources[resourceId];
    resource.menuItemSel = `${menuSel} [role=menuitem][href="${routes[resourceId]}"]`;
  }
  const showButtonSel = '[role="button"][title="Show"]';
  const createButtonSel = '[role="button"][class*="CreateButton-"]';
  const editButtonSel = '[role="button"][title="Edit"]';
  const deleteButtonSel = 'button.ra-delete-button';

  beforeAll(async () => {
    // Login as admin.
    const account = getAccount('admin');
    await login(page, account.username, account.password);
  });

  describe('Home page', () => {
    beforeAll(async () => {
      await page.goto(global.APP_ADDRESS + routes.home);
    }, 5000);

    it('should display a resource menu', async () => {
      expect(await page.$(menuSel)).toBeTruthy();
    });

    // Resource menu items.
    for (let resourceId in resources) {
      const resource = resources[resourceId];
      it(`should have a ${resource.label} menu item`, async () => {
        expect(await page.$(resource.menuItemSel)).toBeTruthy();
      });
    }
  });

  for (let resourceId in resources) {
    const resource = resources[resourceId];
    describe(`${resource.label}`, () => {
      describe(`List page`, () => {
        beforeAll(async () => {
          await page.goto(global.APP_ADDRESS + routes[resourceId]);
        }, 5000);

        it('should have show buttons', async () => {
          await page.waitForSelector(showButtonSel, { visibility: 'visible' });
          expect(await page.$(showButtonSel)).toBeTruthy();
        });
        it('should have edit buttons', async () => {
          await page.waitForSelector(editButtonSel, { visibility: 'visible' });
          expect(await page.$(editButtonSel)).toBeTruthy();
        });
        it('should have a create button', async () => {
          await page.waitForSelector(createButtonSel, {
            visibility: 'visible',
          });
          expect(await page.$(createButtonSel)).toBeTruthy();
        });

        // Referenced resources
        if (resource.refs) {
          for (let refId of resource.refs) {
            let refResource = resources[refId];
            it(`should show ${refResource.label}`, async () => {
              await page.waitForSelector(refResource.refColumnSel, {
                visibility: 'visible',
              });
              expect(await page.$(refResource.refColumnSel)).toBeTruthy();
            });
          }
        }
      });

      describe(`Show page`, () => {
        beforeAll(async () => {
          // Open first resource in list page.
          await page.goto(global.APP_ADDRESS + routes[resourceId]);
          await page.waitForSelector(showButtonSel, { visibility: 'visible' });
          const showButton = await page.$(showButtonSel);
          await showButton.click();
        }, 5000);

        it('should have an edit button', async () => {
          await page.waitForSelector(editButtonSel, { visibility: 'visible' });
          expect(await page.$(editButtonSel)).toBeTruthy();
        });

        // Referenced resources.
        if (resource.refs) {
          for (let refId of resource.refs) {
            let refResource = resources[refId];
            it(`should show ${refResource.label}`, async () => {
              await page.waitForSelector(refResource.refFieldSel, {
                visibility: 'visible',
              });
              expect(await page.$(refResource.refFieldSel)).toBeTruthy();
            });
          }
        }

        // Nested resources.
        if (resource.nested) {
          for (let nestedId of resource.nested) {
            let nestedResource = resources[nestedId];
            it(`should show ${nestedResource.label}`, async () => {
              await page.waitForSelector(nestedResource.tabSel, {
                visibility: 'visible',
              });
              expect(await page.$(nestedResource.tabSel)).toBeTruthy();
            });
          }
        }
      });

      describe(`Edit page`, () => {
        beforeAll(async () => {
          // Open first resource in list page.
          await page.goto(global.APP_ADDRESS + routes[resourceId]);
          await page.waitForSelector(editButtonSel, { visibility: 'visible' });
          const editButton = await page.$(editButtonSel);
          await editButton.click();
        }, 5000);

        it('should have a show button', async () => {
          await page.waitForSelector(showButtonSel, { visibility: 'visible' });
          expect(await page.$(showButtonSel)).toBeTruthy();
        });
        it('should have a delete button', async () => {
          await page.waitForSelector(deleteButtonSel, {
            visibility: 'visible',
          });
          expect(await page.$(deleteButtonSel)).toBeTruthy();
        });
      });
    });
  }
});
