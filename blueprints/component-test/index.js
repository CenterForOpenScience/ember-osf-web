'use strict';

const path = require('path');
const stringUtil = require('ember-cli-string-utils');
const getPathOption = require('ember-cli-get-component-path-option');

module.exports = {
    description: 'Generates a component integration or unit test.',

    availableOptions: [
        {
            name: 'test-type',
            type: ['integration', 'unit'],
            default: 'integration',
            aliases: [
                { i: 'integration' },
                { u: 'unit' },
                { integration: 'integration' },
                { unit: 'unit' },
            ],
        },
    ],

    fileMapTokens() {
        return {
            __testType__(options) {
                return options.locals.testType || 'integration';
            },
            __path__(options) {
                return path.join(options.podPath, options.locals.path, options.dasherizedModuleName);
            },
        };
    },
    locals(options) {
        const dasherizedModuleName = stringUtil.dasherize(options.entity.name);
        let componentPathName = dasherizedModuleName;
        const testType = options.testType || 'integration';

        const friendlyTestDescription = [
            testType === 'unit' ? 'Unit' : 'Integration',
            'Component',
            dasherizedModuleName,
        ].join(' | ');

        if (options.path !== 'components' && options.path !== '') {
            componentPathName = [options.path, dasherizedModuleName].filter(Boolean).join('/');
        }

        return {
            path: getPathOption(options),
            testType,
            componentPathName,
            friendlyTestDescription,
        };
    },
};
