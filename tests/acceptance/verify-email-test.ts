import { click, visit } from '@ember/test-helpers';

import { ModelInstance } from 'ember-cli-mirage';
import setupMirage from 'ember-cli-mirage/test-support/setup-mirage';
import { setupApplicationTest } from 'ember-qunit';
import { module, test } from 'qunit';

import User from 'ember-osf-web/models/user';
import UserEmail from 'ember-osf-web/models/user-email';

function unverifiedEmails(user: ModelInstance<User>) {
    return (user.emails.models as Array<ModelInstance<UserEmail>>)
        .filter(email => !email.verified)
        .sort((a, b) => parseInt(b.id, 10) - parseInt(a.id, 10));
}

module('Acceptance | verify email', hooks => {
    setupApplicationTest(hooks);
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

        await click('[data-test-verify-email]');

        user.reload();
        assert.dom('[data-test-verify-email-prompt').doesNotExist();
        assert.equal(user.emails.length, beforeCount, 'Correct number of user emails');
        assert.ok(user.emails.models.every(
            (email: ModelInstance<UserEmail>) => email.verified,
        ), 'All user emails verified');
    });

    test('verify emails', async assert => {
        const user = server.create<User>('user', 'loggedIn', 'withUnverifiedEmail');
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
        assert.ok(user.emails.models.every(
            (email: ModelInstance<UserEmail>) => email.verified,
        ), 'All user emails verified');
    });

    test('deny email', async assert => {
        const user = server.create<User>('user', 'loggedIn', 'withUnverifiedEmail');
        // @ts-ignore TODO: upgrade ember types
        const beforeCount: number = user.emails.length;

        await visit('/dashboard');

        assert.dom('[data-test-verify-email-prompt]').exists();

        await click('[data-test-deny-email]');

        user.reload();
        assert.dom('[data-test-verify-email-prompt').doesNotExist();
        assert.equal(user.emails.length, beforeCount - 1, 'Correct number of user emails');
        assert.ok(user.emails.models.every(
            (email: ModelInstance<UserEmail>) => email.verified,
        ), 'All user emails verified');
    });

    test('deny emails', async assert => {
        const user = server.create<User>('user', 'loggedIn', 'withUnverifiedEmails');
        // @ts-ignore TODO: upgrade ember types
        const beforeCount: number = user.emails.length;

        await visit('/dashboard');

        const emails = unverifiedEmails(user);
        for (const unverifiedEmail of emails) {
            const { emailAddress } = unverifiedEmail;
            assert.dom('[data-test-verify-email-prompt]').hasText(
                unverifiedEmail.isMerge ?
                    `Would you like to merge ${emailAddress} into your account? This action is irreversible.` :
                    `Would you like to add ${emailAddress} to your account?`,
            );
            await click('[data-test-deny-email]');
        }

        user.reload();
        assert.dom('[data-test-verify-email-prompt').doesNotExist();
        assert.equal(user.emails.length, beforeCount - 2, 'Correct number of user emails');
        assert.ok(user.emails.models.every(
            (email: ModelInstance<UserEmail>) => email.verified,
        ), 'All user emails verified');
    });
});
