'use strict';

module.exports = {
    globals: {
        server: true,
    },
    root: true,
    parser: '@typescript-eslint/parser',
    parserOptions: {
        ecmaVersion: 2017,
        sourceType: 'module',
    },
    extends: '@centerforopenscience/eslint-config/ember',
    plugins: [
        '@typescript-eslint',
    ],
    env: {
        browser: true,
        es6: true,
    },
    rules: {
        'arrow-parens': ['error', 'as-needed'],
        'class-methods-use-this': 'off',
        'max-len': ['error', { code: 120 }],
        strict: 'off',
        'function-paren-newline': ['error', 'consistent'],
        'prefer-rest-params': 'error',
        'generator-star-spacing': ['error', 'before'],
        'object-curly-newline': ['error', {
            ObjectExpression: { multiline: true, consistent: true },
            ObjectPattern: { multiline: true, consistent: true },
            ImportDeclaration: { multiline: true, consistent: true },
            ExportDeclaration: { multiline: true, consistent: true },
        }],
        'ember/named-functions-in-promises': 'off',
        'ember/new-module-imports': 'error',
        'ember/no-attrs-in-components': 'error',
        'ember/no-old-shims': 'error',
        'ember/routes-segments-snake-case': 'off',
        'import/export': 'off',
        'import/prefer-default-export': 'off',
        'no-restricted-globals': 'off',
        'space-before-function-paren': ['error', {
            anonymous: 'never',
            named: 'never',
            asyncArrow: 'always',
        }],
        'no-underscore-dangle': 'off',
        'linebreak-style': ['error', (process.platform === 'win32' ? 'windows' : 'unix')],
        'lines-between-class-members': 'off',
    },
    overrides: [
        {
            files: ['**/config/environment.d.ts'],
            rules: {
                indent: 'off',
                'indent-legacy': 'error',
            },
        },
        {
            files: ['**/*.ts'],
            rules: {
                // Better enforced by TS
                'no-undef': 'off',
                'no-unused-vars': 'off',
                'ember/no-attrs-snapshot': 'off',
            },
        },
        {
            files: ['**/*.d.ts'],
            rules: {
                'no-useless-constructor': 'off',
                'space-infix-ops': 'off',
                'no-shadow': 'off',
            },
        },
        {
            files: ['app/locales/*/translations.ts'],
            rules: {
                'max-len': 'off',
            },
        },
        {
            files: ['tests/**/*'],
            rules: {
                'no-await-in-loop': 'off',
                'ember/avoid-leaking-state-in-components': 'off',
                'ember/avoid-leaking-state-in-ember-objects': 'off',
            },
        },
        {
            files: ['mirage/**/*'],
            rules: {
                'ember/avoid-leaking-state-in-ember-objects': 'off',
            },
        },
        {
            files: ['lib/*/index.js'],
            rules: {
                'ember/avoid-leaking-state-in-ember-objects': 'off',
            },
        },
        {
            files: ['lib/*/addon/engine.js'],
            rules: {
                'ember/avoid-leaking-state-in-ember-objects': 'off',
            },
        },
    ],
    settings: {
        'import/extensions': ['error', 'never'],
    },
};
