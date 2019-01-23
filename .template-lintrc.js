/* eslint-env node */

'use strict';

module.exports = {
    extends: 'recommended',

    rules: {
        'block-indentation': 4,
        'no-bare-strings': true,
        'no-implicit-this': true,
        'no-nested-interactive': false,
        quotes: 'single',
    },

    ignore: [
        '**/lib/handbook/**/*',
    ],
};
