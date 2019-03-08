// in this file you can append custom step methods to 'I' object
const accounts = require('./test-accounts.json');
const routes = require('./routes.json');

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
  });
};
