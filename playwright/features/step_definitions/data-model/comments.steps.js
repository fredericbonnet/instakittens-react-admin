const { Given, When, Then } = require('cucumber');

const routes = require('../../../e2e/routes.json');

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
  const comments = await world.page.$$eval(
    sel,
    (rows, idColumnSel, typeColumnSel) => {
      const comments = [];
      for (let row of rows) {
        const id = row.querySelector(idColumnSel).textContent;
        comments.push({ id });
      }
      return comments;
    },
    idColumnSel
  );
  return comments;
}

// Comment list
When('I get the Comment list', async function() {
  await this.page.goto(global.APP_ADDRESS + getCommentListUrl(this));
  await this.page.waitForSelector(progressBarSel, { visibility: 'hidden' });
});

Then('I should get the complete Comment list', async function() {
  const location = await this.page.evaluate(() => window.location);
  expect(location.hash).to.equal(getCommentListUrl(this));
  expect(location.search).to.equal('');
});

// Comments
Given('a new Comment {string}', function(v) {
  const data = { Message: 'Test comment' };
  this.setVariable(v, { data });
});

When('I get the Comment {string}', async function(v) {
  const id = this.getVariable(v);
  const url = `${routes.comments}/${id}/show`;
  await this.page.goto(global.APP_ADDRESS + url);
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
  await this.page.goto(global.APP_ADDRESS + getCommentListUrl(this));
  await (await this.page.$(createButtonSel)).click();

  // Ensure that page is fully loaded.
  await this.page.waitForSelector(progressBarSel, { visibility: 'hidden' });

  // Fill and save the form.
  await this.writeEditData({ ...data, ...this.getParentData() });
  await (await this.page.$(saveButtonSel)).click();
  this.commentCreationStatus = true;
});
When('I update the Comment {string} with {string}', async function(v1, v2) {
  const id = this.getVariable(v1);
  const { data } = this.getVariable(v2);

  // Go to the Comment Edit page.
  const url = `${routes.comments}/${id}`;
  await this.page.goto(global.APP_ADDRESS + url);

  // Check that we're really on the edit page before proceeding.
  if (!(await this.page.$(saveButtonSel))) return;

  // Ensure that page is fully loaded.
  await this.page.waitForSelector(progressBarSel, { visibility: 'hidden' });

  // Fill and save the form.
  await this.writeEditData({ ...data, ...this.getParentData() });
  await (await this.page.$(saveButtonSel)).click();
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
    await this.page.goto(global.APP_ADDRESS + url);

    // Check that we're really on the edit page before proceeding.
    if (!(await this.page.$(saveButtonSel))) return;

    // Ensure that page is fully loaded.
    await this.page.waitForSelector(progressBarSel, { visibility: 'hidden' });

    // Fill and save the form.
    await this.writeEditData({ ...data, ...this.getParentData() }, true);
    await (await this.page.$(saveButtonSel)).click();
    this.commentReplaceStatus = id;
  }
);
When('I delete the Comment {string}', async function(v) {
  const id = this.getVariable(v);

  // Go to the Comment Edit page.
  const url = `${routes.comments}/${id}`;
  await this.page.goto(global.APP_ADDRESS + url);

  // Check that we're really on the edit page before proceeding.
  if (!(await this.page.$(saveButtonSel))) return;

  await (await this.page.$(deleteButtonSel)).click();
});

Then('I should get the Comment {string}', async function(v) {
  const data = await this.readShowData();
  const links = await this.readShowLinks();
  this.setVariable(v, { data, links });
});
Then('the Comment should be created as {string}', async function(v) {
  // Success message.
  await this.page.waitForSelector(messageSel, { visibility: 'visible' });
  expect(await this.page.$(messageSel)).to.exist;
  expect(await this.page.$eval(messageSel, e => e.textContent)).to.include(
    'Element created'
  );

  // We are on a Comment Edit page.
  const location = await this.page.evaluate(() => window.location);
  expect(location.hash).to.match(new RegExp(`${routes.comments}/\\d+`));

  // Go to the Comment Show page.
  const url = location.href + '/show';
  await this.page.goto(global.APP_ADDRESS + url);

  // Extract all the Comment fields.
  const data = await this.readShowData();
  const links = await this.readShowLinks();
  this.setVariable(v, { data, links });
});
Then('the Comment should be updated as {string}', async function(v) {
  // Success message.
  await this.page.waitForSelector(messageSel, { visibility: 'visible' });
  expect(await this.page.$(messageSel)).to.exist;
  expect(await this.page.$eval(messageSel, e => e.textContent)).to.include(
    'Element updated'
  );

  // Go to the Comment Show page.
  const id = this.commentUpdateStatus;
  const url = `${routes.comments}/${id}/show`;
  await this.page.goto(global.APP_ADDRESS + url);

  // Extract all the Comment fields.
  const data = await this.readShowData();
  const links = await this.readShowLinks();
  this.setVariable(v, { data, links });
});
Then('the Comment should be replaced as {string}', async function(v) {
  // Success message.
  await this.page.waitForSelector(messageSel, { visibility: 'visible' });
  expect(await this.page.$(messageSel)).to.exist;
  expect(await this.page.$eval(messageSel, e => e.textContent)).to.include(
    'Element updated'
  );

  // Go to the Comment Show page.
  const id = this.commentReplaceStatus;
  const url = `${routes.comments}/${id}/show`;
  await this.page.goto(global.APP_ADDRESS + url);

  // Extract all the Comment fields.
  const data = await this.readShowData();
  const links = await this.readShowLinks();
  this.setVariable(v, { data, links });
});
Then('the Comment should not be created', async function() {
  expect(this.commentCreationStatus).to.be.false;
});

Then('the Comment {string} should equal the Comment {string}', async function(
  v1,
  v2
) {
  const { data: comment1 } = this.getVariable(v1);
  const { data: comment2 } = this.getVariable(v2);
  expect(comment1)
    .excluding('Id')
    .to.deep.equal(comment2);
});
Then('the Comment {string} should include the Comment {string}', async function(
  v1,
  v2
) {
  const { data: comment1 } = this.getVariable(v1);
  const { data: comment2 } = this.getVariable(v2);
  expect(comment1).to.include(comment2);
});

// Comment Ids
Given('an existing Comment Id {string}', async function(v) {
  await this.page.goto(global.APP_ADDRESS + getCommentListUrl(this));
  await this.page.waitForSelector(progressBarSel, { visibility: 'hidden' });
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
