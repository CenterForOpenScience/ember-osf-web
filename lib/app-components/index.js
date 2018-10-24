/* eslint-env node */

const fs = require('fs');

module.exports = {
    name: 'app-components',

    isDevelopingAddon() {
        return true;
    },

    options: {
        cssModules: {
            headerModules: [
                'app-components/styles/headers',
            ],
        },
    },

    included(app, ...args) {
        this._super(app, ...args);

        const katexPath = 'node_modules/katex/dist';

        for (const font of fs.readdirSync(`${katexPath}/fonts`)) {
            this.import(`${katexPath}/fonts/${font}`, { destDir: 'assets/fonts' });
        }

        this.import(`${katexPath}/katex.css`);
        this.import(`${katexPath}/katex.js`, { using: [{ transformation: 'amd', as: 'katex' }] });
    },
};
