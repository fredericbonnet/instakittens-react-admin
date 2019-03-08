/*
 * Utilities.
 */

const accounts = require('./test-accounts.json');

/**
 * Get an account of the given role.
 *
 * @param role Account role (e.g. admin, user)
 */
function getAccount(role) {
  return accounts.find(account => account.role === role);
}

module.exports = { getAccount };
