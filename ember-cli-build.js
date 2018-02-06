/* eslint-env node */

const EmberApp = require('ember-cli/lib/broccoli/ember-app');
const Funnel = require('broccoli-funnel');

const nonCdnEnvironments = ['development', 'test'];

module.exports = function(defaults) {
    const useCdn = (nonCdnEnvironments.indexOf(process.env.EMBER_ENV) === -1);
    const app = new EmberApp(defaults, {
        'ember-bootstrap': {
            bootstrapVersion: 3,
            importBootstrapFont: true,
            importBootstrapCSS: false,
        },
        sassOptions: {
            includePaths: [
                'node_modules/@centerforopenscience/osf-style/sass',
            ],
        },
        sourcemaps: {
            enabled: true,
            extensions: ['js'],
        },
        inlineContent: {
            raven: {
                enabled: useCdn,
                content: `
                    <script src="https://cdn.ravenjs.com/3.22.1/ember/raven.min.js"></script>
                    <script>
                        var encodedConfig = document.head.querySelector("meta[name$='/config/environment']").content;
                        var config = JSON.parse(unescape(encodedConfig));
                        if (config.sentryDSN) {
                            Raven.config(config.sentryDSN, config.sentryOptions || {}).install();
                        }
                    </script>
                `.trim(),
            },
        },
        'ember-cli-babel': {
            includePolyfill: true,
        },
    });

    app.import('vendor/assets/ember-osf.css');
    app.import(
        'node_modules/microfeedback-button/dist/microfeedback-button.js',
        { using: [{ transformation: 'amd', as: 'microfeedback-button' }] },
    );
    const assets = [
        new Funnel('node_modules/@centerforopenscience/osf-style/img', {
            srcDir: '/',
            destDir: 'img',
        }),
    ];

    return app.toTree(assets);
};
