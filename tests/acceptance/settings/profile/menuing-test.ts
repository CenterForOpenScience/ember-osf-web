import { currentURL, visit } from '@ember/test-helpers';
import setupMirage from 'ember-cli-mirage/test-support/setup-mirage';
import { module, test } from 'qunit';

import { setupOSFApplicationTest } from 'ember-osf-web/tests/helpers';

module('Acceptance | settings | profile | menu', hooks => {
    setupOSFApplicationTest(hooks);
    setupMirage(hooks);

    test('visit settings page', async assert => {
        server.create('user', 'loggedIn');
        await visit('/settings/');

        assert.equal(currentURL(), '/settings/profile/name', 'Went to the Applications route.');
    });

    test('visit settings profile page', async assert => {
        server.create('user', 'loggedIn');
        await visit('/settings/profile');

        assert.equal(currentURL(), '/settings/profile/name', 'Went to the Applications route.');
    });
});
