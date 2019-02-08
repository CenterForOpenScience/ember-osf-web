import { visit } from '@ember/test-helpers';

import { ModelInstance } from 'ember-cli-mirage';
import setupMirage from 'ember-cli-mirage/test-support/setup-mirage';
import { percySnapshot } from 'ember-percy';
import { module, test } from 'qunit';

import User from 'ember-osf-web/models/user';
import { click, setupOSFApplicationTest } from 'ember-osf-web/tests/helpers';

function unverifiedEmails(user: ModelInstance<User>) {
    return user.emails.models
        .filter(email => !email.verified)
        .sort((a, b) => parseInt(b.id, 10) - parseInt(a.id, 10));
}

module('Acceptance | verify email', hooks => {
    setupOSFApplicationTest(hooks);
    setupMirage(hooks);

    test('no unverified emails', async assert => {
        server.create('user', 'loggedIn');

        await visit('/dashboard');

        assert.dom('[data-test-verify-email-prompt]').doesNotExist();
    });

    test('verify email', async assert => {
        const user = server.create('user', 'loggedIn', 'withUnverifiedEmail');
        const beforeCount = user.emails.length;

        await visit('/dashboard');

        assert.dom('[data-test-verify-email-prompt]').exists();
        await percySnapshot(assert);

        await click('[data-test-verify-email]');

        user.reload();
        assert.dom('[data-test-verify-email-prompt').doesNotExist();
        assert.equal(user.emails.length, beforeCount, 'Correct number of user emails');
        assert.ok(user.emails.models.every(email => email.verified), 'All user emails verified');
    });

    test('verify emails', async assert => {
        const user = server.create('user', 'loggedIn', 'withUnverifiedEmail');
        const beforeCount = user.emails.length;
        await visit('/dashboard');

        const emails = unverifiedEmails(user);
        for (const unverifiedEmail of emails) {
            const { emailAddress } = unverifiedEmail;
            assert.dom('[data-test-verify-email-prompt]').hasText(
                unverifiedEmail.isMerge ?
                    `Would you like to merge ${emailAddress} into your account? This action is irreversible.` :
                    `Would you like to add ${emailAddress} to your account?`,
            );
            await click('[data-test-verify-email]');
        }

        user.reload();
        assert.dom('[data-test-verify-email-prompt').doesNotExist();
        assert.equal(user.emails.length, beforeCount, 'Correct number of user emails');
        assert.ok(user.emails.models.every(email => email.verified), 'All user emails verified');
    });

    test('deny email', async assert => {
        const user = server.create('user', 'loggedIn', 'withUnverifiedEmail');
        const beforeCount = user.emails.length;

        await visit('/dashboard');

        assert.dom('[data-test-verify-email-prompt]').exists();

        await click('[data-test-deny-email]');

        user.reload();
        assert.dom('[data-test-verify-email-prompt').doesNotExist();
        assert.equal(user.emails.length, beforeCount - 1, 'Correct number of user emails');
        assert.ok(user.emails.models.every(email => email.verified), 'All user emails verified');
    });

    test('deny emails', async assert => {
        const user = server.create('user', 'loggedIn', 'withUnverifiedEmails');
        const beforeCount = user.emails.length;

        await visit('/dashboard');

        const emails = unverifiedEmails(user);
        for (const unverifiedEmail of emails) {
            const { emailAddress, isMerge } = unverifiedEmail;
            assert.dom('[data-test-verify-email-prompt]').hasText(
                isMerge ?
                    `Would you like to merge ${emailAddress} into your account? This action is irreversible.` :
                    `Would you like to add ${emailAddress} to your account?`,
            );
            await click('[data-test-deny-email]');
        }

        user.reload();
        assert.dom('[data-test-verify-email-prompt').doesNotExist();
        assert.equal(user.emails.length, beforeCount - 2, 'Correct number of user emails');
        assert.ok(user.emails.models.every(email => email.verified), 'All user emails verified');
    });
});
