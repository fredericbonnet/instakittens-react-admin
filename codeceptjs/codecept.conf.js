const glob = require('glob');

exports.config = {
  output: './output',
  helpers: {
    Puppeteer: {
      url: 'http://localhost:3001',
      restart: false,
      keepBrowserState: false,
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
  plugins: {
    screenshotOnFail: {
      enabled: true,
    },
  },
  tests: './**/*_test.js',
  name: 'instakittens-react-admin',
};
