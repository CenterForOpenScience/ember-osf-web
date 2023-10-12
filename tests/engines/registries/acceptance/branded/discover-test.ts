import { currentRouteName } from '@ember/test-helpers';
import { ModelInstance } from 'ember-cli-mirage';
import { setupMirage } from 'ember-cli-mirage/test-support';
import { percySnapshot } from 'ember-percy';
import { TestContext } from 'ember-test-helpers';
import { module, test } from 'qunit';

import RegistrationProvider from 'ember-osf-web/models/registration-provider';
import { visit } from 'ember-osf-web/tests/helpers';
import { setupEngineApplicationTest } from 'ember-osf-web/tests/helpers/engines';

interface ThisTestContext extends TestContext {
    brandedProvider: ModelInstance<RegistrationProvider>;
}

module('Registries | Acceptance | branded.discover', hooks => {
    setupEngineApplicationTest(hooks, 'registries');
    setupMirage(hooks);

    hooks.beforeEach(function(this: ThisTestContext) {
        this.brandedProvider = server.create('registration-provider', {
            id: 'brand',
            assets: {
                favicon: 'fakelink',
            },
        }, 'withBrand');
        server.createList('registration', 3, { provider: this.brandedProvider });
    });

    test('branded discover page renders', async function(this: ThisTestContext, assert) {
        await visit(`/registries/${this.brandedProvider.id}/discover`);
        await percySnapshot('branded discover page');
        assert.equal(currentRouteName(), 'registries.branded.discover', 'On the branded discover page');
    });

    test('redirects branded.index to branded.discover', async function(this: ThisTestContext, assert) {
        await visit(`/registries/${this.brandedProvider.id}`);

        assert.equal(currentRouteName(),
            'registries.branded.discover', 'successfully redirects index to discover');
    });

    test('redirects', async function(assert) {
        const provider = server.create('registration-provider', {
            brandedDiscoveryPage: false,
        }, 'withBrand');

        await visit(`/registries/${provider.id}/discover`);
        assert.equal(currentRouteName(),
            'registries.page-not-found',
            'Gets page-not-found if provider.brandedDiscoveryPage set to False');

        const osfProvider = server.create('registration-provider', {
            id: 'osf',
            brandedDiscoveryPage: false,
        });

        await visit(`/registries/${osfProvider.id}/discover`);
        assert.equal(currentRouteName(),
            'search',
            '/registries/osf/discover redirects to search page');

        await visit(`/registries/${osfProvider.id}`);
        assert.equal(currentRouteName(),
            'registries.index',
            '/registries/osf redirects to registries index page');
    });
});
