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
        'class-methods-use-this': 0,
        'max-len': [ 'error', { code: 120 } ],
        'no-undef': 0,
        'no-unused-vars': ['error', { argsIgnorePattern: '^this' }],
        'typescript/no-unused-vars': 'error',
        strict: 0,
        indent: 0,
        'indent-legacy': 'error',
        'ember/named-functions-in-promises': 0,
        'function-paren-newline': ['error', 'consistent'],
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
