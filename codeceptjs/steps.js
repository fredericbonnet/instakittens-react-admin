// in this file you can append custom step methods to 'I' object
const accounts = require('./test-accounts.json');
const routes = require('./routes.json');

// Selectors
const fieldSel = '.ra-field';
const inputSel = '.ra-input';

module.exports = function() {
  return actor({
    // Define custom steps here, use 'this' to access default methods of I.
    // It is recommended to place a general 'login' function here.

    /**
     * Log into the app.
     *
     * When *useForm* is true, use the app's login form.
     *
     * When *useForm* is false. the behavior of this function depends on the actual
     * implementation of the authorization provider. A side effect is that the app
     * isn't redirected to the Home Page automatically after login like the form does.
     *
     * @param {string} username Username.
     * @param {string} password Password.
     * @param {useForm} full Whether to use the login form.
     */
    login: function(username, password, useForm) {
      if (useForm) {
        //
        // "Slow" mode : use the login form.
        //

        // Selectors.
        const loginFormSel = '[class^="Login-main-"]';
        const usernameInputSel = `${loginFormSel} input[name=username]`;
        const passwordInputSel = `${loginFormSel} input[name=password]`;
        const loginSubmitButtonSel = `${loginFormSel} button[type=submit]`;

        // Login as user.
        this.amOnPage(routes.login);
        this.fillField(usernameInputSel, username);
        this.fillField(passwordInputSel, password);
        this.click(loginSubmitButtonSel);
      } else {
        //
        // "Fast" mode: simulate a successful login.
        //

        const account = accounts.find(
          account =>
            account.username === username && account.password === password
        );

        this.amOnPage(routes.login);
        this.waitForFunction(
          account => {
            /** Local storage key for Authorization HTTP header */
            const AUTHORIZATION_HEADER_KEY = 'instakittens-auth-basic-header';

            /** Local storage key for user role */
            const USER_ROLE_KEY = 'instakittens-user-role';

            // Build & store authorization header.
            const authorization =
              'Basic ' + btoa(account.username + ':' + account.password);
            localStorage.setItem(AUTHORIZATION_HEADER_KEY, authorization);

            // Store user role.
            localStorage.setItem(USER_ROLE_KEY, account.role);
            return true;
          },
          [account]
        );
      }
    },

    /*
     * Show/Edit page utilities.
     *
     * Note: don't declare async functions directly, as CodeceptJS Typescript definition
     * generator won't detect them properly. Return promises instead.
     */

    /** Read data from Show pages */
    readShowData: function() {
      return this.executeScript(fieldSel => {
        const data = {};
        for (let field of document.querySelectorAll(fieldSel)) {
          const labelEl = field.querySelector('label');
          if (!labelEl) continue;
          const label = labelEl.textContent;
          const value = field.querySelector('label + *').textContent;
          if (value && value !== 'Invalid Date') data[label] = value; // FIXME date fields may have a transient error message when null
        }
        return data;
      }, fieldSel);
    },

    /** Read links from Show pages */
    readShowLinks: function() {
      return this.executeScript(fieldSel => {
        const links = {};
        for (let field of document.querySelectorAll(fieldSel)) {
          const labelEl = field.querySelector('label');
          if (!labelEl) continue;
          const link = field.querySelector('a');
          if (link) {
            const label = labelEl.textContent;
            const value = field.querySelector('label + *').textContent;
            const url = link.getAttribute('href');
            links[label] = { value, url };
          }
        }
        return links;
      }, fieldSel);
    },

    /**
     * Write data to Edit pages
     *
     * @param data Data to write
     * @param replace Replace flag: if true, clear all inputs
     */
    writeEditData: function(data, replace) {
      return this.grabTextFrom(inputSel + ' label').then(async labels => {
        for (let label of labels) {
          if (label && label !== 'Id' && (replace || data[label])) {
            const locator = locate('input').inside(
              locate(inputSel).withText(label)
            );
            const value = await this.grabValueFrom(locator);
            if (value !== data[label]) {
              if (data[label]) {
                this.clearField(locator);
                this.fillField(locator, data[label]);
              } else {
                this.clearField(locator);
                this.pressKey(['Control', 'a']);
                this.pressKey('Delete');
                this.pressKey('Escape');
              }
            }
          }
        }
      });
    },
  });
};
