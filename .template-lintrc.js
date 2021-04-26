/* eslint-env node */

'use strict';

module.exports = {
    extends: 'octane',

    rules: {
        'block-indentation': 4,
        'no-bare-strings': true,
        'no-implicit-this': true,
        'no-nested-interactive': false,
        quotes: 'single',
    },

    ignore: [
        'handbook-docs/**/*',
    ],
};
