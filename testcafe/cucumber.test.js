/**
 * Entry point for Cucumber tests.
 *
 * As TestCafe does not support asynchronous test generation, we must run a
 * Cucumber scenario discovery pass before starting the TestCafé runner. Each
 * scenario is then executed in its own TestCafé test with *testcafeCucumberRunner*.
 *
 * The discovered tests are expected in the *global.cucumberTestCases* variable
 * initialized in the startup code (*index.js*).
 */
import { testcafeCucumberRunner } from './testcafe-cucumber-runner';

/** Cucumber CLI arguments. */
const cucumberArgs = [
  '--format',
  'summary',
  // '--exit',
];

// Iterate over scenarios and group them by feature file.
if (global.cucumberTestCases) {
  let currentUri;
  for (let testCase of global.cucumberTestCases) {
    if (currentUri !== testCase.uri) {
      fixture(`Feature: ${testCase.uri}`);
      currentUri = testCase.uri;
    }

    const scenarioName = testCase.pickle.name;
    const scenarioLocation = `${testCase.uri}:${
      testCase.pickle.locations[0].line
    }`;
    test(`Scenario: ${scenarioName}`, async t => {
      const success = await testcafeCucumberRunner(t, __dirname, [
        ...cucumberArgs,
        scenarioLocation,
      ]);
      if (!success) throw new Error('Scenario failed');
    });
  }
}
