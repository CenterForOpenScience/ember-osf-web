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

    app.import('node_modules/dropzone/dist/dropzone.css');
    app.import('node_modules/dropzone/dist/dropzone.js');
    app.import('node_modules/osf-style/css/base.css');
    app.import('node_modules/@centerforopenscience/osf-style/css/base.css');

    app.import({
        test: 'node_modules/jquery-mockjax/dist/jquery.mockjax.js',
    });
    const assets = [
        new Funnel('node_modules/@centerforopenscience/osf-style/img', {
            srcDir: '/',
            destDir: 'img',
        }),
    ];

    return app.toTree(assets);
};
