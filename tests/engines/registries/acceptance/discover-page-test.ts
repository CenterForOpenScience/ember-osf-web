// import Service from '@ember/service';
// import { click, currentRouteName, currentURL, fillIn, settled, triggerKeyEvent } from '@ember/test-helpers';
import setupMirage from 'ember-cli-mirage/test-support/setup-mirage';
// import { t } from 'ember-intl/test-support';
// import { percySnapshot } from 'ember-percy';
// import { setBreakpoint } from 'ember-responsive/test-support';
import { TestContext } from 'ember-test-helpers';
import { module /*, test */ } from 'qunit';

// import { visit } from 'ember-osf-web/tests/helpers';
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
        server.create('registration-provider', { id: 'osf' });
        server.create('registration-provider', { id: 'another' });
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
    //
    // happy path:
    // - arrive at the page (no query params)
    // - take percy snapshot
    // - assert search results exist
    // - important controls exist
    // - enter query -- search happens
    // - click filters -- search happens
    // - assert paginator exists
    //
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
