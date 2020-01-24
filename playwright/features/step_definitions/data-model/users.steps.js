const { Given, When, Then } = require('cucumber');

const routes = require('../../../e2e/routes.json');

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
  const users = await world.page.$$eval(
    sel,
    (rows, idColumnSel, typeColumnSel) => {
      const users = [];
      for (let row of rows) {
        const id = row.querySelector(idColumnSel).textContent;
        users.push({ id });
      }
      return users;
    },
    idColumnSel
  );
  return users;
}

// User list
When('I get the User list', async function() {
  await this.page.goto(global.APP_ADDRESS + getUserListUrl(this));
  await this.page.waitForSelector(progressBarSel, { visibility: 'hidden' });
});

Then('I should get the complete User list', async function() {
  const location = await this.page.evaluate(() => window.location);
  expect(location.hash).to.equal(getUserListUrl(this));
  expect(location.search).to.equal('');
});

// Users
Given('a new User {string}', function(v) {
  const data = { Username: 'Test user' };
  this.setVariable(v, { data });
});

When('I get the User {string}', async function(v) {
  const id = this.getVariable(v);
  const url = `${routes.users}/${id}/show`;
  await this.page.goto(global.APP_ADDRESS + url);
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
  await this.page.goto(global.APP_ADDRESS + getUserListUrl(this));
  await (await this.page.$(createButtonSel)).click();

  // Ensure that page is fully loaded.
  await this.page.waitForSelector(progressBarSel, { visibility: 'hidden' });

  // Fill and save the form.
  await this.writeEditData(data);
  await (await this.page.$(saveButtonSel)).click();
  this.userCreationStatus = true;
});
When('I update the User {string} with {string}', async function(v1, v2) {
  const id = this.getVariable(v1);
  const { data } = this.getVariable(v2);

  // Go to the User Edit page.
  const url = `${routes.users}/${id}`;
  await this.page.goto(global.APP_ADDRESS + url);

  // Check that we're really on the edit page before proceeding.
  if (!(await this.page.$(saveButtonSel))) return;

  // Ensure that page is fully loaded.
  await this.page.waitForSelector(progressBarSel, { visibility: 'hidden' });

  // Fill and save the form.
  await this.writeEditData(data);
  await (await this.page.$(saveButtonSel)).click();
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
    await this.page.goto(global.APP_ADDRESS + url);

    // Check that we're really on the edit page before proceeding.
    if (!(await this.page.$(saveButtonSel))) return;

    // Ensure that page is fully loaded.
    await this.page.waitForSelector(progressBarSel, { visibility: 'hidden' });

    // Fill and save the form.
    await this.writeEditData(data, true);
    await (await this.page.$(saveButtonSel)).click();
    this.userReplaceStatus = id;
  }
);
When('I delete the User {string}', async function(v) {
  const id = this.getVariable(v);

  // Go to the User Edit page.
  const url = `${routes.users}/${id}`;
  await this.page.goto(global.APP_ADDRESS + url);

  // Check that we're really on the edit page before proceeding.
  if (!(await this.page.$(saveButtonSel))) return;

  await (await this.page.$(deleteButtonSel)).click();
});

Then('I should get the User {string}', async function(v) {
  const data = await this.readShowData();
  const links = await this.readShowLinks();
  this.setVariable(v, { data, links });
});
Then('the User should be created as {string}', async function(v) {
  // Success message.
  await this.page.waitForSelector(messageSel, { visibility: 'visible' });
  expect(await this.page.$(messageSel)).to.exist;
  expect(await this.page.$eval(messageSel, e => e.textContent)).to.include(
    'Element created'
  );

  // We are on a User Edit page.
  const location = await this.page.evaluate(() => window.location);
  expect(location.hash).to.match(new RegExp(`${routes.users}/\\d+`));

  // Go to the User Show page.
  const url = location.href + '/show';
  await this.page.goto(global.APP_ADDRESS + url);

  // Extract all the User fields.
  const data = await this.readShowData();
  const links = await this.readShowLinks();
  this.setVariable(v, { data, links });
});
Then('the User should be updated as {string}', async function(v) {
  // Success message.
  await this.page.waitForSelector(messageSel, { visibility: 'visible' });
  expect(await this.page.$(messageSel)).to.exist;
  expect(await this.page.$eval(messageSel, e => e.textContent)).to.include(
    'Element updated'
  );

  // Go to the User Show page.
  const id = this.userUpdateStatus;
  const url = `${routes.users}/${id}/show`;
  await this.page.goto(global.APP_ADDRESS + url);

  // Extract all the User fields.
  const data = await this.readShowData();
  const links = await this.readShowLinks();
  this.setVariable(v, { data, links });
});
Then('the User should be replaced as {string}', async function(v) {
  // Success message.
  await this.page.waitForSelector(messageSel, { visibility: 'visible' });
  expect(await this.page.$(messageSel)).to.exist;
  expect(await this.page.$eval(messageSel, e => e.textContent)).to.include(
    'Element updated'
  );

  // Go to the User Show page.
  const id = this.userReplaceStatus;
  const url = `${routes.users}/${id}/show`;
  await this.page.goto(global.APP_ADDRESS + url);

  // Extract all the User fields.
  const data = await this.readShowData();
  const links = await this.readShowLinks();
  this.setVariable(v, { data, links });
});
Then('the User should not be created', async function() {
  expect(this.userCreationStatus).to.be.false;
});

Then('the User {string} should equal the User {string}', async function(
  v1,
  v2
) {
  const { data: user1 } = this.getVariable(v1);
  const { data: user2 } = this.getVariable(v2);
  expect(user1)
    .excluding('Id')
    .to.deep.equal(user2);
});
Then('the User {string} should include the User {string}', async function(
  v1,
  v2
) {
  const { data: user1 } = this.getVariable(v1);
  const { data: user2 } = this.getVariable(v2);
  expect(user1).to.include(user2);
});

// User Ids
Given('an existing User Id {string}', async function(v) {
  await this.page.goto(global.APP_ADDRESS + getUserListUrl(this));
  await this.page.waitForSelector(progressBarSel, { visibility: 'hidden' });
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
