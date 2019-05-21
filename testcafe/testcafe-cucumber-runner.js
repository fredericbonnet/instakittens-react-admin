/*
 * Cucumber runner for TestCafé.
 */
const EventEmitter = require('events');
const {
  getTestCasesFromFilesystem,
  Cli,
  PickleFilter,
  Runtime,
} = require('cucumber');

/**
 * Discover Cucumber tests.
 *
 * The code is adapted from Cucumber's `Cli.run()`.
 *
 * @param {string} cwd Cucumber root directory with all features, step definitions and support files
 * @param {*[]} args Extra Cucumber CLI arguments (e.g. tags)
 *
 * @example Get tests for a specific feature file:
 * await discoverCucumberTests(t, cwd, ['features/example.feature'])
 *
 * @example Get tagged tests:
 * await discoverCucumberTests(t, cwd, ['--tags', '@tag1 and not @tag2'])
 */
async function discoverCucumberTests(cwd, args) {
  // Create `Cli` object.
  if (!args) args = [];
  const cli = new Cli({
    cwd,
    argv: [process.argv[0], '', ...args],
    stdout: process.stdout,
  });

  // Get configuration object.
  const configuration = await cli.getConfiguration();

  // Discover test cases.
  const eventBroadcaster = new EventEmitter();
  const testCases = await getTestCasesFromFilesystem({
    cwd,
    eventBroadcaster,
    featureDefaultLanguage: configuration.featureDefaultLanguage,
    featurePaths: configuration.featurePaths,
    order: configuration.order,
    pickleFilter: new PickleFilter(configuration.pickleFilterOptions),
  });

  return testCases;
}

/**
 * Cucumber runner for TestCafé.
 *
 * Executes all matching scenarios with the given test controller. The controller is passed as
 * the `World` parameter `t`.
 *
 * The code is adapted from Cucumber's `Cli.run()`.
 *
 * @param {TestController} t TestCafé test controller
 * @param {string} cwd Cucumber root directory with all features, step definitions and support files
 * @param {*[]} args Extra Cucumber CLI arguments (e.g. tags)
 *
 * @example Run a specific feature file:
 * await testcafeCucumberRunner(t, cmd, ['features/example.feature'])
 *
 * @example Run tagged features and scenarios:
 * await testcafeCucumberRunner(t, cwd, ['--tags', '@tag1 and not @tag2'])
 */
async function testcafeCucumberRunner(t, cwd, args) {
  // Create `Cli` object.
  if (!args) args = [];
  const cli = new Cli({
    cwd,
    argv: [process.argv[0], '', ...args],
    stdout: process.stdout,
  });

  // Get configuration object.
  const configuration = await cli.getConfiguration();

  // Clear require() cache for support files, useful with live reload (e.g. `testcafe-live`).
  // If we don't do this then Cucumber won't find step definitions in subsequent runs.
  for (let path of configuration.supportCodePaths) {
    delete require.cache[path];
  }

  // Initialize Cucumber stuff.
  const supportCodeLibrary = cli.getSupportCodeLibrary(configuration);
  const eventBroadcaster = new EventEmitter();
  const cleanup = await cli.initializeFormatters({
    eventBroadcaster,
    formatOptions: configuration.formatOptions,
    formats: configuration.formats,
    supportCodeLibrary,
  });

  // Discover test cases.
  const testCases = await getTestCasesFromFilesystem({
    cwd,
    eventBroadcaster,
    featureDefaultLanguage: configuration.featureDefaultLanguage,
    featurePaths: configuration.featurePaths,
    order: configuration.order,
    pickleFilter: new PickleFilter(configuration.pickleFilterOptions),
  });

  // Create runner, passing the test controller as `World` parameter.
  const runtime = new Runtime({
    eventBroadcaster,
    options: { ...configuration.runtimeOptions, worldParameters: { t } },
    supportCodeLibrary,
    testCases,
  });

  // Run all the tests and return result.
  const success = await runtime.start();
  await cleanup();
  return success;
}

module.exports = { discoverCucumberTests, testcafeCucumberRunner };
