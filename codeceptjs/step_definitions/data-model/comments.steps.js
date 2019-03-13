/// <reference path="../../steps.d.ts" />

/** @type {CodeceptJS.I} */
const I = require('../../steps')();

const routes = require('../../routes.json');

const { getRandomElement } = require('./utils');

// Selectors
const commentReferenceListSel = '[data-testid=comment-reference-list]';
const rowSel = '.datagrid-body tr';
const idColumnSel = '.column-id';
const typeColumnSel = '.column-type';
const createButtonSel = `[href="${routes.comments}/create"]`;
const saveButtonSel = 'button[class*="SaveButton-"]';
const deleteButtonSel = 'button.ra-delete-button';
const messageSel = `[class*="SnackbarContent-message"]`;
const progressBarSel = '[role=progressbar]';
const headerSel = 'header';

/** Get URL of Comment List page. */
function getCommentListUrl(world) {
  const root = world.getRoot();
  let url;
  if (root) {
    // Parent's Comments tab.
    url = `${root}/comments`;
  } else {
    // Main Comment List page.
    url = routes.comments;
  }
  return url;
}

/** Get selector of Comment List rows */
function getCommentRowSel(world) {
  const root = world.getRoot();
  if (root) {
    // Parent's Comments tab.
    return commentReferenceListSel + ' ' + rowSel;
  } else {
    // Main Comment List page.
    return rowSel;
  }
}

/** Get list of Comments */
async function getCommentList(sel) {
  I.waitForElement(sel);
  const comments = await I.executeScript(
    (sel, idColumnSel, typeColumnSel) => {
      const comments = [];
      for (let row of document.querySelectorAll(sel)) {
        const id = row.querySelector(idColumnSel).textContent;
        comments.push({ id });
      }
      return comments;
    },
    sel,
    idColumnSel,
    typeColumnSel
  );
  return comments;
}

// Comment list
When('I get the Comment list', async () => {
  const world = await I.getWorld();
  I.amOnPage(getCommentListUrl(world));
});

Then('I should get the complete Comment list', async () => {
  const world = await I.getWorld();
  const location = new URL(await I.grabCurrentUrl());
  expect(location.hash).to.equal(getCommentListUrl(world));
  expect(location.search).to.equal('');
});

// Comments
Given('a new Comment {string}', async v => {
  const world = await I.getWorld();
  const data = { Message: 'Test comment' };
  world.setVariable(v, { data });
});

When('I get the Comment {string}', async v => {
  const world = await I.getWorld();
  const id = world.getVariable(v);
  const url = `${routes.comments}/${id}/show`;
  I.amOnPage(url);
});
When('I create the Comment {string}', async v => {
  const world = await I.getWorld();
  const { data } = world.getVariable(v);
  if (data['Id']) {
    // Don't create comments with an ID.
    // Remember creation status.
    world.commentCreationStatus = false;
    return;
  }

  // Go to the Comment List page and click the Create button.
  I.amOnPage(getCommentListUrl(world));
  I.click(createButtonSel);

  // Ensure that page is fully loaded.
  I.waitForInvisible(progressBarSel);

  // Fill and save the form.
  await I.writeEditData({ ...data, ...world.getParentData() });
  I.click(saveButtonSel);
  world.commentCreationStatus = true;
});
When('I update the Comment {string} with {string}', async (v1, v2) => {
  const world = await I.getWorld();
  const id = world.getVariable(v1);
  const { data } = world.getVariable(v2);

  // Go to the Comment Edit page.
  const url = `${routes.comments}/${id}`;
  I.amOnPage(url);

  // Check that we're really on the edit page before proceeding.
  if (!(await I.grabNumberOfVisibleElements(saveButtonSel))) return;

  // Ensure that page is fully loaded.
  I.waitForInvisible(progressBarSel);

  // Fill and save the form.
  await I.writeEditData({ ...data, ...world.getParentData() });
  I.click(saveButtonSel);
  world.commentUpdateStatus = id;
});
When('I replace the Comment {string} with {string}', async (v1, v2) => {
  const world = await I.getWorld();
  const id = world.getVariable(v1);
  const { data } = world.getVariable(v2);

  // Go to the Comment Edit page.
  const url = `${routes.comments}/${id}`;
  I.amOnPage(url);

  // Check that we're really on the edit page before proceeding.
  if (!(await I.grabNumberOfVisibleElements(saveButtonSel))) return;

  // Ensure that page is fully loaded.
  I.waitForInvisible(progressBarSel);

  // Fill and save the form.
  await I.writeEditData({ ...data, ...world.getParentData() }, true);
  I.click(saveButtonSel);
  world.commentReplaceStatus = id;
});
When('I delete the Comment {string}', async v => {
  const world = await I.getWorld();
  const id = world.getVariable(v);

  // Go to the Comment Edit page.
  const url = `${routes.comments}/${id}`;
  I.amOnPage(url);

  // Check that we're really on the edit page before proceeding.
  if (!(await I.grabNumberOfVisibleElements(deleteButtonSel))) return;

  I.click(deleteButtonSel);
});

Then('I should get the Comment {string}', async v => {
  const world = await I.getWorld();
  const data = await I.readShowData();
  const links = await I.readShowLinks();
  world.setVariable(v, { data, links });
});
Then('the Comment should be created as {string}', async v => {
  const world = await I.getWorld();

  // Success message.
  I.see('Element created', messageSel);
  I.click(headerSel);

  // We are on a Comment Edit page.
  const location = new URL(await I.grabCurrentUrl());
  expect(location.hash).to.match(new RegExp(`${routes.comments}/\\d+`));

  // Go to the Comment Show page.
  const url = location.href + '/show';
  I.amOnPage(url);

  // Extract all the Comment fields.
  const data = await I.readShowData();
  const links = await I.readShowLinks();
  world.setVariable(v, { data, links });
});
Then('the Comment should be updated as {string}', async v => {
  const world = await I.getWorld();

  // Success message.
  I.see('Element updated', messageSel);
  I.click(headerSel);

  // Go to the Comment Show page.
  const id = world.commentUpdateStatus;
  const url = `${routes.comments}/${id}/show`;
  I.amOnPage(url);

  // Extract all the Comment fields.
  const data = await I.readShowData();
  const links = await I.readShowLinks();
  world.setVariable(v, { data, links });
});
Then('the Comment should be replaced as {string}', async v => {
  const world = await I.getWorld();

  // Success message.
  I.see('Element updated', messageSel);
  I.click(headerSel);

  // Go to the Comment Show page.
  const id = world.commentReplaceStatus;
  const url = `${routes.comments}/${id}/show`;
  I.amOnPage(url);

  // Extract all the Comment fields.
  const data = await I.readShowData();
  const links = await I.readShowLinks();
  world.setVariable(v, { data, links });
});
Then('the Comment should not be created', async () => {
  const world = await I.getWorld();
  expect(world.commentCreationStatus).to.be.false;
});

Then(
  'the Comment {string} should equal the Comment {string}',
  async (v1, v2) => {
    const world = await I.getWorld();
    const { data: comment1 } = world.getVariable(v1);
    const { data: comment2 } = world.getVariable(v2);
    expect(comment1)
      .excluding('Id')
      .to.deep.equal(comment2);
  }
);
Then(
  'the Comment {string} should include the Comment {string}',
  async (v1, v2) => {
    const world = await I.getWorld();
    const { data: comment1 } = world.getVariable(v1);
    const { data: comment2 } = world.getVariable(v2);
    expect(comment1).to.include(comment2);
  }
);

// Comment Ids
Given('an existing Comment Id {string}', async v => {
  const world = await I.getWorld();
  I.amOnPage(getCommentListUrl(world));
  const comments = await getCommentList(getCommentRowSel(world));
  world.setVariable(v, getRandomElement(comments).id);
});
Given('an unknown Comment Id {string}', async v => {
  const world = await I.getWorld();
  world.setVariable(v, 9999);
});
Given('the Comment Id {string} of the Comment {string}', async (v1, v2) => {
  const world = await I.getWorld();
  const { data: comment } = world.getVariable(v2);
  world.setVariable(v1, comment['Id']);
});
Given('the User Id {string} of the Comment {string}', async (v1, v2) => {
  const world = await I.getWorld();
  const { links } = world.getVariable(v2);
  if (links && links['User']) {
    const url = links['User'].url;
    const id = url.replace(routes.users, '').slice(1);
    world.setVariable(v1, id);
  }
});
Given('the Photo Id {string} of the Comment {string}', async (v1, v2) => {
  const world = await I.getWorld();
  const { links } = world.getVariable(v2);
  if (links && links['Photo']) {
    const url = links['Photo'].url;
    const id = url.replace(routes.photos, '').slice(1);
    world.setVariable(v1, id);
  }
});
