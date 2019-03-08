/// <reference path="../../steps.d.ts" />

// const I = actor();
/** @type {CodeceptJS.I} */
const I = require('../../steps')();

const routes = require('../../routes.json');

const { getRandomElement } = require('./utils');

// Selectors
const photoReferenceListSel = '[data-testid=photo-reference-list]';
const rowSel = '.datagrid-body tr';
const idColumnSel = '.column-id';
const typeColumnSel = '.column-type';
const createButtonSel = `[href="${routes.photos}/create"]`;
const saveButtonSel = 'button[class*="SaveButton-"]';
const deleteButtonSel = 'button.ra-delete-button';
const messageSel = `[class*="SnackbarContent-message"]`;
const progressBarSel = '[role=progressbar]';
const headerSel = 'header';

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
async function getPhotoList(sel) {
  I.waitForElement(sel);
  const photos = await I.executeScript(
    (sel, idColumnSel, typeColumnSel) => {
      const photos = [];
      for (let row of document.querySelectorAll(sel)) {
        const id = row.querySelector(idColumnSel).textContent;
        photos.push({ id });
      }
      return photos;
    },
    sel,
    idColumnSel,
    typeColumnSel
  );
  return photos;
}

// Photo list
When('I get the Photo list', async () => {
  const world = await I.getWorld();
  I.amOnPage(getPhotoListUrl(world));
});

Then('I should get the complete Photo list', async () => {
  const world = await I.getWorld();
  const location = new URL(await I.grabCurrentUrl());
  expect(location.hash).to.equal(getPhotoListUrl(world));
  expect(location.search).to.equal('');
});

// Photos
Given('a new Photo {string}', async v => {
  const world = await I.getWorld();
  const data = { Title: 'Test photo' };
  world.setVariable(v, { data });
});

When('I get the Photo {string}', async v => {
  const world = await I.getWorld();
  const id = world.getVariable(v);
  const url = `${routes.photos}/${id}/show`;
  I.amOnPage(url);
});
When('I create the Photo {string}', async v => {
  const world = await I.getWorld();
  const { data } = world.getVariable(v);
  if (data['Id']) {
    // Don't create photos with an ID.
    // Remember creation status.
    world.photoCreationStatus = false;
    return;
  }

  // Go to the Photo List page and click the Create button.
  I.amOnPage(getPhotoListUrl(world));
  I.click(createButtonSel);

  // Ensure that page is fully loaded.
  I.waitForInvisible(progressBarSel);

  // Fill and save the form.
  await I.writeEditData({ ...data, ...world.getParentData() });
  I.click(saveButtonSel);
  world.photoCreationStatus = true;
});
When('I update the Photo {string} with {string}', async (v1, v2) => {
  const world = await I.getWorld();
  const id = world.getVariable(v1);
  const { data } = world.getVariable(v2);

  // Go to the Photo Edit page.
  const url = `${routes.photos}/${id}`;
  I.amOnPage(url);

  // Check that we're really on the edit page before proceeding.
  if (!(await I.grabNumberOfVisibleElements(saveButtonSel))) return;

  // Ensure that page is fully loaded.
  I.waitForInvisible(progressBarSel);

  // Fill and save the form.
  await I.writeEditData({ ...data, ...world.getParentData() });
  I.click(saveButtonSel);
  world.photoUpdateStatus = id;
});
When('I replace the Photo {string} with {string}', async (v1, v2) => {
  const world = await I.getWorld();
  const id = world.getVariable(v1);
  const { data } = world.getVariable(v2);

  // Go to the Photo Edit page.
  const url = `${routes.photos}/${id}`;
  I.amOnPage(url);

  // Check that we're really on the edit page before proceeding.
  if (!(await I.grabNumberOfVisibleElements(saveButtonSel))) return;

  // Ensure that page is fully loaded.
  I.waitForInvisible(progressBarSel);

  // Fill and save the form.
  await I.writeEditData({ ...data, ...world.getParentData() }, true);
  I.click(saveButtonSel);
  world.photoReplaceStatus = id;
});
When('I delete the Photo {string}', async v => {
  const world = await I.getWorld();
  const id = world.getVariable(v);

  // Go to the Photo Edit page.
  const url = `${routes.photos}/${id}`;
  I.amOnPage(url);

  // Check that we're really on the edit page before proceeding.
  if (!(await I.grabNumberOfVisibleElements(deleteButtonSel))) return;

  I.click(deleteButtonSel);
});

Then('I should get the Photo {string}', async v => {
  const world = await I.getWorld();
  const data = await I.readShowData();
  const links = await I.readShowLinks();
  world.setVariable(v, { data, links });
});
Then('the Photo should be created as {string}', async v => {
  const world = await I.getWorld();

  // Success message.
  I.see('Element created', messageSel);
  I.click(headerSel);

  // We are on a Photo Edit page.
  const location = new URL(await I.grabCurrentUrl());
  expect(location.hash).to.match(new RegExp(`${routes.photos}/\\d+`));

  // Go to the Photo Show page.
  const url = location.href + '/show';
  I.amOnPage(url);

  // Extract all the Photo fields.
  const data = await I.readShowData();
  const links = await I.readShowLinks();
  world.setVariable(v, { data, links });
});
Then('the Photo should be updated as {string}', async v => {
  const world = await I.getWorld();

  // Success message.
  I.see('Element updated', messageSel);
  I.click(headerSel);

  // Go to the Photo Show page.
  const id = world.photoUpdateStatus;
  const url = `${routes.photos}/${id}/show`;
  I.amOnPage(url);

  // Extract all the Photo fields.
  const data = await I.readShowData();
  const links = await I.readShowLinks();
  world.setVariable(v, { data, links });
});
Then('the Photo should be replaced as {string}', async v => {
  const world = await I.getWorld();

  // Success message.
  I.see('Element updated', messageSel);
  I.click(headerSel);

  // Go to the Photo Show page.
  const id = world.photoReplaceStatus;
  const url = `${routes.photos}/${id}/show`;
  I.amOnPage(url);

  // Extract all the Photo fields.
  const data = await I.readShowData();
  const links = await I.readShowLinks();
  world.setVariable(v, { data, links });
});
Then('the Photo should not be created', async () => {
  const world = await I.getWorld();
  expect(world.photoCreationStatus).to.be.false;
});

Then('the Photo {string} should equal the Photo {string}', async (v1, v2) => {
  const world = await I.getWorld();
  const { data: photo1 } = world.getVariable(v1);
  const { data: photo2 } = world.getVariable(v2);
  expect(photo1)
    .excluding('Id')
    .to.deep.equal(photo2);
});
Then('the Photo {string} should include the Photo {string}', async (v1, v2) => {
  const world = await I.getWorld();
  const { data: photo1 } = world.getVariable(v1);
  const { data: photo2 } = world.getVariable(v2);
  expect(photo1).to.include(photo2);
});

// Photo Ids
Given('an existing Photo Id {string}', async v => {
  const world = await I.getWorld();
  I.amOnPage(getPhotoListUrl(world));
  const photos = await getPhotoList(getPhotoRowSel(world));
  world.setVariable(v, getRandomElement(photos).id);
});
Given('an unknown Photo Id {string}', async v => {
  const world = await I.getWorld();
  world.setVariable(v, 9999);
});
Given('the Photo Id {string} of the Photo {string}', async (v1, v2) => {
  const world = await I.getWorld();
  const { data: photo } = world.getVariable(v2);
  world.setVariable(v1, photo['Id']);
});
Given('the Album Id {string} of the Photo {string}', async (v1, v2) => {
  const world = await I.getWorld();
  const { links } = world.getVariable(v2);
  if (links && links['Album']) {
    const url = links['Album'].url;
    const id = url.replace(routes.albums, '').slice(1);
    world.setVariable(v1, id);
  }
});
