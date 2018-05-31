/* eslint-env node */

'use strict';

module.exports = {
    extends: 'recommended',

    rules: {
        'block-indentation': 4,
        'bare-strings': true,
        'nested-interactive': false,
    },

    ignore: [
        '**/lib/handbook/**/*',
    ],
};
