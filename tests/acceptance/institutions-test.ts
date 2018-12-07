import { currentURL, visit } from '@ember/test-helpers';
import setupMirage from 'ember-cli-mirage/test-support/setup-mirage';
import { percySnapshot } from 'ember-percy';
import { module, test } from 'qunit';

import { setupOSFApplicationTest } from 'ember-osf-web/tests/helpers';

module('Acceptance | institutions', hooks => {
    setupOSFApplicationTest(hooks);
    setupMirage(hooks);

    test('visiting /institutions', async assert => {
        await visit('/institutions');

        assert.equal(currentURL(), '/institutions');

        await percySnapshot(assert);
    });
});
