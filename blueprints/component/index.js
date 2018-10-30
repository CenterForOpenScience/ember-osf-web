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
        };
    },

    normalizeEntityName(entityName) {
        return validComponentName(normalizeEntityName(entityName));
    },

    locals(options) {
        let addonLayout = '';
        // if we're in an addon, build import statements
        if (options.project.isEmberCLIAddon() || (options.inRepoAddon && !options.inDummy)) {
            addonLayout = [
                "import { layout } from 'ember-osf-web/decorators/component';\n",
                "import styles from './styles';",
                "import template from './template';\n",
                '@layout(template, styles)\n',
            ].join('\n');
        }

        return {
            addonLayout,
            path: getPathOption(options),
        };
    },
};
