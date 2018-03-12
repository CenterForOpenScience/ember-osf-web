module.exports = {
    root: true,
    parser: 'typescript-eslint-parser',
    parserOptions: {
        ecmaVersion: 2017,
        sourceType: 'module',
    },
    extends: '@centerforopenscience/eslint-config/ember',
    env: {
        browser: true,
        es6: true,
    },
    rules: {
        'arrow-parens': [ 'warn', 'as-needed' ],
        'class-methods-use-this': [ 'error', {
            exceptMethods: [
                'resetController',
                'pathForType',
                'modelNameFromPayloadKey',
            ],
        }],
        'ember/named-functions-in-promises': 'off',
        'max-len': [ 'warn', { code: 120 } ],
        'no-confusing-arrow': 0,
        'no-undef': 0,
        'no-unused-vars': ['error', { argsIgnorePattern: '^this' }],
        strict: 0,
        indent: 'off',
    },
    overrides: [
        {
            files: ['**/*.ts'],
            rules: {
                'no-unused-vars': 0,
            }
        }
    ]
};
