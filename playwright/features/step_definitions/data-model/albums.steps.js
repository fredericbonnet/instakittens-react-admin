const { Given, When, Then } = require('cucumber');

const routes = require('../../../e2e/routes.json');

const { getRandomElement } = require('./utils');

// Selectors
const albumReferenceListSel = '[data-testid=album-reference-list]';
const rowSel = '.datagrid-body tr';
const idColumnSel = '.column-id';
const typeColumnSel = '.column-type';
const createButtonSel = `[href="${routes.albums}/create"]`;
const saveButtonSel = 'button[class*="SaveButton-"]';
const deleteButtonSel = 'button.ra-delete-button';
const messageSel = `[class*="SnackbarContent-message"]`;
const progressBarSel = '[role=progressbar]';

/** Get URL of Album List page. */
function getAlbumListUrl(world) {
  const root = world.getRoot();
  let url;
  if (root) {
    // Parent's Albums tab.
    url = `${root}/albums`;
  } else {
    // Main Album List page.
    url = routes.albums;
  }
  return url;
}

/** Get selector of Album List rows */
function getAlbumRowSel(world) {
  const root = world.getRoot();
  if (root) {
    // Parent's Albums tab.
    return albumReferenceListSel + ' ' + rowSel;
  } else {
    // Main Album List page.
    return rowSel;
  }
}

/** Get list of Albums with type */
async function getAlbumList(world, sel) {
  const albums = await world.page.$$eval(
    sel,
    (rows, idColumnSel, typeColumnSel) => {
      const albums = [];
      for (let row of rows) {
        const id = row.querySelector(idColumnSel).textContent;
        const type = row.querySelector(typeColumnSel).textContent;
        albums.push({ id, type });
      }
      return albums;
    },
    idColumnSel,
    typeColumnSel
  );
  return albums;
}

// Album list
When('I get the Album list', async function() {
  await this.page.goto(global.APP_ADDRESS + getAlbumListUrl(this));
  await this.page.waitForSelector(progressBarSel, { visibility: 'hidden' });
});

Then('I should get the complete Album list', async function() {
  const location = await this.page.evaluate(() => window.location);
  expect(location.hash).to.equal(getAlbumListUrl(this));
  expect(location.search).to.equal('');
});

// Albums
Given('a new Album {string}', function(v) {
  const data = { Title: 'Test album' };
  this.setVariable(v, { data });
});

When('I get the Album {string}', async function(v) {
  const id = this.getVariable(v);
  const url = `${routes.albums}/${id}/show`;
  await this.page.goto(global.APP_ADDRESS + url);
});
When('I create the Album {string}', async function(v) {
  const { data } = this.getVariable(v);
  if (data['Id']) {
    // Don't create albums with an ID.
    // Remember creation status.
    this.albumCreationStatus = false;
    return;
  }

  // Go to the Album List page and click the Create button.
  await this.page.goto(global.APP_ADDRESS + getAlbumListUrl(this));
  await (await this.page.$(createButtonSel)).click();

  // Ensure that page is fully loaded.
  await this.page.waitForSelector(progressBarSel, { visibility: 'hidden' });

  // Fill and save the form.
  await this.writeEditData({ ...data, ...this.getParentData() });
  await (await this.page.$(saveButtonSel)).click();
  this.albumCreationStatus = true;
});
When('I update the Album {string} with {string}', async function(v1, v2) {
  const id = this.getVariable(v1);
  const { data } = this.getVariable(v2);

  // Go to the Album Edit page.
  const url = `${routes.albums}/${id}`;
  await this.page.goto(global.APP_ADDRESS + url);

  // Check that we're really on the edit page before proceeding.
  if (!(await this.page.$(saveButtonSel))) return;

  // Ensure that page is fully loaded.
  await this.page.waitForSelector(progressBarSel, { visibility: 'hidden' });

  // Fill and save the form.
  await this.writeEditData({ ...data, ...this.getParentData() });
  await (await this.page.$(saveButtonSel)).click();
  this.albumUpdateStatus = id;
});
When(
  'I replace the Album {string} with {string}',
  { timeout: 10000 }, // FIXME writeEditData is slow
  async function(v1, v2) {
    const id = this.getVariable(v1);
    const { data } = this.getVariable(v2);

    // Go to the Album Edit page.
    const url = `${routes.albums}/${id}`;
    await this.page.goto(global.APP_ADDRESS + url);

    // Check that we're really on the edit page before proceeding.
    if (!(await this.page.$(saveButtonSel))) return;

    // Ensure that page is fully loaded.
    await this.page.waitForSelector(progressBarSel, { visibility: 'hidden' });

    // Fill and save the form.
    await this.writeEditData({ ...data, ...this.getParentData() }, true);
    await (await this.page.$(saveButtonSel)).click();
    this.albumReplaceStatus = id;
  }
);
When('I delete the Album {string}', async function(v) {
  const id = this.getVariable(v);

  // Go to the Album Edit page.
  const url = `${routes.albums}/${id}`;
  await this.page.goto(global.APP_ADDRESS + url);

  // Check that we're really on the edit page before proceeding.
  if (!(await this.page.$(saveButtonSel))) return;

  await (await this.page.$(deleteButtonSel)).click();
});

Then('I should get the Album {string}', async function(v) {
  const data = await this.readShowData();
  const links = await this.readShowLinks();
  this.setVariable(v, { data, links });
});
Then('the Album should be created as {string}', async function(v) {
  // Success message.
  await this.page.waitForSelector(messageSel, { visibility: 'visible' });
  expect(await this.page.$(messageSel)).to.exist;
  expect(await this.page.$eval(messageSel, e => e.textContent)).to.include(
    'Element created'
  );

  // We are on a Album Edit page.
  const location = await this.page.evaluate(() => window.location);
  expect(location.hash).to.match(new RegExp(`${routes.albums}/\\d+`));

  // Go to the Album Show page.
  const url = location.href + '/show';
  await this.page.goto(global.APP_ADDRESS + url);

  // Extract all the Album fields.
  const data = await this.readShowData();
  const links = await this.readShowLinks();
  this.setVariable(v, { data, links });
});
Then('the Album should be updated as {string}', async function(v) {
  // Success message.
  await this.page.waitForSelector(messageSel, { visibility: 'visible' });
  expect(await this.page.$(messageSel)).to.exist;
  expect(await this.page.$eval(messageSel, e => e.textContent)).to.include(
    'Element updated'
  );

  // Go to the Album Show page.
  const id = this.albumUpdateStatus;
  const url = `${routes.albums}/${id}/show`;
  await this.page.goto(global.APP_ADDRESS + url);

  // Extract all the Album fields.
  const data = await this.readShowData();
  const links = await this.readShowLinks();
  this.setVariable(v, { data, links });
});
Then('the Album should be replaced as {string}', async function(v) {
  // Success message.
  await this.page.waitForSelector(messageSel, { visibility: 'visible' });
  expect(await this.page.$(messageSel)).to.exist;
  expect(await this.page.$eval(messageSel, e => e.textContent)).to.include(
    'Element updated'
  );

  // Go to the Album Show page.
  const id = this.albumReplaceStatus;
  const url = `${routes.albums}/${id}/show`;
  await this.page.goto(global.APP_ADDRESS + url);

  // Extract all the Album fields.
  const data = await this.readShowData();
  const links = await this.readShowLinks();
  this.setVariable(v, { data, links });
});
Then('the Album should not be created', async function() {
  expect(this.albumCreationStatus).to.be.false;
});

Then('the Album {string} should equal the Album {string}', async function(
  v1,
  v2
) {
  const { data: album1 } = this.getVariable(v1);
  const { data: album2 } = this.getVariable(v2);
  expect(album1)
    .excluding('Id')
    .to.deep.equal(album2);
});
Then('the Album {string} should include the Album {string}', async function(
  v1,
  v2
) {
  const { data: album1 } = this.getVariable(v1);
  const { data: album2 } = this.getVariable(v2);
  expect(album1).to.include(album2);
});

// Album Ids
Given('an existing Album Id {string}', async function(v) {
  await this.page.goto(global.APP_ADDRESS + getAlbumListUrl(this));
  await this.page.waitForSelector(progressBarSel, { visibility: 'hidden' });
  const albums = await getAlbumList(this, getAlbumRowSel(this));
  this.setVariable(v, getRandomElement(albums).id);
});
Given('an existing public Album Id {string}', async function(v) {
  await this.page.goto(global.APP_ADDRESS + getAlbumListUrl(this));
  await this.page.waitForSelector(progressBarSel, { visibility: 'hidden' });
  const albums = await getAlbumList(this, getAlbumRowSel(this));
  this.setVariable(
    v,
    getRandomElement(albums.filter(album => album.type === 'PUBLIC')).id
  );
});
Given('an existing restricted Album Id {string}', async function(v) {
  await this.page.goto(global.APP_ADDRESS + getAlbumListUrl(this));
  await this.page.waitForSelector(progressBarSel, { visibility: 'hidden' });
  const albums = await getAlbumList(this, getAlbumRowSel(this));
  this.setVariable(
    v,
    getRandomElement(albums.filter(album => album.type === 'RESTRICTED')).id
  );
});
Given('an existing private Album Id {string}', async function(v) {
  await this.page.goto(global.APP_ADDRESS + getAlbumListUrl(this));
  await this.page.waitForSelector(progressBarSel, { visibility: 'hidden' });
  const albums = await getAlbumList(this, getAlbumRowSel(this));
  this.setVariable(
    v,
    getRandomElement(albums.filter(album => album.type === 'PRIVATE')).id
  );
});
Given('an unknown Album Id {string}', function(v) {
  this.setVariable(v, 9999);
});
Given('the Album Id {string} of the Album {string}', function(v1, v2) {
  const { data: album } = this.getVariable(v2);
  this.setVariable(v1, album['Id']);
});
Given('the User Id {string} of the Album {string}', function(v1, v2) {
  const { links } = this.getVariable(v2);
  if (links && links['User']) {
    const url = links['User'].url;
    const id = url.replace(routes.users, '').slice(1);
    this.setVariable(v1, id);
  }
});
