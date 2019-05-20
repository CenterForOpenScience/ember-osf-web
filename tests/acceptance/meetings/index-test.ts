import { currentURL, visit } from '@ember/test-helpers';
import setupMirage from 'ember-cli-mirage/test-support/setup-mirage';
import { percySnapshot } from 'ember-percy';
import { module, test } from 'qunit';

import { setupOSFApplicationTest } from 'ember-osf-web/tests/helpers';

module('Acceptance | meetings | index', hooks => {
    setupOSFApplicationTest(hooks);
    setupMirage(hooks);

    test('meetings index exists', async assert => {
        await visit('/meetings');
        assert.equal(currentURL(), '/meetings', "Still at '/meetings'.");
        await percySnapshot(assert);
    });
});
