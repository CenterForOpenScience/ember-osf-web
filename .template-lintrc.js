/* eslint-env node */

'use strict';

module.exports = {
    extends: 'recommended',

    rules: {
        'block-indentation': 4,
        'attribute-indentation': {
            indentation: 4,
            'open-invocation-max-len': 120,
            'process-elements': true,
        },
        'no-bare-strings': true,
        'no-nested-interactive': false,
    },

    ignore: [
        '**/lib/handbook/**/*',
    ],
};
