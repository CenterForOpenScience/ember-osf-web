import { setApplication } from '@ember/test-helpers';
import preloadAssets from 'ember-asset-loader/test-support/preload-assets';
import config from 'ember-get-config';
import Application from 'ember-osf-web/app';
import manifest from 'ember-osf-web/config/asset-manifest';
import { start } from 'ember-qunit';

setApplication(Application.create(config.APP) as any);

(async () => {
    // Remove /ember_osf_web prefix from manifest URIs.
    Object.values(manifest.bundles).forEach(bundle => {
        for (const asset of bundle.assets) {
            asset.uri = asset.uri.replace(/^\/ember_osf_web/, '');
        }
    });

    // This ensures all engine resources are loaded before the tests
    await preloadAssets(manifest);

    start();
})();
