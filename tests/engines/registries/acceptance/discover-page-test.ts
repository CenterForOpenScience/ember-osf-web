// import Service from '@ember/service';
// import { click, currentRouteName, currentURL, fillIn, settled, triggerKeyEvent } from '@ember/test-helpers';
import setupMirage from 'ember-cli-mirage/test-support/setup-mirage';
// import { t } from 'ember-intl/test-support';
import { percySnapshot } from 'ember-percy';
// import { setBreakpoint } from 'ember-responsive/test-support';
import { TestContext, fillIn, click } from 'ember-test-helpers';
import { module, test } from 'qunit';

import { visit } from 'ember-osf-web/tests/helpers';
import { setupEngineApplicationTest } from 'ember-osf-web/tests/helpers/engines';
// import { deserializeResponseKey } from 'ember-osf-web/transforms/registration-response-key';

// const currentUserStub = Service.extend();
// const storeStub = Service.extend();
// const analyticsStub = Service.extend();

// function getHrefAttribute(selector: string) {
//     return document.querySelector(selector)!.getAttribute('href');
// }

module('Registries | Acceptance | aggregate discover', hooks => {
    setupEngineApplicationTest(hooks, 'registries');
    setupMirage(hooks);

    hooks.beforeEach(function(this: TestContext) {
        /*
        server.loadFixtures('schema-blocks');
        server.loadFixtures('registration-schemas');
        server.loadFixtures('licenses');
        */
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
        await percySnapshot('happy path');
        const registrationIds = server.schema.registrations.all().models.map(item => item.id);
        for (const id of registrationIds) {
            assert.dom(`[data-test-result-title-id=${id}]`).exists();
        }
        assert.dom(`[data-test-sort-dropdown]`).exists(); // TODO: see if one of thse fails and get rid of redundant
        assert.dom(`[data-test-sort-dropdown="true"]`).exists('Sort dropdown exists');
        assert.dom(`[data-test-active-filter]`).doesNotExist('No filters are applied by default');
        assert.dom(`[data-test-source-filter-id]`).exists({ count: 3 }, 'Three sources exist');
        assert.dom(`[data-test-page-number]`).doesNotExist('No pagination for less than 10 registrations');

        await fillIn(`[data-test-search-box]`, 'registrations are the best');
    });
    // path with different initial state:
    // - arrive at page WITH query params
    // - take percy snapshot
    // - assert initial search reflects query params
    // - assert filter checkbox is checked
    // - uncheck filter
    // - assert search reflects new query
    // - assert filter checkbox is unchecked
    //
    // query returns no result:
    // - assert the page shows no result help text
    // - take percy snapshot
});
