'use strict';

const path = require('path');
const validComponentName = require('ember-cli-valid-component-name');
const getPathOption = require('ember-cli-get-component-path-option');
const normalizeEntityName = require('ember-cli-normalize-entity-name');

module.exports = {
    description: 'Generates a component. Name must contain a hyphen.',

    availableOptions: [
        {
            name: 'path',
            type: String,
            default: 'components',
            aliases: [
                { 'no-path': '' },
            ],
        },
    ],

    fileMapTokens() {
        return {
            __path__(options) {
                return path.join(options.podPath, options.locals.path, options.dasherizedModuleName);
            },
            __templatepath__(options) {
                return path.join(options.podPath, options.locals.path, options.dasherizedModuleName);
            },
            __templatename__() {
                return 'template';
            },
        };
    },

    normalizeEntityName(entityName) {
        return validComponentName(normalizeEntityName(entityName));
    },

    locals(options) {
        let importStyles = '';
        let importTemplate = '';
        let contents = '';
        // if we're in an addon, build import statements
        if (options.project.isEmberCLIAddon() || (options.inRepoAddon && !options.inDummy)) {
            importStyles = '// @ts-ignore: Ignore import of compiled styles\nimport styles from \'./styles\';\n';
            importTemplate = '// @ts-ignore: Ignore import of compiled template\nimport layout from \'./template\';\n';
            contents = '\n    styles = styles;\n    layout = layout;';
        }

        return {
            importStyles,
            importTemplate,
            contents,
            path: getPathOption(options),
        };
    },
};
