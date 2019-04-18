import { fillIn, visit } from '@ember/test-helpers';

import setupMirage from 'ember-cli-mirage/test-support/setup-mirage';
import { TestContext } from 'ember-test-helpers';
import { module, test } from 'qunit';
import sinon, { SinonStub } from 'sinon';

import CurrentUser from 'ember-osf-web/services/current-user';
import { click, setupOSFApplicationTest } from 'ember-osf-web/tests/helpers';

module('Acceptance | settings/account | change password', hooks => {
    setupOSFApplicationTest(hooks);
    setupMirage(hooks);

    hooks.beforeEach(function(this: TestContext) {
        // Stub currentUser.logout
        const currentUser = this.owner.lookup('service:current-user') as CurrentUser & { logout: SinonStub };
        currentUser.set('logout', sinon.stub(currentUser, 'logout'));
    });

    // Changing password works
    test('it works', async function(this: TestContext, assert) {
        server.create('user', 'loggedIn', 'withSettings');

        await visit('/settings/account');

        const currentPassword = 'oldpassword';
        const newPassword = 'oldpassword239901abc';
        await fillIn('[data-test-current-password] input', currentPassword);
        await fillIn('[data-test-new-password] input', newPassword);
        await fillIn('[data-test-confirm-password] input', newPassword);

        await click('[data-test-update-password-button]');
        const currentUser = this.owner.lookup('service:current-user') as CurrentUser & { logout: SinonStub };
        assert.ok(currentUser.logout.called, 'User is logged out after successful password change');
    });

    // Changing password fails with wrong current password
    test('wrong current password', async function(this: TestContext, assert) {
        server.create('user', 'loggedIn', 'withSettings');

        await visit('/settings/account');

        const currentPassword = 'wrongPassword';
        const newPassword = 'oldpassword239901abc';

        await fillIn('[data-test-current-password] input', currentPassword);
        await fillIn('[data-test-new-password] input', newPassword);
        await fillIn('[data-test-confirm-password] input', newPassword);

        await click('[data-test-update-password-button]');
        const currentUser = this.owner.lookup('service:current-user') as CurrentUser & { logout: SinonStub };
        assert.ok(currentUser.logout.notCalled, 'User is not logged out on unsuccessful password change');
    });
});
