import { currentURL, visit } from '@ember/test-helpers';
import setupMirage from 'ember-cli-mirage/test-support/setup-mirage';
import { module, test } from 'qunit';

import { setupOSFApplicationTest } from 'ember-osf-web/tests/helpers';

module('Acceptance | foo', hooks => {
    setupOSFApplicationTest(hooks);
    setupMirage(hooks);

    test('visiting /foo', async assert => {
        await visit('/foo');

        assert.equal(currentURL(), '/foo');
    });
});
