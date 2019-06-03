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
    const handbookEnabled = config.engines.handbook.enabled;
    const mirageEnabled = config['ember-cli-mirage'].enabled;

    /*
     * Options just used by child addons of the handbook engine. Some addons
     * insist on looking to the root app config instead of their parent config.
     */
    let handbookOptions = {};
    if (handbookEnabled) {
        handbookOptions = {
            // ember-code-snippets
            includeHighlightJS: false,
            includeFileExtensionInSnippetNames: false,
            snippetSearchPaths: ['lib/handbook/addon'],
            snippetRegexes: [{
                begin: /{{#(?:docs-snippet|demo.example|demo.live-example)\sname=(?:"|')(\S+)(?:"|')/,
                end: /{{\/(?:docs-snippet|demo.example|demo.live-example)}}/,
            }, {
                begin: /<(?:DocsSnippet|demo.example|demo.live-example)\s@name=(?:"|')(\S+)(?:"|')/,
                end: /<\/(?:DocsSnippet|demo.example|demo.live-example)>/,
            }],
        };
    }

    const app = new EmberApp(defaults, {
        ...handbookOptions,
        hinting: config.lintOnBuild,
        tests: config.testsEnabled,
        ace: {
            modes: ['handlebars'],
        },
        addons: {
            blacklist: [
                'ember-cli-addon-docs', // Only included in the handbook engine
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
            only: ['contains'],
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
        'ember-test-selectors': {
            strip: false,
        },
    });

    app.import('node_modules/dropzone/dist/dropzone.css');
    app.import('node_modules/dropzone/dist/dropzone.js');

    app.import({
        test: 'vendor/ember/ember-template-compiler.js',
    });

    if (mirageEnabled) {
        app.import('node_modules/seedrandom/seedrandom.min.js', {
            using: [{ transformation: 'amd', as: 'seedrandom' }],
        });
    }

    app.import('node_modules/keen-tracking/dist/keen-tracking.min.js', {
        using: [{ transformation: 'amd', as: 'keen-tracking' }],
    });

    if (handbookEnabled) {
        app.import('vendor/highlight.pack.js', {
            using: [{ transformation: 'amd', as: 'highlight.js' }],
        });
    }
    return app.toTree();
};
