/* eslint-env node */

'use strict';

module.exports = {
    extends: 'octane',

    rules: {
        'block-indentation': 4,
        'no-bare-strings': true,
        'no-implicit-this': true,
        'no-nested-interactive': false,
        'no-action': false,
        'no-curly-component-invocation': false,
        'require-input-label': false,
        'no-unknown-arguments-for-builtin-components': false,
        'no-yield-only': false,
        'no-nested-splattributes': false,
        'no-down-event-binding': false,
        'no-quoteless-attributes': false,
        'no-forbidden-elements': false,
        'no-link-to-positional-params': false,
        'no-passed-in-event-handlers': false,
        quotes: 'single',
    },

    ignore: [
        'handbook-docs/**/*',
    ],
};
