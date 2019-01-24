'use strict';

const fs = require('fs');
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
    files() {
        if (this.options) {
            const engineName = this.options.inRepoAddon;
            if (engineName) {
                // if the in-repo-addon within which the new component is added uses ember engine
                // we return an empty array
                // so that the blueprint would not be picked up and used for generating unnecessary `/app` tree
                const isEngine = fs.existsSync(
                    path.join(this.options.project.root, 'lib', engineName, 'addon', 'engine.js'),
                );
                if (isEngine) {
                    return [];
                }
            }
        }
        return this._super();
    },
};
