const ADMIN = 'admin';
const READ = 'read';
const WRITE = 'write';

/**
 * @module ember-osf
 * @submodule const
 */

/**
 * @class permissions
 */

/**
 * Provide human-readable labels for permissions fields. Useful in dropdown UI.
 * @property permissionSelector
 * @final
 * @type {Object[]}
 */
// TODO: Document constants in YUIDoc format
const permissionSelector = [
    { value: READ, text: 'Read' },
    { value: WRITE, text: 'Read + Write' },
    { value: ADMIN, text: 'Administrator' },
];

export default {
    ADMIN,
    READ,
    WRITE,
    PERMISSIONS: [READ, WRITE, ADMIN],
    CREATOR_PERMISSIONS: [READ, WRITE, ADMIN],
    DEFAULT_CONTRIBUTOR_PERMISSIONS: [READ, WRITE],
};

export { permissionSelector };
