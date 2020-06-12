import { click, fillIn } from '@ember/test-helpers';
import setupMirage from 'ember-cli-mirage/test-support/setup-mirage';
import { t } from 'ember-intl/test-support';
import { percySnapshot } from 'ember-percy';
import { module, test } from 'qunit';

import { visit } from 'ember-osf-web/tests/helpers';
import { setupEngineApplicationTest } from 'ember-osf-web/tests/helpers/engines';

module('Registries | Acceptance | aggregate discover', hooks => {
    setupEngineApplicationTest(hooks, 'registries');
    setupMirage(hooks);

    hooks.beforeEach(() => {
        const osfProvider = server.create('registration-provider', { id: 'osf' });
        const anotherProvider = server.create('registration-provider', { id: 'another' });
        const externalProvider = server.create('external-provider', { shareSourceKey: 'ClinicalTrials.gov' });
        server.createList('external-registration', 3, { provider: externalProvider });
        server.createList('registration', 3, { provider: osfProvider });
        server.createList('registration', 3, { provider: anotherProvider });
    });

    // available assertions:
    // - for each result, link element with correct href and text
    // - search box exists and is usable
    // - filters exist and are usable
    // - paginator exists and is usable
    //
    // context:
    // - multiple providers
    // - multiple registrations for each provider

    // happy path:
    // - arrive at the page (no query params)
    // - take percy snapshot
    // - assert search results exist
    // - important controls exist
    // - enter query -- search happens
    // - click filters -- search happens
    // - assert paginator exists
    test('happy path', async assert => {
        await visit('/registries/discover');
        await click('[data-test-sort-dropdown]');
        await percySnapshot('happy path');

        const osfProvider = server.schema.registrationProviders.find('osf');
        const registrationIds = server.schema.registrations.all().models.map(item => item.id);
        for (const id of registrationIds) {
            assert.dom(`[data-test-result-title-id="${id}"]`).exists();
        }
        assert.dom('[data-test-sort-dropdown]').exists('Sort dropdown exists');
        assert.dom('[data-test-active-filter]').doesNotExist('No filters are applied by default');
        assert.dom('[data-test-source-filter-id]').exists({ count: 3 }, 'Three sources exist');
        assert.dom('[data-test-page-number]').doesNotExist('No pagination for less than 10 registrations');

        const searchableReg = server.schema.registrations.first();
        await fillIn('[data-test-search-box]', searchableReg.title);
        assert.dom(`[data-test-result-title-id='${searchableReg.id}']`).exists('Search shows appropriate result');

        await fillIn('[data-test-search-box]', '');

        await click(`[data-test-source-filter-id="${osfProvider.shareSourceKey}"]`);
        assert.dom('[data-test-result-title-id]').exists({ count: 3 }, 'Provider filter works');

        await fillIn('[data-test-search-box]', 'kjafnsdflkjhsdfnasdkndfa random string');
        assert.dom('[data-test-no-results-placeholder]').hasText(t('registries.discover.no_results'));
        assert.dom('[data-test-result-title-id]').doesNotExist('No results rendered');
    });

    test('paginator works', async assert => {
        server.createList('registration', 2, { provider: server.schema.registrationProviders.first() });

        await visit('/registries/discover/');

        // Count is 4 including previous and next buttons
        assert.dom('[data-test-page-number]').exists({ count: 4 }, 'Exactly two pages of results');
        assert.dom('[data-test-page-number="1"]').exists();
        assert.dom('[data-test-page-number="2"]').exists();
        assert.dom('[data-test-results-count]').hasText(t('registries.discover.registration_count', { count: 11 }));

        assert.dom('[data-test-result-title-id]').exists({ count: 10 }, 'First page has correct number of results');

        await click('[data-test-page-number="2"]');
        assert.dom('[data-test-result-title-id]').exists({ count: 1 }, 'Second page has correct number of results');
    });

    // path with different initial state:
    // - arrive at page WITH query params
    // - take percy snapshot
    // - assert initial search reflects query params
    // - assert filter checkbox is checked
    // - uncheck filter
    // - assert search reflects new query
    // - assert filter checkbox is unchecked
    test('initial state from query params', async assert => {
        const anotherProvider = server.schema.registrationProviders.find('another');
        const searchableReg = anotherProvider.registrations.models[0];

        await visit(`/registries/discover?provider=${anotherProvider.shareSourceKey}&q=${searchableReg.title}`);

        await percySnapshot('with initial query params');

        assert.dom('[data-test-search-box]').hasValue(searchableReg.title, 'Search box has initial value');

        assert.dom(`[data-test-source-filter-id='${anotherProvider.shareSourceKey}']`).isChecked();
        assert.dom(
            `[data-test-source-filter-id]:not([data-test-source-filter-id='${anotherProvider.shareSourceKey}'])`,
        ).isNotChecked();

        assert.dom('[data-test-result-title-id]').exists({ count: 1 }, 'Initial search uses initial params');
    });
});
