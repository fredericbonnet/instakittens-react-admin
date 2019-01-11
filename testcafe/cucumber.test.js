/**
 * Entry point for Cucumber tests.
 *
 * Note: as TestCafe does not support asynchronous test generation, all Cucumber scenarios are executed
 * in the same context. If you need isolated execution then you can call this runner from several TestCafé
 * tests or fixtures, and filter the scenarios using extra CLi arguments such as tags or glob patterns.
 */
import {} from 'testcafe';

const testcafeCucumberRunner = require('./testcafe-cucumber-runner');

fixture(`Cucumber`);

test('Features', async t => {
  const success = await testcafeCucumberRunner(t, __dirname);
  if (!success) throw new Error('At least one scenario failed');
});
