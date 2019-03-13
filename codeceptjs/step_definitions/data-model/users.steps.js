/// <reference path="../../steps.d.ts" />

/** @type {CodeceptJS.I} */
const I = require('../../steps')();

const routes = require('../../routes.json');

const { getRandomElement } = require('./utils');

// Selectors
const rowSel = '.datagrid-body tr';
const idColumnSel = '.column-id';
const createButtonSel = `[href="${routes.users}/create"]`;
const saveButtonSel = 'button[class*="SaveButton-"]';
const deleteButtonSel = 'button.ra-delete-button';
const messageSel = `[class*="SnackbarContent-message"]`;
const progressBarSel = '[role=progressbar]';
const headerSel = 'header';

/** Get URL of User List page. */
function getUserListUrl(world) {
  return routes.users;
}

/** Get selector of User List rows */
function getUserRowSel(world) {
  // Main User List page.
  return rowSel;
}

/** Get list of Users */
async function getUserList(sel) {
  I.waitForElement(sel);
  const users = await I.executeScript(
    (sel, idColumnSel) => {
      const users = [];
      for (let row of document.querySelectorAll(sel)) {
        const id = row.querySelector(idColumnSel).textContent;
        users.push({ id });
      }
      return users;
    },
    sel,
    idColumnSel
  );
  return users;
}

// User list
When('I get the User list', async () => {
  const world = await I.getWorld();
  I.amOnPage(getUserListUrl(world));
});

Then('I should get the complete User list', async () => {
  const world = await I.getWorld();
  const location = new URL(await I.grabCurrentUrl());
  expect(location.hash).to.equal(getUserListUrl(world));
  expect(location.search).to.equal('');
});

// Users
Given('a new User {string}', async v => {
  const world = await I.getWorld();
  const data = { Username: 'Test user' };
  world.setVariable(v, { data });
});

When('I get the User {string}', async v => {
  const world = await I.getWorld();
  const id = world.getVariable(v);
  const url = `${routes.users}/${id}/show`;
  I.amOnPage(url);
});
When('I create the User {string}', async v => {
  const world = await I.getWorld();
  const { data } = world.getVariable(v);
  if (data['Id']) {
    // Don't create users with an ID.
    // Remember creation status.
    world.userCreationStatus = false;
    return;
  }

  // Go to the User List page and click the Create button.
  I.amOnPage(getUserListUrl(world));
  I.click(createButtonSel);

  // Ensure that page is fully loaded.
  I.waitForInvisible(progressBarSel);

  // Fill and save the form.
  await I.writeEditData(data);
  I.click(saveButtonSel);
  world.userCreationStatus = true;
});
When('I update the User {string} with {string}', async (v1, v2) => {
  const world = await I.getWorld();
  const id = world.getVariable(v1);
  const { data } = world.getVariable(v2);

  // Go to the User Edit page.
  const url = `${routes.users}/${id}`;
  I.amOnPage(url);

  // Check that we're really on the edit page before proceeding.
  if (!(await I.grabNumberOfVisibleElements(saveButtonSel))) return;

  // Ensure that page is fully loaded.
  I.waitForInvisible(progressBarSel);

  // Fill and save the form.
  await I.writeEditData(data);
  I.click(saveButtonSel);
  world.userUpdateStatus = id;
});
When('I replace the User {string} with {string}', async (v1, v2) => {
  const world = await I.getWorld();
  const id = world.getVariable(v1);
  const { data } = world.getVariable(v2);

  // Go to the User Edit page.
  const url = `${routes.users}/${id}`;
  I.amOnPage(url);

  // Check that we're really on the edit page before proceeding.
  if (!(await I.grabNumberOfVisibleElements(saveButtonSel))) return;

  // Ensure that page is fully loaded.
  I.waitForInvisible(progressBarSel);

  // Fill and save the form.
  await I.writeEditData(data, true);
  I.click(saveButtonSel);
  world.userReplaceStatus = id;
});
When('I delete the User {string}', async v => {
  const world = await I.getWorld();
  const id = world.getVariable(v);

  // Go to the User Edit page.
  const url = `${routes.users}/${id}`;
  I.amOnPage(url);

  // Check that we're really on the edit page before proceeding.
  if (!(await I.grabNumberOfVisibleElements(deleteButtonSel))) return;

  I.click(deleteButtonSel);
});

Then('I should get the User {string}', async v => {
  const world = await I.getWorld();
  const data = await I.readShowData();
  const links = await I.readShowLinks();
  world.setVariable(v, { data, links });
});
Then('the User should be created as {string}', async v => {
  const world = await I.getWorld();

  // Success message.
  I.see('Element created', messageSel);
  I.click(headerSel);

  // We are on a User Edit page.
  const location = new URL(await I.grabCurrentUrl());
  expect(location.hash).to.match(new RegExp(`${routes.users}/\\d+`));

  // Go to the User Show page.
  const url = location.href + '/show';
  I.amOnPage(url);

  // Extract all the User fields.
  const data = await I.readShowData();
  const links = await I.readShowLinks();
  world.setVariable(v, { data, links });
});
Then('the User should be updated as {string}', async v => {
  const world = await I.getWorld();

  // Success message.
  I.see('Element updated', messageSel);
  I.click(headerSel);

  // Go to the User Show page.
  const id = world.userUpdateStatus;
  const url = `${routes.users}/${id}/show`;
  I.amOnPage(url);

  // Extract all the User fields.
  const data = await I.readShowData();
  const links = await I.readShowLinks();
  world.setVariable(v, { data, links });
});
Then('the User should be replaced as {string}', async v => {
  const world = await I.getWorld();

  // Success message.
  I.see('Element updated', messageSel);
  I.click(headerSel);

  // Go to the User Show page.
  const id = world.userReplaceStatus;
  const url = `${routes.users}/${id}/show`;
  I.amOnPage(url);

  // Extract all the User fields.
  const data = await I.readShowData();
  const links = await I.readShowLinks();
  world.setVariable(v, { data, links });
});
Then('the User should not be created', async () => {
  const world = await I.getWorld();
  expect(world.userCreationStatus).to.be.false;
});

Then('the User {string} should equal the User {string}', async (v1, v2) => {
  const world = await I.getWorld();
  const { data: user1 } = world.getVariable(v1);
  const { data: user2 } = world.getVariable(v2);
  expect(user1)
    .excluding('Id')
    .to.deep.equal(user2);
});
Then('the User {string} should include the User {string}', async (v1, v2) => {
  const world = await I.getWorld();
  const { data: user1 } = world.getVariable(v1);
  const { data: user2 } = world.getVariable(v2);
  expect(user1).to.include(user2);
});

// User Ids
Given('an existing User Id {string}', async v => {
  const world = await I.getWorld();
  I.amOnPage(getUserListUrl(world));
  const users = await getUserList(getUserRowSel(world));
  world.setVariable(v, getRandomElement(users).id);
});
Given('an unknown User Id {string}', async v => {
  const world = await I.getWorld();
  world.setVariable(v, 9999);
});
Given('the User Id {string} of the User {string}', async (v1, v2) => {
  const world = await I.getWorld();
  const { data: user } = world.getVariable(v2);
  world.setVariable(v1, user['Id']);
});
