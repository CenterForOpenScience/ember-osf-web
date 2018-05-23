'use strict';

const stringUtil = require('ember-cli-string-utils');
const validComponentName = require('ember-cli-valid-component-name');
const getPathOption = require('ember-cli-get-component-path-option');
const path = require('path');
const normalizeEntityName = require('ember-cli-normalize-entity-name');

module.exports = {
    description: 'Generates a component. Name must contain a hyphen.',

    fileMapTokens() {
        return {
            __path__(options) {
                return path.join(options.podPath, options.locals.path, options.dasherizedModuleName);
            },
            __root__(options) {
                if (options.inRepoAddon) {
                    return path.join('lib', options.inRepoAddon, 'app');
                }
                return 'app';
            },
        };
    },

    normalizeEntityName(entityName) {
        return validComponentName(normalizeEntityName(entityName));
    },

    locals(options) {
        const addonRawName = options.inRepoAddon ? options.inRepoAddon : options.project.name();
        const addonName = stringUtil.dasherize(addonRawName);
        const fileName = stringUtil.dasherize(options.entity.name);

        return {
            modulePath: [addonName, 'components', fileName, 'component'].join('/'),
            path: getPathOption(options),
        };
    },
};
