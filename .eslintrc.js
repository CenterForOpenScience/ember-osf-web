module.exports = {
    globals: {
        server: true,
    },
    root: true,
    env: {
        browser: true,
        es6: true,
    },
    extends: [
        'eslint:recommended',
        'plugin:ember/recommended',
        'plugin:@typescript-eslint/recommended',
        // 'ember-concurrency', TODO: turn on ember-concurrency rules and fix errors.
        // 'eslint-plugin-qunit', TODO: add eslint-plugin-qunit
    ],
    parser: '@typescript-eslint/parser',
    parserOptions: {
        ecmaVersion: 2020,
        sourceType: 'module',
        ecmaFeatures: {
            legacyDecorators: true,
        },
    },
    plugins: [
        'ember',
        '@typescript-eslint',
        'eslint-plugin-import',
    ],
    rules: {
        '@typescript-eslint/array-type': [
            'error',
            {
                default: 'array-simple',
            },
        ],
        '@typescript-eslint/consistent-type-assertions': 'error',
        '@typescript-eslint/consistent-type-definitions': 'error',
        '@typescript-eslint/member-delimiter-style': [
            'error',
            {
                overrides: {
                    interface: {
                        multiline: {
                            delimiter: 'semi',
                            requireLast: true,
                        },
                        singleline: {
                            delimiter: 'semi',
                            requireLast: false,
                        },
                    },
                    typeLiteral: {
                        multiline: {
                            delimiter: 'comma',
                            requireLast: true,
                        },
                        singleline: {
                            delimiter: 'comma',
                            requireLast: false,
                        },
                    },
                },
            },
        ],
        '@typescript-eslint/ban-ts-comment': [
            'error',
            {
                'ts-ignore': 'allow-with-description',
            },
        ],
        '@typescript-eslint/no-shadow': [
            'error',
            {
                hoist: 'all',
            },
        ],
        '@typescript-eslint/no-unused-expressions': 'error',
        '@typescript-eslint/no-empty-function': 'error',
        '@typescript-eslint/prefer-for-of': 'error',
        '@typescript-eslint/prefer-function-type': 'error',
        '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
        '@typescript-eslint/quotes': [
            'error',
            'single',
            {
                avoidEscape: true,
            },
        ],
        '@typescript-eslint/semi': [
            'error',
            'always',
        ],
        '@typescript-eslint/triple-slash-reference': [
            'error',
            {
                path: 'always',
                types: 'prefer-import',
                lib: 'always',
            },
        ],
        '@typescript-eslint/unified-signatures': 'error',
        '@typescript-eslint/explicit-member-accessibility': 'off',
        '@typescript-eslint/ban-types': 'off',
        '@typescript-eslint/indent': [
            'off', // currently broken: https://github.com/typescript-eslint/typescript-eslint/issues/1824
            4,
            {
                FunctionDeclaration: {
                    parameters: 'first',
                },
                FunctionExpression: {
                    parameters: 'first',
                },
            },
        ],
        '@typescript-eslint/no-non-null-assertion': 'off',
        '@typescript-eslint/member-ordering': 'off',
        '@typescript-eslint/naming-convention': 'off',
        '@typescript-eslint/no-explicit-any': 'off',
        '@typescript-eslint/no-parameter-properties': 'off',
        '@typescript-eslint/no-use-before-define': 'off',
        '@typescript-eslint/prefer-optional-chain': 'off',
        '@typescript-eslint/interface-name-prefix': 'off',
        '@typescript-eslint/explicit-function-return-type': 'off',
        '@typescript-eslint/explicit-module-boundary-types': 'off',
        // ember
        'ember/new-module-imports': 'error',
        'ember/no-attrs-in-components': 'error',
        'ember/no-old-shims': 'error',
        'ember/no-private-routing-service': 'error',
        'ember/use-ember-data-rfc-395-imports': 'off',
        'ember/no-test-support-import': 'off',
        'ember/no-jquery': 'off',
        'ember/named-functions-in-promises': 'off',
        'ember/routes-segments-snake-case': 'off',
        'ember/no-classic-components': 'off',
        'ember/require-tagless-components': 'off',
        'ember/require-super-in-lifecycle-hooks': 'off',
        'ember/no-component-lifecycle-hooks': 'off',
        'ember/no-computed-properties-in-native-classes': 'off',
        'ember/classic-decorator-hooks': 'off',
        'ember/classic-decorator-no-classic-methods': 'off',
        'ember/no-classic-classes': 'off',
        'ember/no-get': 'off',
        'ember/no-controller-access-in-routes': 'off',
        'ember/no-assignment-of-untracked-properties-used-in-tracking-contexts': 'off',
        // ember-concurrency
        'ember-concurrency/no-perform-without-catch': 'off',
        'ember-concurrency/require-task-name-suffix': 'off',
        'ember-concurrency/no-native-promise-helpers': 'off',
        'arrow-body-style': 'error',
        'arrow-parens': [
            'error',
            'as-needed',
        ],
        'brace-style': [
            'error',
            '1tbs',
        ],
        'comma-dangle': [
            'error',
            'always-multiline',
        ],
        'constructor-super': 'error',
        curly: 'error',
        'eol-last': 'error',
        eqeqeq: [
            'error',
            'smart',
        ],
        'guard-for-in': 'error',
        'id-denylist': [
            'error',
            'any',
            'Number',
            'number',
            'String',
            'string',
            'Boolean',
            'boolean',
            'Undefined',
            'undefined',
        ],
        'id-match': 'error',
        'import/order': 'error',
        'max-len': ['error', { code: 120 }],
        'new-parens': 'error',
        'no-bitwise': 'error',
        'no-caller': 'error',
        'no-cond-assign': 'error',
        'no-console': 'error',
        'no-debugger': 'error',
        'no-empty': 'error',
        'no-eval': 'error',
        'no-multiple-empty-lines': 'error',
        'no-new-wrappers': 'error',
        'no-throw-literal': 'error',
        'no-trailing-spaces': 'error',
        'no-undef-init': 'error',
        'no-unsafe-finally': 'error',
        'no-unused-labels': 'error',
        'no-var': 'error',
        'object-shorthand': 'error',
        'one-var': [
            'error',
            'never',
        ],
        'prefer-const': 'error',
        'quote-props': [
            'error',
            'as-needed',
        ],
        radix: 'error',
        'spaced-comment': [
            'error',
            'always',
            {
                markers: [
                    '/',
                ],
            },
        ],
        'use-isnan': 'error',
        'max-classes-per-file': 'off',
        complexity: 'off',
        'no-fallthrough': 'off',
        'no-invalid-this': 'off',
        'valid-typeof': 'off',
        // old rules
        indent: ['error', 4],
        'function-paren-newline': ['error', 'consistent'],
        'prefer-rest-params': 'error',
        'generator-star-spacing': ['error', 'before'],
        'object-curly-newline': ['error', {
            ObjectExpression: { multiline: true, consistent: true },
            ObjectPattern: { multiline: true, consistent: true },
            ImportDeclaration: { multiline: true, consistent: true },
            ExportDeclaration: { multiline: true, consistent: true },
        }],
        'space-before-function-paren': ['error', {
            anonymous: 'never',
            named: 'never',
            asyncArrow: 'always',
        }],
        'linebreak-style': ['error', (process.platform === 'win32' ? 'windows' : 'unix')],
        strict: 'off',
        'class-methods-use-this': 'off',
        'import/export': 'off',
        'import/prefer-default-export': 'off',
        'no-restricted-globals': 'off',
        'no-underscore-dangle': 'off',
        'lines-between-class-members': 'off',
    },
    overrides: [
        {
            files: ['**/config/environment.d.ts'],
            rules: {
                indent: 'off',
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
                'max-len': 'off',
                '@typescript-eslint/no-unused-vars': 'off',
                '@typescript-eslint/member-delimiter-style': 'off',
                '@typescript-eslint/member-ordering': 'off',
                '@typescript-eslint/no-shadow': 'off',
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
                '@typescript-eslint/no-var-requires': 'off',
            },
        },
        {
            files: ['lib/*/addon/engine.js'],
            rules: {
                'ember/avoid-leaking-state-in-ember-objects': 'off',
            },
        },
        {
            files: [
                '.eslintrc.js',
                '.prettierrc.js',
                '.template-lintrc.js',
                'ember-cli-build.js',
                'testem.js',
                'run-node-test.js',
                'lib/**/environment.js',
                'lib/**/index.js',
                'blueprints/*/index.js',
                'blueprints/**/*.js',
                'node-tests/**/*.js',
                'config/**/*.js',
            ],
            parserOptions: {
                sourceType: 'script',
                ecmaVersion: 2018,
            },
            env: {
                browser: false,
                node: true,
            },
            plugins: ['node'],
            extends: ['plugin:node/recommended'],
            rules: {
                'no-undef': 'off',
                'id-denylist': 'off',
                'node/no-unpublished-require': 'off',
                'node/no-extraneous-require': 'off',
                'node/no-unsupported-features/es-syntax': 'off',
                'node/no-missing-import': 'off',
                'ember/no-string-prototype-extensions': 'off',
                'ember/no-classic-classes': 'off',
                '@typescript-eslint/no-var-requires': 'off',
                '@typescript-eslint/no-unused-vars': 'off',
            },
        },
    ],
    settings: {
        'import/extensions': ['error', 'never'],
    },
};
