/// <reference path="../../steps.d.ts" />

// const I = actor();
/** @type {CodeceptJS.I} */
const I = require('../../steps')();

const routes = require('../../routes.json');

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
const headerSel = 'header';

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
async function getAlbumList(sel) {
  I.waitForElement(sel);
  const albums = await I.executeScript(
    (sel, idColumnSel, typeColumnSel) => {
      const albums = [];
      for (let row of document.querySelectorAll(sel)) {
        const id = row.querySelector(idColumnSel).textContent;
        const type = row.querySelector(typeColumnSel).textContent;
        albums.push({ id, type });
      }
      return albums;
    },
    sel,
    idColumnSel,
    typeColumnSel
  );
  return albums;
}

// Album list
When('I get the Album list', async () => {
  const world = await I.getWorld();
  I.amOnPage(getAlbumListUrl(world));
});

Then('I should get the complete Album list', async () => {
  const world = await I.getWorld();
  const location = new URL(await I.grabCurrentUrl());
  expect(location.hash).to.equal(getAlbumListUrl(world));
  expect(location.search).to.equal('');
});

// Albums
Given('a new Album {string}', async v => {
  const world = await I.getWorld();
  const data = { Title: 'Test album' };
  world.setVariable(v, { data });
});

When('I get the Album {string}', async v => {
  const world = await I.getWorld();
  const id = world.getVariable(v);
  const url = `${routes.albums}/${id}/show`;
  I.amOnPage(url);
});
When('I create the Album {string}', async v => {
  const world = await I.getWorld();
  const { data } = world.getVariable(v);
  if (data['Id']) {
    // Don't create albums with an ID.
    // Remember creation status.
    world.albumCreationStatus = false;
    return;
  }

  // Go to the Album List page and click the Create button.
  I.amOnPage(getAlbumListUrl(world));
  I.click(createButtonSel);

  // Ensure that page is fully loaded.
  I.waitForInvisible(progressBarSel);

  // Fill and save the form.
  await I.writeEditData({ ...data, ...world.getParentData() });
  I.click(saveButtonSel);
  world.albumCreationStatus = true;
});
When('I update the Album {string} with {string}', async (v1, v2) => {
  const world = await I.getWorld();
  const id = world.getVariable(v1);
  const { data } = world.getVariable(v2);

  // Go to the Album Edit page.
  const url = `${routes.albums}/${id}`;
  I.amOnPage(url);

  // Check that we're really on the edit page before proceeding.
  if (!(await I.grabNumberOfVisibleElements(saveButtonSel))) return;

  // Ensure that page is fully loaded.
  I.waitForInvisible(progressBarSel);

  // Fill and save the form.
  await I.writeEditData({ ...data, ...world.getParentData() });
  I.click(saveButtonSel);
  world.albumUpdateStatus = id;
});
When('I replace the Album {string} with {string}', async (v1, v2) => {
  const world = await I.getWorld();
  const id = world.getVariable(v1);
  const { data } = world.getVariable(v2);

  // Go to the Album Edit page.
  const url = `${routes.albums}/${id}`;
  I.amOnPage(url);

  // Check that we're really on the edit page before proceeding.
  if (!(await I.grabNumberOfVisibleElements(saveButtonSel))) return;

  // Ensure that page is fully loaded.
  I.waitForInvisible(progressBarSel);

  // Fill and save the form.
  await I.writeEditData({ ...data, ...world.getParentData() }, true);
  I.click(saveButtonSel);
  world.albumReplaceStatus = id;
});
When('I delete the Album {string}', async v => {
  const world = await I.getWorld();
  const id = world.getVariable(v);

  // Go to the Album Edit page.
  const url = `${routes.albums}/${id}`;
  I.amOnPage(url);

  // Check that we're really on the edit page before proceeding.
  if (!(await I.grabNumberOfVisibleElements(deleteButtonSel))) return;

  I.click(deleteButtonSel);
});

Then('I should get the Album {string}', async v => {
  const world = await I.getWorld();
  const data = await I.readShowData();
  const links = await I.readShowLinks();
  world.setVariable(v, { data, links });
});
Then('the Album should be created as {string}', async v => {
  const world = await I.getWorld();

  // Success message.
  I.see('Element created', messageSel);
  I.click(headerSel);

  // We are on a Album Edit page.
  const location = new URL(await I.grabCurrentUrl());
  expect(location.hash).to.match(new RegExp(`${routes.albums}/\\d+`));

  // Go to the Album Show page.
  const url = location.href + '/show';
  I.amOnPage(url);

  // Extract all the Album fields.
  const data = await I.readShowData();
  const links = await I.readShowLinks();
  world.setVariable(v, { data, links });
});
Then('the Album should be updated as {string}', async v => {
  const world = await I.getWorld();

  // Success message.
  I.see('Element updated', messageSel);
  I.click(headerSel);

  // Go to the Album Show page.
  const id = world.albumUpdateStatus;
  const url = `${routes.albums}/${id}/show`;
  I.amOnPage(url);

  // Extract all the Album fields.
  const data = await I.readShowData();
  const links = await I.readShowLinks();
  world.setVariable(v, { data, links });
});
Then('the Album should be replaced as {string}', async v => {
  const world = await I.getWorld();

  // Success message.
  I.see('Element updated', messageSel);
  I.click(headerSel);

  // Go to the Album Show page.
  const id = world.albumReplaceStatus;
  const url = `${routes.albums}/${id}/show`;
  I.amOnPage(url);

  // Extract all the Album fields.
  const data = await I.readShowData();
  const links = await I.readShowLinks();
  world.setVariable(v, { data, links });
});
Then('the Album should not be created', async () => {
  const world = await I.getWorld();
  expect(world.albumCreationStatus).to.be.false;
});

Then('the Album {string} should equal the Album {string}', async (v1, v2) => {
  const world = await I.getWorld();
  const { data: album1 } = world.getVariable(v1);
  const { data: album2 } = world.getVariable(v2);
  expect(album1)
    .excluding('Id')
    .to.deep.equal(album2);
});
Then('the Album {string} should include the Album {string}', async (v1, v2) => {
  const world = await I.getWorld();
  const { data: album1 } = world.getVariable(v1);
  const { data: album2 } = world.getVariable(v2);
  expect(album1).to.include(album2);
});

// Album Ids
Given('an existing Album Id {string}', async v => {
  const world = await I.getWorld();
  I.amOnPage(getAlbumListUrl(world));
  const albums = await getAlbumList(getAlbumRowSel(world));
  world.setVariable(v, getRandomElement(albums).id);
});
Given('an existing public Album Id {string}', async v => {
  const world = await I.getWorld();
  I.amOnPage(getAlbumListUrl(world));
  const albums = await getAlbumList(getAlbumRowSel(world));
  world.setVariable(
    v,
    getRandomElement(albums.filter(album => album.type === 'PUBLIC')).id
  );
});
Given('an existing restricted Album Id {string}', async v => {
  const world = await I.getWorld();
  I.amOnPage(getAlbumListUrl(world));
  const albums = await getAlbumList(getAlbumRowSel(world));
  world.setVariable(
    v,
    getRandomElement(albums.filter(album => album.type === 'RESTRICTED')).id
  );
});
Given('an existing private Album Id {string}', async v => {
  const world = await I.getWorld();
  I.amOnPage(getAlbumListUrl(world));
  const albums = await getAlbumList(getAlbumRowSel(world));
  world.setVariable(
    v,
    getRandomElement(albums.filter(album => album.type === 'PRIVATE')).id
  );
});
Given('an unknown Album Id {string}', async v => {
  const world = await I.getWorld();
  world.setVariable(v, 9999);
});
Given('the Album Id {string} of the Album {string}', async (v1, v2) => {
  const world = await I.getWorld();
  const { data: album } = world.getVariable(v2);
  world.setVariable(v1, album['Id']);
});
Given('the User Id {string} of the Album {string}', async (v1, v2) => {
  const world = await I.getWorld();
  const { links } = world.getVariable(v2);
  if (links && links['User']) {
    const url = links['User'].url;
    const id = url.replace(routes.users, '').slice(1);
    world.setVariable(v1, id);
  }
});
