const { Given } = require('cucumber');

const routes = require('../../../routes.json');

const { getRandomElement } = require('./utils');

// Selectors
const rowSel = '.datagrid-body tr';
const userLinkSel = '.column-user_id a';
const typeColumnSel = '.column-type';

/** Get list of Albums with user link and type */
async function getAlbumList(world) {
  // Note: using eval is much faster than iterating on Selector with .count
  // and .nth
  const albums = await world.eval(
    () => {
      const albums = [];
      for (let row of document.querySelectorAll(rowSel)) {
        const url = row.querySelector(userLinkSel).getAttribute('href');
        const type = row.querySelector(typeColumnSel).textContent;
        albums.push({ url, type });
      }
      return albums;
    },
    { dependencies: { rowSel, userLinkSel, typeColumnSel } }
  );
  return albums;
}

Given('a User Id {string} with albums', async function(v) {
  // Get full album list.
  await this.t.navigateTo(global.APP_ADDRESS + routes.albums + '?perPage=1000');
  const albums = await getAlbumList(this);

  // Reset page size to avoid slowdowns in further navigation steps (most likely
  // a bug in React-Admin). For example:
  //
  // 1. get the album list with perPage=1000
  // 2. navigate to an unknown album, e.g. albums/9999/show
  //
  // Step #2 will redirect to the main list, but the REST call is incorrect and
  // the page is very long to refresh, triggering the Cucumber step timeout.
  await this.t.navigateTo(global.APP_ADDRESS + routes.albums + '?perPage=10');

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
  this.setVariable(v, user);
});

Given('I open the User {string}', async function(v) {
  const { data } = this.getVariable(v);
  const url = `${routes.users}/${data['Id']}`;
  this.setParent('User', { id: data['Username'], data, url });
});
Given('I open the Album {string}', function(v) {
  const { data } = this.getVariable(v);
  const url = `${routes.albums}/${data['Id']}`;
  this.setParent('Album', { id: data['Title'], data, url });
});
Given('I open the Photo {string}', function(v) {
  const { data } = this.getVariable(v);
  const url = `${routes.photos}/${data['Id']}`;
  this.setParent('Photo', { id: data['Title'], data, url });
});
