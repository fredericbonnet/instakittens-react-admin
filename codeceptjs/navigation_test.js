/// <reference path="./steps.d.ts" />

const { getAccount } = require('./utils');
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

Feature('Navigation > Home page');

Before(I => {
  // Login as admin.
  const account = getAccount('admin');
  I.login(account.username, account.password);
  I.amOnPage(routes.home);
});

Scenario('should display a resource menu', I => {
  I.seeElement(menuSel);
});

// Resource menu items.
for (let resourceId in resources) {
  const resource = resources[resourceId];
  Scenario(`should have a ${resource.label} menu item`, I => {
    I.seeElement(resource.menuItemSel);
  });
}

for (let resourceId in resources) {
  const resource = resources[resourceId];
  Feature(`Navigation > ${resource.label} > List page`);

  Before(I => {
    // Login as admin.
    const account = getAccount('admin');
    I.login(account.username, account.password);
    I.amOnPage(routes[resourceId]);
  });

  Scenario('should have show buttons', I => {
    I.seeElement(showButtonSel);
  });
  Scenario('should have edit buttons', I => {
    I.seeElement(editButtonSel);
  });
  Scenario('should have a create button', I => {
    I.seeElement(createButtonSel);
  });

  // Referenced resources
  if (resource.refs) {
    for (let refId of resource.refs) {
      let refResource = resources[refId];
      Scenario(`should show ${refResource.label}`, I => {
        I.seeElement(refResource.refColumnSel);
      });
    }
  }

  Feature(`Navigation > ${resource.label} > Show page`);

  Before(I => {
    // Login as admin.
    const account = getAccount('admin');
    I.login(account.username, account.password);

    // Open first resource in list page.
    I.amOnPage(routes[resourceId]);
    I.click(showButtonSel);
  });

  Scenario('should have an edit button', I => {
    I.seeElement(editButtonSel);
  });

  // Referenced resources.
  if (resource.refs) {
    for (let refId of resource.refs) {
      let refResource = resources[refId];
      Scenario(`should show ${refResource.label}`, I => {
        I.seeElement(refResource.refFieldSel);
      });
    }
  }

  // Nested resources.
  if (resource.nested) {
    for (let nestedId of resource.nested) {
      let nestedResource = resources[nestedId];
      Scenario(`should show ${nestedResource.label}`, I => {
        I.seeElement(nestedResource.tabSel);
      });
    }
  }

  Feature(`Navigation > ${resource.label} > Edit page`);

  Before(I => {
    // Login as admin.
    const account = getAccount('admin');
    I.login(account.username, account.password);

    // Open first resource in list page.
    I.amOnPage(routes[resourceId]);
    I.click(editButtonSel);
  });

  Scenario('should have a show button', I => {
    I.seeElement(showButtonSel);
  });
  Scenario('should have a delete button', I => {
    I.seeElement(deleteButtonSel);
  });
}
