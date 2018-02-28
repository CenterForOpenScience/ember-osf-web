import Ember from 'ember';

/**
 * @module ember-osf-web
 * @submodule helpers
 */

/**
  * Return the username to display in the navbar. Shortens long usernames.
  *
  * @class getDisplayName
  * @param {String} username
  * @return {String} Username if less than 40 characters, otherwise, returns truncated username
  */
export function getDisplayName(params/* , hash */) {
    const name = params[0] || '';
    if (name.length > 40) {
        return `${name.slice(0, 20)}...${name.slice(-15)}`;
    }
    return name;
}

export default Ember.Helper.helper(getDisplayName);
