import { click, currentRouteName } from '@ember/test-helpers';
import { ModelInstance } from 'ember-cli-mirage';
import { setupMirage } from 'ember-cli-mirage/test-support';
import { TestContext } from 'ember-test-helpers';
import { percySnapshot } from 'ember-percy';
import { setBreakpoint } from 'ember-responsive/test-support';
import { module, test } from 'qunit';

import { setupOSFApplicationTest, visit } from 'ember-osf-web/tests/helpers';
import PreprintProviderModel from 'ember-osf-web/models/preprint-provider';

interface PreprintDiscoverTestContext extends TestContext {
    provider: ModelInstance<PreprintProviderModel>;
}

module('Acceptance | preprints | discover', hooks => {
    setupOSFApplicationTest(hooks);
    setupMirage(hooks);

    hooks.beforeEach(async function(this: PreprintDiscoverTestContext) {
        server.loadFixtures('preprint-providers');
        const provider = server.schema.preprintProviders.find('thesiscommons') as ModelInstance<PreprintProviderModel>;
        const brand = server.create('brand');
        provider.update({
            brand,
            description: 'This is the description for Thesis Commons',
        });
        this.provider = provider;
    });

    test('Desktop', async function(this: PreprintDiscoverTestContext, assert) {
        await visit(`/preprints/${this.provider.id}/discover`);
        assert.equal(currentRouteName(), 'preprints.discover', 'Current route is preprints discover');
        assert.dom('[data-test-search-provider-logo]').exists('Desktop: Preprint provider logo is shown');
        assert.dom('[data-test-search-provider-description]').exists('Desktop: Preprint provider description is shown');
        assert.dom('[data-test-search-header]').doesNotExist('Desktop: Non-branded search header is not shown');
        assert.dom('[data-test-topbar-object-type-nav]').doesNotExist('Desktop: Object type nav is not shown');
        assert.dom('[data-test-middle-search-count]').exists('Desktop: Result count is shown in middle panel');
        await percySnapshot(assert);
    });

    test('mobile', async function(this: PreprintDiscoverTestContext, assert) {
        setBreakpoint('mobile');
        await visit(`/preprints/${this.provider.id}/discover`);
        assert.equal(currentRouteName(), 'preprints.discover', 'Current route is preprints discover');
        assert.dom('[data-test-search-provider-logo]').exists('Mobile: Preprint provider logo is shown');
        assert.dom('[data-test-search-provider-description]').exists('Mobile: Preprint provider description is shown');
        assert.dom('[data-test-search-header]').doesNotExist('Mobile: Non-branded search header is not shown');
        assert.dom('[data-test-topbar-object-type-nav]').doesNotExist('Mobile: Object type nav is not shown');
        assert.dom('[data-test-middle-search-count]').doesNotExist('Mobile: Result count is not shown in middle panel');
        assert.dom('[data-test-toggle-side-panel]').exists('Mobile: Toggle side panel button is shown');
        await click('[data-test-toggle-side-panel]');
        assert.dom('[data-test-left-search-count]').exists('Mobile: Result count is shown in side panel');
        assert.dom('[data-test-left-panel-object-type-dropdown]')
            .doesNotExist('Mobile: Object type dropdown is not shown');
        await percySnapshot(assert);
    });
});
