module.exports = {
  preset: 'jest-puppeteer',
  verbose: true, // Will output test list at the end
  globals: {
    SERVER_ADDRESS: 'http://localhost:3000/',
    APP_ADDRESS: 'http://localhost:3001/',
  },
};
