import { visit } from '@ember/test-helpers';
import setupMirage from 'ember-cli-mirage/test-support/setup-mirage';
import { percySnapshot } from 'ember-percy';
import { module, test } from 'qunit';

import { click, setupOSFApplicationTest } from 'ember-osf-web/tests/helpers';

module('Acceptance | settings/account | export', hooks => {
    setupOSFApplicationTest(hooks);
    setupMirage(hooks);

    test('it works', async assert => {
        const currentUser = server.create('user', 'loggedIn');
        server.create('user-setting', { user: currentUser });
        await visit('/settings/account');
        assert.dom('[data-test-export-panel]').exists('Initial state');
        assert.dom('[data-test-confirm-export-submit]').doesNotExist('Initial state');
        await click('[data-analytics-name="Export request"]');
        assert.dom('[data-test-confirm-export-submit]').exists('First attempt');
        percySnapshot(assert);
        assert.dom('[data-test-export-cancel]').exists('First attempt');
        await click('[data-test-export-cancel]');
        assert.dom('[data-test-confirm-export-submit]').doesNotExist('Cancelled');
        await click('[data-analytics-name="Export request"]');
        assert.dom('[data-test-confirm-export-submit]').exists('Second attempt');
        await click('[data-test-confirm-export-submit]');
        assert.dom('[data-test-confirm-export-submit]').doesNotExist('Final state');
    });
});
