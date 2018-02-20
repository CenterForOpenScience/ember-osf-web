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
        'class-methods-use-this': [ 'error', {
            exceptMethods: [
                'resetController'
            ],
        }],
        'no-undef': 0,
        'no-unused-vars': ['error', { argsIgnorePattern: '^this' }],
        strict: 0,
    },
    overrides: [
        {
            files: ['**/*.d.ts'],
            rules: {
                'no-unused-vars': 0,
            }
        }
    ]
};
