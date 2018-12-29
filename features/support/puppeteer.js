/*
 * Puppeteer integration with Cucumber-js.
 */
const puppeteer = require('puppeteer');
const { BeforeAll, Before, After, AfterAll } = require('cucumber');

// Create a global browser for the test session.
BeforeAll({ timeout: 10000 }, async function() {
  global.browser = await puppeteer.launch({ headless: true });
});
AfterAll(async function() {
  await global.browser.close();
});

// Create a new incognito context and page for each scenario.
Before({ timeout: 10000 }, async function() {
  this.context = await global.browser.createIncognitoBrowserContext();
  this.page = await this.context.newPage();
});
After(async function() {
  await this.page.close();
  await this.context.close();
});
