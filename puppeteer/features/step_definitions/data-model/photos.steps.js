const { Given, When, Then } = require('cucumber');

const routes = require('../../../e2e/routes.json');

const { getRandomElement } = require('./utils');

// Selectors
const photoReferenceListSel = '[data-testid=photo-reference-list]';
const rowSel = '.datagrid-body tr';
const idColumnSel = '.column-id';
const createButtonSel = `[href="${routes.photos}/create"]`;
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
    url = routes.photos;
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

/** Get list of Photos */
async function getPhotoList(world, sel) {
  const photos = await world.page.$$eval(
    sel,
    (rows, idColumnSel, typeColumnSel) => {
      const photos = [];
      for (let row of rows) {
        const id = row.querySelector(idColumnSel).textContent;
        photos.push({ id });
      }
      return photos;
    },
    idColumnSel
  );
  return photos;
}

// Photo list
When('I get the Photo list', async function() {
  await this.page.goto(global.APP_ADDRESS + getPhotoListUrl(this));
  await this.page.waitForSelector(progressBarSel, { hidden: true });
});

Then('I should get the complete Photo list', async function() {
  const location = await this.page.evaluate(() => window.location);
  expect(location.hash).to.equal(getPhotoListUrl(this));
  expect(location.search).to.equal('');
});

// Photos
Given('a new Photo {string}', function(v) {
  const data = { Title: 'Test photo' };
  this.setVariable(v, { data });
});

When('I get the Photo {string}', async function(v) {
  const id = this.getVariable(v);
  const url = `${routes.photos}/${id}/show`;
  await this.page.goto(global.APP_ADDRESS + url);
});
When('I create the Photo {string}', async function(v) {
  const { data } = this.getVariable(v);
  if (data['Id']) {
    // Don't create photos with an ID.
    // Remember creation status.
    this.photoCreationStatus = false;
    return;
  }

  // Go to the Photo List page and click the Create button.
  await this.page.goto(global.APP_ADDRESS + getPhotoListUrl(this));
  await (await this.page.$(createButtonSel)).click();

  // Ensure that page is fully loaded.
  await this.page.waitForSelector(progressBarSel, { hidden: true });

  // Fill and save the form.
  await this.writeEditData({ ...data, ...this.getParentData() });
  await (await this.page.$(saveButtonSel)).click();
  this.photoCreationStatus = true;
});
When('I update the Photo {string} with {string}', async function(v1, v2) {
  const id = this.getVariable(v1);
  const { data } = this.getVariable(v2);

  // Go to the Photo Edit page.
  const url = `${routes.photos}/${id}`;
  await this.page.goto(global.APP_ADDRESS + url);

  // Check that we're really on the edit page before proceeding.
  if (!(await this.page.$(saveButtonSel))) return;

  // Ensure that page is fully loaded.
  await this.page.waitForSelector(progressBarSel, { hidden: true });

  // Fill and save the form.
  await this.writeEditData({ ...data, ...this.getParentData() });
  await (await this.page.$(saveButtonSel)).click();
  this.photoUpdateStatus = id;
});
When(
  'I replace the Photo {string} with {string}',
  { timeout: 10000 }, // FIXME writeEditData is slow
  async function(v1, v2) {
    const id = this.getVariable(v1);
    const { data } = this.getVariable(v2);

    // Go to the Photo Edit page.
    const url = `${routes.photos}/${id}`;
    await this.page.goto(global.APP_ADDRESS + url);

    // Check that we're really on the edit page before proceeding.
    if (!(await this.page.$(saveButtonSel))) return;

    // Ensure that page is fully loaded.
    await this.page.waitForSelector(progressBarSel, { hidden: true });

    // Fill and save the form.
    await this.writeEditData({ ...data, ...this.getParentData() }, true);
    await (await this.page.$(saveButtonSel)).click();
    this.photoReplaceStatus = id;
  }
);
When('I delete the Photo {string}', async function(v) {
  const id = this.getVariable(v);

  // Go to the Photo Edit page.
  const url = `${routes.photos}/${id}`;
  await this.page.goto(global.APP_ADDRESS + url);

  // Check that we're really on the edit page before proceeding.
  if (!(await this.page.$(saveButtonSel))) return;

  await (await this.page.$(deleteButtonSel)).click();
});

Then('I should get the Photo {string}', async function(v) {
  const data = await this.readShowData();
  const links = await this.readShowLinks();
  this.setVariable(v, { data, links });
});
Then('the Photo should be created as {string}', async function(v) {
  // Success message.
  await this.page.waitForSelector(messageSel, { visible: true });
  expect(await this.page.$(messageSel)).to.exist;
  expect(await this.page.$eval(messageSel, e => e.textContent)).to.include(
    'Element created'
  );

  // We are on a Photo Edit page.
  const location = await this.page.evaluate(() => window.location);
  expect(location.hash).to.match(new RegExp(`${routes.photos}/\\d+`));

  // Go to the Photo Show page.
  const url = location.href + '/show';
  await this.page.goto(global.APP_ADDRESS + url);

  // Extract all the Photo fields.
  const data = await this.readShowData();
  const links = await this.readShowLinks();
  this.setVariable(v, { data, links });
});
Then('the Photo should be updated as {string}', async function(v) {
  // Success message.
  await this.page.waitForSelector(messageSel, { visible: true });
  expect(await this.page.$(messageSel)).to.exist;
  expect(await this.page.$eval(messageSel, e => e.textContent)).to.include(
    'Element updated'
  );

  // Go to the Photo Show page.
  const id = this.photoUpdateStatus;
  const url = `${routes.photos}/${id}/show`;
  await this.page.goto(global.APP_ADDRESS + url);

  // Extract all the Photo fields.
  const data = await this.readShowData();
  const links = await this.readShowLinks();
  this.setVariable(v, { data, links });
});
Then('the Photo should be replaced as {string}', async function(v) {
  // Success message.
  await this.page.waitForSelector(messageSel, { visible: true });
  expect(await this.page.$(messageSel)).to.exist;
  expect(await this.page.$eval(messageSel, e => e.textContent)).to.include(
    'Element updated'
  );

  // Go to the Photo Show page.
  const id = this.photoReplaceStatus;
  const url = `${routes.photos}/${id}/show`;
  await this.page.goto(global.APP_ADDRESS + url);

  // Extract all the Photo fields.
  const data = await this.readShowData();
  const links = await this.readShowLinks();
  this.setVariable(v, { data, links });
});
Then('the Photo should not be created', async function() {
  expect(this.photoCreationStatus).to.be.false;
});

Then('the Photo {string} should equal the Photo {string}', async function(
  v1,
  v2
) {
  const { data: photo1 } = this.getVariable(v1);
  const { data: photo2 } = this.getVariable(v2);
  expect(photo1)
    .excluding('Id')
    .to.deep.equal(photo2);
});
Then('the Photo {string} should include the Photo {string}', async function(
  v1,
  v2
) {
  const { data: photo1 } = this.getVariable(v1);
  const { data: photo2 } = this.getVariable(v2);
  expect(photo1).to.include(photo2);
});

// Photo Ids
Given('an existing Photo Id {string}', async function(v) {
  await this.page.goto(global.APP_ADDRESS + getPhotoListUrl(this));
  await this.page.waitForSelector(progressBarSel, { hidden: true });
  const photos = await getPhotoList(this, getPhotoRowSel(this));
  this.setVariable(v, getRandomElement(photos).id);
});
Given('an unknown Photo Id {string}', function(v) {
  this.setVariable(v, 9999);
});
Given('the Photo Id {string} of the Photo {string}', function(v1, v2) {
  const { data: photo } = this.getVariable(v2);
  this.setVariable(v1, photo['Id']);
});
Given('the User Id {string} of the Photo {string}', function(v1, v2) {
  const { links } = this.getVariable(v2);
  if (links && links['User']) {
    const url = links['User'].url;
    const id = url.replace(routes.users, '').slice(1);
    this.setVariable(v1, id);
  }
});
Given('the Album Id {string} of the Photo {string}', function(v1, v2) {
  const { links } = this.getVariable(v2);
  if (links && links['Album']) {
    const url = links['Album'].url;
    const id = url.replace(routes.albums, '').slice(1);
    this.setVariable(v1, id);
  }
});
