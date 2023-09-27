import { currentURL, visit } from '@ember/test-helpers';
import { setupMirage } from 'ember-cli-mirage/test-support';
import { module, test } from 'qunit';

import { setupOSFApplicationTest } from 'ember-osf-web/tests/helpers';

module('Acceptance | settings | profile | menu', hooks => {
    setupOSFApplicationTest(hooks);
    setupMirage(hooks);

    test('visit settings page', async function(assert) {
        server.create('user', 'loggedIn');
        await visit('/settings/');

        assert.equal(currentURL(), '/settings/profile/name', 'Went to the Applications route.');
    });

    test('visit settings profile page', async function(assert) {
        server.create('user', 'loggedIn');
        await visit('/settings/profile');

        assert.equal(currentURL(), '/settings/profile/name', 'Went to the Applications route.');
    });
});
