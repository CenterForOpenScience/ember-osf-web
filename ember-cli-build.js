/* eslint-env node */

const nodeSass = require('node-sass');

const EmberApp = require('ember-cli/lib/broccoli/ember-app');
const broccoliAssetRevDefaults = require('broccoli-asset-rev/lib/default-options');

const { EMBER_ENV } = process.env;
const IS_PROD = EMBER_ENV === 'production';

function postProcess(content) {
    return content.trim().replace(/^\s{20}/mg, '');
}

module.exports = function(defaults) {
    const config = defaults.project.config(EMBER_ENV);

    const app = new EmberApp(defaults, {
        hinting: config.lintOnBuild,
        tests: config.testsEnabled,
        ace: {
            modes: ['handlebars'],
        },
        autoImport: {
            webpack: {
                node: {
                    path: true,
                },
            },
            exclude: ['jsonapi-typescript'],
        },
        addons: {
            blacklist: [
                ...Object.keys(config.engines).filter(
                    engineName => !config.engines[engineName].enabled,
                ),
            ],
        },
        'ember-bootstrap': {
            bootstrapVersion: 3,
            importBootstrapFont: true,
            importBootstrapCSS: false,
        },
        'ember-composable-helpers': {
            only: ['compose', 'contains', 'flatten', 'range', 'queue', 'map-by', 'without'],
        },
        'ember-cli-password-strength': {
            bundleZxcvbn: !IS_PROD,
        },
        fingerprint: {
            enabled: true,
            extensions: broccoliAssetRevDefaults.extensions.concat(['svg']),
            exclude: [
                'zxcvbn.js',
                'assets/osf-assets',
                // Exclude <engine-name>/config/environment.js from fingerprinting so it matches
                // the engines exclude regex.
                // https://github.com/ember-engines/ember-engines/blob/master/index.js#L10
                'config/environment.js',
            ],
            prepend: config.assetsPrefix,
        },
        sassOptions: {
            implementation: nodeSass,
            includePaths: [
                'app/styles/',
            ],
        },
        cssModules: {
            headerModules: [
                'ember-osf-web/styles/headers',
            ],
        },
        babel: {
            sourceMaps: 'inline',
        },
        sourcemaps: {
            enabled: config.sourcemapsEnabled,
            extensions: ['js'],
        },
        inlineContent: {
            assetsPrefix: {
                content: config.assetsPrefix,
            },
            raven: {
                enabled: IS_PROD,
                content: `
                    <script src="https://cdn.ravenjs.com/3.22.1/ember/raven.min.js"></script>
                    <script>
                        var encodedConfig = document.head.querySelector("meta[name$='/config/environment']").content;
                        var config = JSON.parse(unescape(encodedConfig));
                        if (config.sentryDSN) {
                            Raven.config(config.sentryDSN, config.sentryOptions || {}).install();
                        }
                    </script>
                `,
                postProcess,
            },
            zxcvbn: {
                enabled: IS_PROD,
                /* eslint-disable max-len */
                content: `
                    <script src="https://cdnjs.cloudflare.com/ajax/libs/zxcvbn/4.4.2/zxcvbn.js"
                        integrity="sha256-Znf8FdJF85f1LV0JmPOob5qudSrns8pLPZ6qkd/+F0o=
                                   sha384-jhGcGHNZytnBnH1wbEM3KxJYyRDy9Q0QLKjE65xk+aMqXFCdvFuYIjzMWAAWBBtR
                                   sha512-TZlMGFY9xKj38t/5m2FzJ+RM/aD5alMHDe26p0mYUMoCF5G7ibfHUQILq0qQPV3wlsnCwL+TPRNK4vIWGLOkUQ=="
                        crossorigin="anonymous">
                    </script>
                `,
                postProcess,
                /* eslint-enable max-len */
            },
        },
        'ember-cli-babel': {
            includePolyfill: IS_PROD,
        },
        assetLoader: {
            generateURI(filePath) {
                return config.assetsPrefix.replace(/\/$/, '') + filePath;
            },
        },
    });

    app.import('node_modules/dropzone/dist/dropzone.css');
    app.import('node_modules/dropzone/dist/dropzone.js');

    app.import('node_modules/wicg-inert/dist/inert.min.js');

    return app.toTree();
};
