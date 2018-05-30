const stringUtil = require('ember-cli-string-utils');

module.exports = {
    description: 'Generates a new custom assertion into tests/assertions/',

    locals(options) {
        const { entity } = options;
        const rawName = entity.name;
        const name = stringUtil.dasherize(rawName);
        const camelName = stringUtil.camelize(rawName);

        return { name, camelName };
    },
};
