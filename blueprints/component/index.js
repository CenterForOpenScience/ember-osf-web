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
        let osfImports = "import { localClassNames } from 'ember-osf-web/decorators/css-modules';";
        let layoutDecorator = '';
        // if we're in an addon, build import statements
        if (options.project.isEmberCLIAddon() || (options.inRepoAddon && !options.inDummy)) {
            osfImports = [
                "import { layout } from 'ember-osf-web/decorators/component';",
                "import { localClassNames } from 'ember-osf-web/decorators/css-modules';",
                "import styles from './styles';",
                "import template from './template';",
            ].join('\n');

            layoutDecorator = '@layout(template, styles)\n';
        }

        return {
            osfImports,
            layoutDecorator,
            path: getPathOption(options),
        };
    },
};
