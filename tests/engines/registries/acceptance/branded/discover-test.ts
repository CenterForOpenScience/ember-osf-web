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

    hooks.beforeEach(() => {
        const brandedProvider = server.create('registration-provider', {
            id: 'brand',
            assets: {
                favicon: 'fakelink',
            },
        }, 'withBrand');
        server.createList('registration', 3, { provider: brandedProvider });
    });

    test('branded discover with no external providers', async function(this: ThisTestContext, assert) {
        await visit(`/registries/${this.brandedProvider.id}/discover`);
        await percySnapshot('branded discover page');
        assert.equal(currentRouteName(), 'registries.branded.discover', 'On the branded discover page');

        assert.dom('[data-test-active-filter]').doesNotExist('The given provider is not shown as an active filter');
        assert.dom('[data-test-source-filter-id]').exists({ count: 1 }, 'Only one provider is available');
        assert.dom('[data-test-source-filter-id]').isChecked('Provider facet checkbox is checked');
        assert.dom('[data-test-source-filter-id]').isDisabled('Provider facet checkbox is disabled');
        assert.dom('[data-test-link-other-registries]').exists('Link to other registries is shown');
        assert.ok(document.querySelector('link[rel="icon"][href="fakelink"]'));
    });

    test('branded discover with external providers', async function(this: ThisTestContext, assert) {
        const externalProvider = server.create('external-provider', { shareSource: 'ClinicalTrials.gov' });
        server.createList('external-registration', 3, { provider: externalProvider });

        await visit(`/registries/${this.brandedProvider.id}/discover`);
        assert.dom('[data-test-source-filter-id]').exists({ count: 1 }, 'Only brand provider is shown');
        assert.dom(`[data-test-source-filter-id="${externalProvider.shareSource}"]`)
            .doesNotExist('External provider is not shown');
        assert.ok(document.querySelector('link[rel="icon"][href="fakelink"]'));
    });

    test('redirects branded.index to branded.discover', async function(this: ThisTestContext, assert) {
        await visit(`/registries/${this.brandedProvider.id}`);

        assert.equal(currentRouteName(),
            'registries.branded.discover', 'successfully redirects index to discover');
        assert.dom(`[data-test-source-filter-id="${this.brandedProvider.shareSource}"]`).exists({ count: 1 });
    });

    test('redirects', async assert => {
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
            'registries.discover',
            '/registries/osf/discover redirects to registries/discover');

        await visit(`/registries/${osfProvider.id}`);
        assert.equal(currentRouteName(),
            'registries.discover',
            '/registries/osf redirects to registries/discover');
    });
});
