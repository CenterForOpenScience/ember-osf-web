module.exports = {
    root: true,
    parser: 'typescript-eslint-parser',
    parserOptions: {
        ecmaVersion: 2017,
        sourceType: 'module',
    },
    extends: '@centerforopenscience/eslint-config/ember',
    plugins: [
        'typescript',
    ],
    env: {
        browser: true,
        es6: true,
    },
    rules: {
        'arrow-parens': [ 'error', 'as-needed' ],
        'class-methods-use-this': [ 'error', {
            exceptMethods: [
                'resetController',
                'pathForType',
                'modelNameFromPayloadKey',
            ],
        }],
        'ember/named-functions-in-promises': 'warn',
        'max-len': [ 'warn', { code: 120 } ],
        'no-undef': 0,
        'no-unused-vars': ['error', { argsIgnorePattern: '^this' }],
        'typescript/no-unused-vars': 'error',
        strict: 0,
        indent: 0,
        'indent-legacy': 'error',
    },
    overrides: [
        {
            files: ['**/*.d.ts'],
            rules: {
                'no-unused-vars': 0,
            }
        },
        {
            files: ['app/locales/*/translations.ts'],
            rules: {
                'max-len': 0,
            },
        },
    ]
};
