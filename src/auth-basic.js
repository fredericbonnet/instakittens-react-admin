/**
 * Basic authentication client.
 */
import {
  fetchUtils,
  AUTH_LOGIN,
  AUTH_LOGOUT,
  AUTH_ERROR,
  AUTH_CHECK,
  AUTH_GET_PERMISSIONS,
} from 'react-admin';

/** Local storage key for Authorization HTTP header */
const AUTHORIZATION_HEADER_KEY = 'instakittens-auth-basic-header';

/** Local storage key for user role */
const USER_ROLE_KEY = 'instakittens-user-role';

/**
 * HTTP client used by data providers.
 *
 * This function adds the Authorization header to outgoing requests for logged in users.
 */
export function httpClient(url, options = {}) {
  if (!options.headers) {
    options.headers = new Headers({ Accept: 'application/json' });
  }
  const authorization = localStorage.getItem(AUTHORIZATION_HEADER_KEY);
  if (authorization) {
    options.headers.set('Authorization', authorization);
  }
  return fetchUtils.fetchJson(url, options);
}

/**
 * Authorization provider.
 *
 * @param {*} type
 * @param {*} params
 */
export function authProvider(type, params) {
  // Called when the user attempts to log in.
  if (type === AUTH_LOGIN) {
    // Build authorization header.
    const { username, password } = params;
    const authorization = 'Basic ' + btoa(username + ':' + password);

    // Issue a request to the /auth endpoint
    const request = new Request(process.env.REACT_APP_API_URL + '/auth', {
      method: 'GET',
      headers: new Headers({ Authorization: authorization }),
    });
    return fetch(request)
      .then(response => {
        if (response.status < 200 || response.status >= 300) {
          throw new Error(response.statusText);
        }

        // Store authorization header for later use by httpClient.
        localStorage.setItem(AUTHORIZATION_HEADER_KEY, authorization);

        return response.json();
      })
      .then(auth => {
        // Store user role for permissions.
        const { role } = auth;
        localStorage.setItem(USER_ROLE_KEY, role);
      });
  }

  // Called when the user clicks on the logout button.
  if (type === AUTH_LOGOUT) {
    localStorage.removeItem(AUTHORIZATION_HEADER_KEY);
    localStorage.removeItem(USER_ROLE_KEY);
    return Promise.resolve();
  }

  // Called when the API returns an error.
  if (type === AUTH_ERROR) {
    const status = params.status;
    if (status === 401 || status === 403) {
      localStorage.removeItem(AUTHORIZATION_HEADER_KEY);
      localStorage.removeItem(USER_ROLE_KEY);
      return Promise.reject();
    }
    return Promise.resolve();
  }

  // Called when the user navigates to a new location.
  if (type === AUTH_CHECK) {
    return localStorage.getItem(USER_ROLE_KEY) === 'admin'
      ? Promise.resolve()
      : Promise.reject();
  }

  // Called when a component requires to check the user’s permissions.
  if (type === AUTH_GET_PERMISSIONS) {
    const role = localStorage.getItem(USER_ROLE_KEY);
    return role ? Promise.resolve({ role }) : Promise.reject();
  }

  return Promise.reject('Unknown method');
}
