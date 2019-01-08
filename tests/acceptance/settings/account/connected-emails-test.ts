import { click, fillIn, visit } from '@ember/test-helpers';

import setupMirage from 'ember-cli-mirage/test-support/setup-mirage';
import { percySnapshot } from 'ember-percy';
import { module, test } from 'qunit';

import { setupOSFApplicationTest } from 'ember-osf-web/tests/helpers';

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

        assert.dom('[data-test-alternate-email]').doesNotExist();
        assert.dom('[data-test-unconfirmed-email]').doesNotExist();
    });

    test('email lists have emails', async assert => {
        server.create('user', 'loggedIn', 'withSettings', 'withAlternateEmail', 'withUnconfirmedEmail');

        await visit('/settings/account');
        await percySnapshot(assert);

        assert.dom('[data-test-alternate-email]').exists();
        assert.dom('[data-test-unconfirmed-email]').exists();
    });

    // add new email
    test('add new email', async assert => {
        server.create('user', 'loggedIn', 'withSettings');
        const emailAddress = 'testAccount@gmail.com';

        await visit('/settings/account');

        assert.dom('[data-test-unconfirmed-email]').doesNotExist();

        await fillIn('[data-test-add-email] input', emailAddress);
        await click('[data-test-add-email-button]');
        await percySnapshot(assert);

        assert.dom('[data-test-unconfirmed-email]').exists();
    });

    // remove alternate email
    test('delete alternate email', async assert => {
        server.create('user', 'loggedIn', 'withSettings', 'withAlternateEmail');

        await visit('/settings/account');

        assert.dom('[data-test-alternate-email]').exists();

        await click('[data-test-delete-button]');
        await percySnapshot(assert);

        await click('[data-test-confirm-delete]');

        assert.dom('[data-test-alternate-email]').doesNotExist();
    });

    // make primary
    test('make email primary', async assert => {
        server.create('user', 'loggedIn', 'withSettings', 'withAlternateEmail');

        await visit('/settings/account');

        const emailAddress = $('[data-test-alternate-email]').val();

        await click('[data-test-make-primary]');
        await percySnapshot(assert);

        const primaryEmail = $('[data-test-primary-email]').val();
        assert.equal(primaryEmail, emailAddress);
    });
});
