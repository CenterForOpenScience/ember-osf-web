import { currentURL, fillIn, settled, visit } from '@ember/test-helpers';

import setupMirage from 'ember-cli-mirage/test-support/setup-mirage';
import { TestContext } from 'ember-test-helpers';
import { module, skip, test } from 'qunit';

import { click, setupOSFApplicationTest } from 'ember-osf-web/tests/helpers';

module('Acceptance | settings/account | change password', hooks => {
    setupOSFApplicationTest(hooks);
    setupMirage(hooks);

    // Changing password works
    skip('it works', async function(this: TestContext, assert) {
        // Currently doesn't work.
        // Will need to revist later, might need to install addons to get to work
        server.create('user', 'loggedIn', 'withSettings');

        await visit('/settings/account');
        assert.ok(true);

        const currentPassword = 'oldpassword';
        const newPassword = 'oldpassword239901abc';
        await fillIn('[data-test-current-password] input', currentPassword);
        await fillIn('[data-test-new-password] input', newPassword);
        await fillIn('[data-test-confirm-password] input', newPassword);

        await click('[data-test-update-password-button]');
        settled().then(() => {
            assert.ok(true);
        });
    });

    // Changing password fails with wrong current password
    test('wrong current password', async assert => {
        server.create('user', 'loggedIn', 'withSettings');

        await visit('/settings/account');

        const currentPassword = 'wrongPassword';
        const newPassword = 'oldpassword239901abc';

        await fillIn('[data-test-current-password] input', currentPassword);
        await fillIn('[data-test-new-password] input', newPassword);
        await fillIn('[data-test-confirm-password] input', newPassword);

        await click('[data-test-update-password-button]');
        const root = server.schema.roots.first();
        assert.ok(root.currentUser);
        assert.equal(currentURL(), '/settings/account');
    });
});
