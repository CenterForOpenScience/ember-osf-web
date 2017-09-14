/*jshint node:true*/
/* global require, module */
const path = require('path');

var EmberApp = require('ember-cli/lib/broccoli/ember-app');
const configFunc = require('./config/environment');
const {
    EMBER_ENV
} = process.env;
const Funnel = require('broccoli-funnel');

module.exports = function(defaults) {
    const config = configFunc(EMBER_ENV);
    const {
        OSF: {url: osfUrl}
    } = defaults.project.config(EMBER_ENV);
    var app = new EmberApp(defaults, {
        'ember-bootstrap': {
            'bootstrapVersion': 3,
            'importBootstrapFont': true,
            'importBootstrapCSS': false
        },
        sassOptions: {
            includePaths: [
                'node_modules/@centerforopenscience/osf-style/sass'
            ]
        },
        inlineContent: {
            assets: {
                enabled: true,
                content: `
                    <script>
                        window.assetSuffix = '${config.ASSET_SUFFIX ? '-' + config.ASSET_SUFFIX : ''}';
                        (function(osfUrl) {
                            var origin = window.location.origin;
                            window.isProviderDomain = !~osfUrl.indexOf(origin);
                            var prefix = '/quickfiles/assets/';
                            [
                                'vendor',
                                'ember-quickfiles'
                            ].forEach(function (name) {
                                var script = document.createElement('script');
                                script.src = prefix + name + window.assetSuffix + '.js';
                                script.async = false;
                                document.body.appendChild(script);

                                var link = document.createElement('link');
                                link.rel = 'stylesheet';
                                link.href = prefix + name + window.assetSuffix + '.css';
                                document.head.appendChild(link);
                            });
                        })('${osfUrl}');
                    </script>`
            }
        }
    });

    app.import(path.join(app.bowerDirectory, 'dropzone/dist/basic.css'));
    app.import(path.join(app.bowerDirectory, 'dropzone/dist/dropzone.css'));
    app.import(path.join(app.bowerDirectory, 'dropzone/dist/dropzone.js'));

    app.import('vendor/assets/ember-osf.css');

    const assets = [
        new Funnel('node_modules/@centerforopenscience/osf-style/img', {
           srcDir: '/',
           destDir: 'img',
        })
    ];

    return app.toTree(assets);
};
