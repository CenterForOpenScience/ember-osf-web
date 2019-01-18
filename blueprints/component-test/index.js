'use strict';

const fs = require('fs');
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
            __engineName__(options) {
                return options.inRepoAddon;
            },
        };
    },

    locals(options) {
        const dasherizedModuleName = stringUtil.dasherize(options.entity.name);
        let componentPathName = dasherizedModuleName;
        const testType = options.testType || 'integration';
        const engineName = options.inRepoAddon;

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
            engineName,
            testType,
            componentPathName,
            friendlyTestDescription,
        };
    },

    filesPath(options) {
        if (options) {
            const engineName = options.inRepoAddon;
            if (engineName) {
                // if the in-repo-addon within which the new component is added uses ember engine
                // we tell ember-cli to use the dir structure and __test__.ts in 'engine-files'
                const isEngine = fs.existsSync(
                    path.join(options.project.root, 'lib', engineName, 'addon', 'engine.js'),
                );
                if (isEngine) {
                    return path.join(this.path, 'engine-files');
                }
            }
        }
        return path.join(this.path, 'files');
    },
};
