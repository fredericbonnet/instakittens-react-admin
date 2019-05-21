/**
 * TestCafé startup code.
 *
 * As TestCafe does not support asynchronous test generation, we must run a
 * Cucumber scenario discovery pass before starting the TestCafé runner.
 *
 * The discovered tests are stored in the *global.cucumberTestCases* variable
 * for later use in *cucumber.test.js*.
 */
const createTestCafe = require('testcafe');

const { discoverCucumberTests } = require('./testcafe-cucumber-runner');

/** Command line arguments. */
const [, , ...args] = process.argv;
const live = args.includes('--live') || args.includes('-L');

/** Cucumber CLI arguments. */
const cucumberArgs = ['features/**/*.feature'];

discoverCucumberTests(__dirname, cucumberArgs)
  .then(testCases => {
    // Store discovered tests for later use.
    global.cucumberTestCases = testCases;

    // Run TestCafé.
    let testcafe = null;
    return createTestCafe()
      .then(tc => {
        testcafe = tc;
        if (live) {
          // Create a live runner and override some settings for development.
          const liveRunner = testcafe.createLiveModeRunner();
          return liveRunner
            .browsers('chrome')
            .concurrency(1)
            .run();
        } else {
          // Create a regular runner with settings from the config file.
          const runner = testcafe.createRunner();
          return runner.run();
        }
      })
      .then(async failedCount => {
        await testcafe.close();
        return failedCount ? 1 : 0;
      });
  })
  .then(code => {
    process.exit(code);
  });
