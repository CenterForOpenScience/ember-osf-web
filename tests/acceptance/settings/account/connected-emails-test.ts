import { fillIn, visit } from '@ember/test-helpers';

import setupMirage from 'ember-cli-mirage/test-support/setup-mirage';
import { percySnapshot } from 'ember-percy';
import { module, test } from 'qunit';

import { click, setupOSFApplicationTest } from 'ember-osf-web/tests/helpers';

module('Acceptance | settings | account information page', hooks => {
    setupOSFApplicationTest(hooks);
    setupMirage(hooks);

    // primary email exists
    test('primary email exists', async assert => {
        server.create('user', 'loggedIn', 'withSettings');

        await visit('/settings/account');
        await percySnapshot(assert);

        assert.dom('[data-test-primary-email]').exists();
    });

    // empty alternate/unconfirmed emails list
    test('empty email lists', async assert => {
        server.create('user', 'loggedIn', 'withSettings');

        await visit('/settings/account');
        await percySnapshot(assert);

        assert.dom('[data-test-alternate-email-item]').doesNotExist();
        assert.dom('[data-test-unconfirmed-email-item]').doesNotExist();
    });

    test('email lists have emails', async assert => {
        server.create('user', 'loggedIn', 'withSettings', 'withAlternateEmail', 'withUnconfirmedEmail');

        await visit('/settings/account');
        await percySnapshot(assert);

        assert.dom('[data-test-alternate-email-item]').exists({ count: 1 });
        assert.dom('[data-test-unconfirmed-email-item]').exists({ count: 1 });
    });

    // add new email
    test('add new email', async assert => {
        server.create('user', 'loggedIn', 'withSettings');
        const emailAddress = 'testAccount@gmail.com';

        await visit('/settings/account');

        assert.dom('[data-test-unconfirmed-email-item]').doesNotExist();

        await fillIn('[data-test-add-email] input', emailAddress);
        await click('[data-test-add-email-button]');
        await percySnapshot(assert);

        assert.dom(`[data-test-unconfirmed-email-item='${emailAddress}']`).exists();
    });

    // remove alternate email
    test('delete alternate email', async assert => {
        const user = server.create('user', 'loggedIn', 'withSettings', 'withAlternateEmail');

        const { emailAddress } = user.emails.models[1];

        await visit('/settings/account');

        assert.dom(`[data-test-alternate-email-item='${emailAddress}']`).exists();

        await click(`[data-test-alternate-email-item='${emailAddress}']
            [data-test-alternate-delete] [data-test-delete-button]`);

        await percySnapshot(assert);
        await click('[data-test-confirm-delete]');

        assert.dom(`[data-test-alternate-email-item='${emailAddress}']`).doesNotExist();
    });

    // make primary
    test('make email primary', async assert => {
        const user = server.create('user', 'loggedIn', 'withSettings', 'withAlternateEmail');

        const { emailAddress } = user.emails.models[1];

        await visit('/settings/account');
        assert.dom(`[data-test-alternate-email-item='${emailAddress}']`).exists();

        await click('[data-test-make-primary]');
        await percySnapshot(assert);
        assert.dom('[data-test-primary-email]').hasText(emailAddress);
    });

    // test resend_confirmation url
    test('resend confirmation', async assert => {
        assert.expect(2);

        const done = assert.async();

        const user = server.create('user', 'loggedIn', 'withSettings', 'withUnconfirmedEmail');

        const { emailAddress } = user.emails.models[1];

        server.namespace = '/v2';
        server.get('/users/:parentID/settings/emails/:emailID/', (_, request) => {
            assert.equal(request.queryParams.resend_confirmation, 'true');
            done();
        });

        await visit('/settings/account');

        await click(`[data-test-unconfirmed-email-item='${emailAddress}']
        [data-test-resend-confirmation-button]`);

        await percySnapshot(assert);
        await click('[data-test-resend-confirmation]');
    });
});
