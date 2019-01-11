const { Selector } = require('testcafe');

require('./globals');

const { getAccount, login } = require('./utils');
const routes = require('./routes.json');

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
  resource.menuItemSel = `${menuSel} [role=menuitem][href="${
    routes[resourceId]
  }"]`;
}
const showButtonSel = '[role="button"][aria-label="Show"]';
const createButtonSel = '[role="button"][aria-label="Create"]';
const editButtonSel = '[role="button"][aria-label="Edit"]';
const deleteButtonSel = 'button.ra-delete-button';

fixture('Navigation > Home page')
  .page(global.APP_ADDRESS + routes.home)
  .beforeEach(async t => {
    // Login as admin.
    const account = getAccount('admin');
    await login(t, account.username, account.password);
    await t.navigateTo(global.APP_ADDRESS + routes.home);
  });

test('should display a resource menu', async t => {
  await t.expect(Selector(menuSel).exists).ok();
});

// Resource menu items.
for (let resourceId in resources) {
  const resource = resources[resourceId];
  test(`should have a ${resource.label} menu item`, async t => {
    await t.expect(Selector(resource.menuItemSel).exists).ok();
  });
}

for (let resourceId in resources) {
  const resource = resources[resourceId];
  fixture(`Navigation > ${resource.label} > List page`)
    .page(global.APP_ADDRESS + routes[resourceId])
    .beforeEach(async t => {
      // Login as admin.
      const account = getAccount('admin');
      await login(t, account.username, account.password);
      await t.navigateTo(global.APP_ADDRESS + routes[resourceId]);
    });

  test('should have show buttons', async t => {
    await t.expect(Selector(showButtonSel).exists).ok();
  });
  test('should have edit buttons', async t => {
    await t.expect(Selector(editButtonSel).exists).ok();
  });
  test('should have a create button', async t => {
    await t.expect(Selector(createButtonSel).exists).ok();
  });

  // Referenced resources
  if (resource.refs) {
    for (let refId of resource.refs) {
      let refResource = resources[refId];
      test(`should show ${refResource.label}`, async t => {
        await t.expect(Selector(refResource.refColumnSel).exists).ok();
      });
    }
  }

  fixture(`Navigation > ${resource.label} > Show page`)
    .page(global.APP_ADDRESS + routes[resourceId])
    .beforeEach(async t => {
      // Login as admin.
      const account = getAccount('admin');
      await login(t, account.username, account.password);

      // Open first resource in list page.
      await t.navigateTo(global.APP_ADDRESS + routes[resourceId]);
      await t.click(Selector(showButtonSel));
    });

  test('should have an edit button', async t => {
    await t.expect(Selector(editButtonSel).exists).ok();
  });

  // Referenced resources.
  if (resource.refs) {
    for (let refId of resource.refs) {
      let refResource = resources[refId];
      test(`should show ${refResource.label}`, async t => {
        await t.expect(Selector(refResource.refFieldSel).exists).ok();
      });
    }
  }

  // Nested resources.
  if (resource.nested) {
    for (let nestedId of resource.nested) {
      let nestedResource = resources[nestedId];
      test(`should show ${nestedResource.label}`, async t => {
        await t.expect(Selector(nestedResource.tabSel).exists).ok();
      });
    }
  }

  fixture(`Navigation > ${resource.label} > Edit page`)
    .page(global.APP_ADDRESS + routes[resourceId])
    .beforeEach(async t => {
      // Login as admin.
      const account = getAccount('admin');
      await login(t, account.username, account.password);

      // Open first resource in list page.
      await t.navigateTo(global.APP_ADDRESS + routes[resourceId]);
      await t.click(Selector(editButtonSel));
    });

  test('should have a show button', async t => {
    await t.expect(Selector(showButtonSel).exists).ok();
  });
  test('should have a delete button', async t => {
    await t.expect(Selector(deleteButtonSel).exists).ok();
  });
}
