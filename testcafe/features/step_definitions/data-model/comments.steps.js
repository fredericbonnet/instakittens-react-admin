const { Given, When, Then } = require('cucumber');

const routes = require('../../../routes.json');

const { getRandomElement } = require('./utils');

// Selectors
const commentReferenceListSel = '[data-testid=comment-reference-list]';
const rowSel = '.datagrid-body tr';
const idColumnSel = '.column-id';
const createButtonSel = `[href="${routes.comments}/create"]`;
const saveButtonSel = 'button[class*="SaveButton-"]';
const deleteButtonSel = 'button.ra-delete-button';
const messageSel = `[class*="SnackbarContent-message"]`;
const progressBarSel = '[role=progressbar]';

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
async function getCommentList(world, sel) {
  // Note: using eval is much faster than iterating on Selector with .count
  // and .nth
  const comments = await world.eval(
    () => {
      const comments = [];
      for (let row of document.querySelectorAll(sel)) {
        const id = row.querySelector(idColumnSel).textContent;
        comments.push({ id });
      }
      return comments;
    },
    { dependencies: { sel, idColumnSel } }
  );
  return comments;
}

// Comment list
When('I get the Comment list', async function() {
  await this.t.navigateTo(global.APP_ADDRESS + getCommentListUrl(this));
});

Then('I should get the complete Comment list', async function() {
  const location = await this.eval(() => window.location);
  await this.t.expect(location.hash).eql(getCommentListUrl(this));
  await this.t.expect(location.search).eql('');
});

// Comments
Given('a new Comment {string}', function(v) {
  const data = { Message: 'Test comment' };
  this.setVariable(v, { data });
});

When('I get the Comment {string}', async function(v) {
  const id = this.getVariable(v);
  const url = `${routes.comments}/${id}/show`;
  await this.t.navigateTo(global.APP_ADDRESS + url);
});
When('I create the Comment {string}', async function(v) {
  const { data } = this.getVariable(v);
  if (data['Id']) {
    // Don't create comments with an ID.
    // Remember creation status.
    this.commentCreationStatus = false;
    return;
  }

  // Go to the Comment List page and click the Create button.
  await this.t.navigateTo(global.APP_ADDRESS + getCommentListUrl(this));
  await this.t.click(this.Selector(createButtonSel));

  // Ensure that page is fully loaded.
  await this.t.expect(this.Selector(progressBarSel).exists).notOk();

  // Fill and save the form.
  await this.writeEditData({ ...data, ...this.getParentData() });
  await this.t.click(this.Selector(saveButtonSel));
  this.commentCreationStatus = true;
});
When('I update the Comment {string} with {string}', async function(v1, v2) {
  const id = this.getVariable(v1);
  const { data } = this.getVariable(v2);

  // Go to the Comment Edit page.
  const url = `${routes.comments}/${id}`;
  await this.t.navigateTo(global.APP_ADDRESS + url);

  // Check that we're really on the edit page before proceeding.
  if (!(await this.Selector(saveButtonSel).exists)) return;

  // Ensure that page is fully loaded.
  await this.t.expect(this.Selector(progressBarSel).exists).notOk();

  // Fill and save the form.
  await this.writeEditData({ ...data, ...this.getParentData() });
  await this.t.click(this.Selector(saveButtonSel));
  this.commentUpdateStatus = id;
});
When(
  'I replace the Comment {string} with {string}',
  { timeout: 10000 }, // FIXME writeEditData is slow
  async function(v1, v2) {
    const id = this.getVariable(v1);
    const { data } = this.getVariable(v2);

    // Go to the Comment Edit page.
    const url = `${routes.comments}/${id}`;
    await this.t.navigateTo(global.APP_ADDRESS + url);

    // Check that we're really on the edit page before proceeding.
    if (!(await this.Selector(saveButtonSel).exists)) return;

    // Ensure that page is fully loaded.
    await this.t.expect(this.Selector(progressBarSel).exists).notOk();

    // Fill and save the form.
    await this.writeEditData({ ...data, ...this.getParentData() }, true);
    await this.t.click(this.Selector(saveButtonSel));
    this.commentReplaceStatus = id;
  }
);
When('I delete the Comment {string}', async function(v) {
  const id = this.getVariable(v);

  // Go to the Comment Edit page.
  const url = `${routes.comments}/${id}`;
  await this.t.navigateTo(global.APP_ADDRESS + url);

  // Check that we're really on the edit page before proceeding.
  if (!(await this.Selector(deleteButtonSel).exists)) return;

  await this.t.click(this.Selector(deleteButtonSel));
});

Then('I should get the Comment {string}', async function(v) {
  const data = await this.readShowData();
  const links = await this.readShowLinks();
  this.setVariable(v, { data, links });
});
Then('the Comment should be created as {string}', async function(v) {
  // Success message.
  await this.t
    .expect(this.Selector(messageSel).withText('Element created').exists)
    .ok();

  // We are on a Comment Edit page.
  const location = await this.eval(() => window.location);
  await this.t
    .expect(location.hash)
    .match(new RegExp(`${routes.comments}/\\d+`));

  // Go to the Comment Show page.
  const url = location.href + '/show';
  await this.t.navigateTo(global.APP_ADDRESS + url);

  // Extract all the Comment fields.
  const data = await this.readShowData();
  const links = await this.readShowLinks();
  this.setVariable(v, { data, links });
});
Then('the Comment should be updated as {string}', async function(v) {
  // Success message.
  await this.t
    .expect(this.Selector(messageSel).withText('Element updated').exists)
    .ok();

  // Go to the Comment Show page.
  const id = this.commentUpdateStatus;
  const url = `${routes.comments}/${id}/show`;
  await this.t.navigateTo(global.APP_ADDRESS + url);

  // Extract all the Comment fields.
  const data = await this.readShowData();
  const links = await this.readShowLinks();
  this.setVariable(v, { data, links });
});
Then('the Comment should be replaced as {string}', async function(v) {
  // Success message.
  await this.t
    .expect(this.Selector(messageSel).withText('Element updated').exists)
    .ok();

  // Go to the Comment Show page.
  const id = this.commentReplaceStatus;
  const url = `${routes.comments}/${id}/show`;
  await this.t.navigateTo(global.APP_ADDRESS + url);

  // Extract all the Comment fields.
  const data = await this.readShowData();
  const links = await this.readShowLinks();
  this.setVariable(v, { data, links });
});
Then('the Comment should not be created', async function() {
  await this.t.expect(this.commentCreationStatus).notOk();
});

Then('the Comment {string} should equal the Comment {string}', async function(
  v1,
  v2
) {
  const {
    data: { Id: id1, ...comment1 },
  } = this.getVariable(v1);
  const {
    data: { Id: id2, ...comment2 },
  } = this.getVariable(v2);
  await this.t.expect(comment1).eql(comment2);
});
Then('the Comment {string} should include the Comment {string}', async function(
  v1,
  v2
) {
  const { data: comment1 } = this.getVariable(v1);
  const { data: comment2 } = this.getVariable(v2);
  await this.t.expect(comment1).contains(comment2);
});

// Comment Ids
Given('an existing Comment Id {string}', async function(v) {
  await this.t.navigateTo(global.APP_ADDRESS + getCommentListUrl(this));
  const comments = await getCommentList(this, getCommentRowSel(this));
  this.setVariable(v, getRandomElement(comments).id);
});
Given('an unknown Comment Id {string}', function(v) {
  this.setVariable(v, 9999);
});
Given('the Comment Id {string} of the Comment {string}', function(v1, v2) {
  const { data: comment } = this.getVariable(v2);
  this.setVariable(v1, comment['Id']);
});
Given('the User Id {string} of the Comment {string}', function(v1, v2) {
  const { links } = this.getVariable(v2);
  if (links && links['User']) {
    const url = links['User'].url;
    const id = url.replace(routes.users, '').slice(1);
    this.setVariable(v1, id);
  }
});
Given('the Photo Id {string} of the Comment {string}', function(v1, v2) {
  const { links } = this.getVariable(v2);
  if (links && links['Photo']) {
    const url = links['Photo'].url;
    const id = url.replace(routes.photos, '').slice(1);
    this.setVariable(v1, id);
  }
});
