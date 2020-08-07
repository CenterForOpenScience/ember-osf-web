import { currentRouteName } from '@ember/test-helpers';
import { setupMirage } from 'ember-cli-mirage/test-support';
import { percySnapshot } from 'ember-percy';
import { module, test } from 'qunit';

import { visit } from 'ember-osf-web/tests/helpers';
import { setupEngineApplicationTest } from 'ember-osf-web/tests/helpers/engines';

module('Registries | Acceptance | branded.discover', hooks => {
    setupEngineApplicationTest(hooks, 'registries');
    setupMirage(hooks);

    hooks.beforeEach(() => {
        const brandedProvider = server.create('registration-provider', { id: 'brand' }, 'withBrand');
        server.createList('registration', 3, { provider: brandedProvider });
    });

    test('branded discover with no external providers', async assert => {
        await visit('/registries/brand/discover');
        await percySnapshot('branded discover page');
        assert.equal(currentRouteName(), 'registries.branded.discover', 'On the branded discover page');

        assert.dom('[data-test-active-filter]').doesNotExist('The given provider is not shown as an active filter');
        assert.dom('[data-test-source-filter-id]').exists({ count: 1 }, 'Only one provider is available');
        assert.dom('[data-test-source-filter-id]').isChecked('Provider facet checkbox is checked');
        assert.dom('[data-test-source-filter-id]').isDisabled('Provider facet checkbox is disabled');
        assert.dom('[data-test-link-other-registries]').exists('Link to other registries is shown');
    });

    test('branded discover with external providers', async assert => {
        const externalProvider = server.create('external-provider', { shareSource: 'ClinicalTrials.gov' });
        server.createList('external-registration', 3, { provider: externalProvider });

        await visit('/registries/brand/discover');
        assert.dom('[data-test-source-filter-id]').exists({ count: 1 }, 'Only brand provider is shown');
        assert.dom(`[data-test-source-filter-id="${externalProvider.shareSource}"]`)
            .doesNotExist('External provider is not shown');
    });
});
