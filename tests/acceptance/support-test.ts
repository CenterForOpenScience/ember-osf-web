import { currentURL, visit } from '@ember/test-helpers';
import setupMirage from 'ember-cli-mirage/test-support/setup-mirage';
import { percySnapshot } from 'ember-percy';
import { module, test } from 'qunit';

import { setupOSFApplicationTest } from 'ember-osf-web/tests/helpers';

module('Acceptance | support', hooks => {
    setupOSFApplicationTest(hooks);
    setupMirage(hooks);

    test('visiting /support', async assert => {
        await visit('/support');

        assert.equal(currentURL(), '/support');

        await percySnapshot(assert);
    });
});
