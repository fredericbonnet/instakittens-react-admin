const glob = require('glob');

exports.config = {
  output: './output',
  helpers: {
    Puppeteer: {
      url: 'http://localhost:3001',
      restart: false,
      keepBrowserState: false,
      // show: true,
    },
    World: {
      require: './world_helper.js',
    },
  },
  include: {
    I: './steps.js',
  },
  mocha: {},
  require: glob.sync(__dirname + '/support/**/*.js'),
  bootstrap: null,
  teardown: null,
  hooks: [],
  gherkin: {
    features: './features/**/*.feature',
    steps: [
      './step_definitions/steps.js',
      ...glob.sync('./step_definitions/**/*.steps.js', { cwd: __dirname }),
    ],
  },
  plugins: {
    screenshotOnFail: {
      enabled: true,
    },
    retryFailedStep: {
      enabled: true,
    },
  },
  tests: './**/*_test.js',
  name: 'instakittens-react-admin',
  grep: 'Admin access : User ',
};
