const { Given, When, Then } = require('cucumber');

const routes = require('../../../routes.json');

const { getRandomElement } = require('./utils');

// Selectors
const rowSel = '.datagrid-body tr';
const idColumnSel = '.column-id';
const createButtonSel = `[href="${routes.users}/create"]`;
const saveButtonSel = 'button[class*="SaveButton-"]';
const deleteButtonSel = 'button.ra-delete-button';
const messageSel = `[class*="SnackbarContent-message"]`;
const progressBarSel = '[role=progressbar]';

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
async function getUserList(world, sel) {
  // Note: using eval is much faster than iterating on Selector with .count
  // and .nth
  const users = await world.eval(
    () => {
      const users = [];
      for (let row of document.querySelectorAll(sel)) {
        const id = row.querySelector(idColumnSel).textContent;
        users.push({ id });
      }
      return users;
    },
    { dependencies: { sel, idColumnSel } }
  );
  return users;
}

// User list
When('I get the User list', async function() {
  await this.t.navigateTo(global.APP_ADDRESS + getUserListUrl(this));
});

Then('I should get the complete User list', async function() {
  const location = await this.eval(() => window.location);
  await this.t.expect(location.hash).eql(getUserListUrl(this));
  await this.t.expect(location.search).eql('');
});

// Users
Given('a new User {string}', function(v) {
  const data = { Username: 'Test user' };
  this.setVariable(v, { data });
});

When('I get the User {string}', async function(v) {
  const id = this.getVariable(v);
  const url = `${routes.users}/${id}/show`;
  await this.t.navigateTo(global.APP_ADDRESS + url);
});
When('I create the User {string}', async function(v) {
  const { data } = this.getVariable(v);
  if (data['Id']) {
    // Don't create users with an ID.
    // Remember creation status.
    this.userCreationStatus = false;
    return;
  }

  // Go to the User List page and click the Create button.
  await this.t.navigateTo(global.APP_ADDRESS + getUserListUrl(this));
  await this.t.click(this.Selector(createButtonSel));

  // Ensure that page is fully loaded.
  await this.t.expect(this.Selector(progressBarSel).exists).notOk();

  // Fill and save the form.
  await this.writeEditData(data);
  await this.t.click(this.Selector(saveButtonSel));
  this.userCreationStatus = true;
});
When('I update the User {string} with {string}', async function(v1, v2) {
  const id = this.getVariable(v1);
  const { data } = this.getVariable(v2);

  // Go to the User Edit page.
  const url = `${routes.users}/${id}`;
  await this.t.navigateTo(global.APP_ADDRESS + url);

  // Check that we're really on the edit page before proceeding.
  if (!(await this.Selector(saveButtonSel).exists)) return;

  // Ensure that page is fully loaded.
  await this.t.expect(this.Selector(progressBarSel).exists).notOk();

  // Fill and save the form.
  await this.writeEditData(data);
  await this.t.click(this.Selector(saveButtonSel));
  this.userUpdateStatus = id;
});
When(
  'I replace the User {string} with {string}',
  { timeout: 10000 }, // FIXME writeEditData is slow
  async function(v1, v2) {
    const id = this.getVariable(v1);
    const { data } = this.getVariable(v2);

    // Go to the User Edit page.
    const url = `${routes.users}/${id}`;
    await this.t.navigateTo(global.APP_ADDRESS + url);

    // Check that we're really on the edit page before proceeding.
    if (!(await this.Selector(saveButtonSel).exists)) return;

    // Ensure that page is fully loaded.
    await this.t.expect(this.Selector(progressBarSel).exists).notOk();

    // Fill and save the form.
    await this.writeEditData(data, true);
    await this.t.click(this.Selector(saveButtonSel));
    this.userReplaceStatus = id;
  }
);
When('I delete the User {string}', async function(v) {
  const id = this.getVariable(v);

  // Go to the User Edit page.
  const url = `${routes.users}/${id}`;
  await this.t.navigateTo(global.APP_ADDRESS + url);

  // Check that we're really on the edit page before proceeding.
  if (!(await this.Selector(deleteButtonSel).exists)) return;

  await this.t.click(this.Selector(deleteButtonSel));
});

Then('I should get the User {string}', async function(v) {
  const data = await this.readShowData();
  const links = await this.readShowLinks();
  this.setVariable(v, { data, links });
});
Then('the User should be created as {string}', async function(v) {
  // Success message.
  await this.t
    .expect(this.Selector(messageSel).withText('Element created').exists)
    .ok();

  // We are on a User Edit page.
  const location = await this.eval(() => window.location);
  await this.t.expect(location.hash).match(new RegExp(`${routes.users}/\\d+`));

  // Go to the User Show page.
  const url = location.href + '/show';
  await this.t.navigateTo(global.APP_ADDRESS + url);

  // Extract all the User fields.
  const data = await this.readShowData();
  const links = await this.readShowLinks();
  this.setVariable(v, { data, links });
});
Then('the User should be updated as {string}', async function(v) {
  // Success message.
  await this.t
    .expect(this.Selector(messageSel).withText('Element updated').exists)
    .ok();

  // Go to the User Show page.
  const id = this.userUpdateStatus;
  const url = `${routes.users}/${id}/show`;
  await this.t.navigateTo(global.APP_ADDRESS + url);

  // Extract all the User fields.
  const data = await this.readShowData();
  const links = await this.readShowLinks();
  this.setVariable(v, { data, links });
});
Then('the User should be replaced as {string}', async function(v) {
  // Success message.
  await this.t
    .expect(this.Selector(messageSel).withText('Element updated').exists)
    .ok();

  // Go to the User Show page.
  const id = this.userReplaceStatus;
  const url = `${routes.users}/${id}/show`;
  await this.t.navigateTo(global.APP_ADDRESS + url);

  // Extract all the User fields.
  const data = await this.readShowData();
  const links = await this.readShowLinks();
  this.setVariable(v, { data, links });
});
Then('the User should not be created', async function() {
  await this.t.expect(this.userCreationStatus).notOk();
});

Then('the User {string} should equal the User {string}', async function(
  v1,
  v2
) {
  const {
    data: { Id: id1, ...user1 },
  } = this.getVariable(v1);
  const {
    data: { Id: id2, ...user2 },
  } = this.getVariable(v2);
  await this.t.expect(user1).eql(user2);
});
Then('the User {string} should include the User {string}', async function(
  v1,
  v2
) {
  const { data: user1 } = this.getVariable(v1);
  const { data: user2 } = this.getVariable(v2);
  await this.t.expect(user1).contains(user2);
});

// User Ids
Given('an existing User Id {string}', async function(v) {
  await this.t.navigateTo(global.APP_ADDRESS + getUserListUrl(this));
  const users = await getUserList(this, getUserRowSel(this));
  this.setVariable(v, getRandomElement(users).id);
});
Given('an unknown User Id {string}', function(v) {
  this.setVariable(v, 9999);
});
Given('the User Id {string} of the User {string}', function(v1, v2) {
  const { data: user } = this.getVariable(v2);
  this.setVariable(v1, user['Id']);
});
