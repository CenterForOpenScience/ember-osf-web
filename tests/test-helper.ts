import { setResolver } from '@ember/test-helpers';
import preloadAssets from 'ember-asset-loader/test-support/preload-assets';
import { start } from 'ember-cli-qunit';
import manifest from 'ember-osf-web/config/asset-manifest';
import resolver from './helpers/resolver';

setResolver(resolver);

(async () => {
    // This ensures all engine resources are loaded before the tests
    await preloadAssets(manifest);

    start();
})();
