import { currentURL, visit } from '@ember/test-helpers';
import setupMirage from 'ember-cli-mirage/test-support/setup-mirage';
import { percySnapshot } from 'ember-percy';
import { module, test } from 'qunit';

import { setupOSFApplicationTest } from 'ember-osf-web/tests/helpers';

const moduleName = 'Acceptance | institutions | index';

module(moduleName, hooks => {
    setupOSFApplicationTest(hooks);
    setupMirage(hooks);

    test('institutions index', async assert => {
        server.createList('institution', 15);
        await visit('/institutions');
        assert.equal(currentURL(), '/institutions', "Still at '/institutions'.");
        await percySnapshot(`${moduleName} - default`);
    });
});
