/// <reference path="../../steps.d.ts" />

// const I = actor();
/** @type {CodeceptJS.I} */
const I = require('../../steps')();

const routes = require('../../routes.json');

const { getRandomElement } = require('./utils');

// Selectors
const rowSel = '.datagrid-body tr';
const userLinkSel = '.column-user_id a';
const typeColumnSel = '.column-type';
const progressBarSel = '[role=progressbar]';

/** Get list of Albums with user link and type */
async function getAlbumList() {
  // Note: using eval is much faster than iterating on Selector with .count
  // and .nth
  const albums = await I.executeScript(
    (rowSel, userLinkSel, typeColumnSel) => {
      const albums = [];
      for (let row of document.querySelectorAll(rowSel)) {
        const url = row.querySelector(userLinkSel).getAttribute('href');
        const type = row.querySelector(typeColumnSel).textContent;
        albums.push({ url, type });
      }
      return albums;
    },
    rowSel,
    userLinkSel,
    typeColumnSel
  );
  return albums;
}

Given('a User Id {string} with albums', async v => {
  const world = await I.getWorld();

  // Get full album list.
  I.amOnPage(routes.albums + '?perPage=1000');
  I.waitForInvisible(progressBarSel, 5);
  const albums = await getAlbumList();

  // Reset page size to avoid slowdowns in further navigation steps (most likely
  // a bug in React-Admin). For example:
  //
  // 1. get the album list with perPage=1000
  // 2. navigate to an unknown album, e.g. albums/9999/show
  //
  // Step #2 will redirect to the main list, but the REST call is incorrect and
  // the page is very long to refresh, triggering the Cucumber step timeout.
  I.amOnPage(routes.albums + '?perPage=10');

  // Get list of users having all three types of albums.
  const typesPerUser = {};
  for (let { url, type } of albums) {
    const userId = url.replace(routes.users, '').slice(1);
    typesPerUser[userId] = [...(typesPerUser[userId] || []), type];
  }
  const users = Object.entries(typesPerUser)
    .filter(([userId, types]) => {
      return (
        types.includes('PUBLIC') &&
        types.includes('RESTRICTED') &&
        types.includes('PRIVATE')
      );
    })
    .map(([userId, types]) => userId);

  // Select a random user.
  const user = getRandomElement(users);
  world.setVariable(v, user);
});

Given('I open the User {string}', async v => {
  const world = await I.getWorld();
  const { data } = world.getVariable(v);
  const url = `${routes.users}/${data['Id']}`;
  world.setParent('User', { id: data['Username'], data, url });
});
Given('I open the Album {string}', async v => {
  const world = await I.getWorld();
  const { data } = world.getVariable(v);
  const url = `${routes.albums}/${data['Id']}`;
  world.setParent('Album', { id: data['Title'], data, url });
});
Given('I open the Photo {string}', async v => {
  const world = await I.getWorld();
  const { data } = world.getVariable(v);
  const url = `${routes.photos}/${data['Id']}`;
  world.setParent('Photo', { id: data['Title'], data, url });
});
