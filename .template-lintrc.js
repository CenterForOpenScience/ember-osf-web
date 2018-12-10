/* eslint-env node */

'use strict';

module.exports = {
    extends: 'recommended',

    rules: {
        'block-indentation': 4,
        'no-bare-strings': true,
        'no-implicit-this': { allow: ['data-test-'] },
        'no-nested-interactive': true,
    },

    ignore: [
        '**/lib/handbook/**/*',
    ],
};
