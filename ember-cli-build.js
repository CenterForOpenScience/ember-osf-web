/* eslint-env node */


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
            exclude: ['jsonapi-typescript'],
            publicAssetURL: `${config.assetsPrefix}assets`,
        },
        addons: {
            blacklist: [
                ...Object.keys(config.engines).filter(
                    engineName => !config.engines[engineName].enabled,
                ),
            ],
        },
        'ember-composable-helpers': {
            only: ['compose', 'contains', 'flatten', 'includes', 'range', 'queue', 'map-by', 'without', 'find-by'],
        },
        fingerprint: {
            enabled: true,
            extensions: broccoliAssetRevDefaults.extensions.concat(['svg']),
            exclude: [
                'assets/osf-assets',
                'assets/images/addons/icons',
                // Exclude <engine-name>/config/environment.js from fingerprinting so it matches
                // the engines exclude regex.
                // https://github.com/ember-engines/ember-engines/blob/master/index.js#L10
                'config/environment.js',
            ],
            prepend: config.assetsPrefix,
        },
        sassOptions: {
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
            gtm: {
                enabled: IS_PROD,
                content: `<script>
                    var configJson = document.head.querySelector("meta[name$='/config/environment']").content;
                    var configObject = JSON.parse(unescape(configJson));
                    if (configObject.googleTagManagerId) {
                        window.dataLayer = window.dataLayer || [];
                        function gtag(){dataLayer.push(arguments);}
                        gtag('js', new Date());

                        gtag('config', configObject.googleTagManagerId);
                    }
                </script>
            `,
                postProcess,
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
    // app.import('node_modules/cedar-embeddable-editor/cedar-embeddable-editor.js');
    // app.import('node_modules/cedar-artifact-viewer/cedar-artifact-viewer.js');
    return app.toTree();
};
