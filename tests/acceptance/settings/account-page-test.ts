import { click, fillIn, visit } from '@ember/test-helpers';

import setupMirage from 'ember-cli-mirage/test-support/setup-mirage';
import { setupApplicationTest } from 'ember-qunit';
import { module, test } from 'qunit';

module('Acceptance | settings | account information page', hooks => {
    setupApplicationTest(hooks);
    setupMirage(hooks);

    // primary email exists
    test('primary email exists', async assert => {
        server.create('user', 'loggedIn');

        await visit('/settings/account');

        assert.dom('[data-test-primary-email]').exists();
    });

    // empty alternate/unconfirmed emails list
    test('empty alternate emails list', async assert => {
        server.create('user', 'loggedIn');

        await visit('/settings/account');

        assert.dom('[data-test-alternate-email]').doesNotExist();
        assert.dom('[data-test-unconfirmed-email]').doesNotExist();
    });

    // add new email
    test('add new email', async assert => {
        server.create('user', 'loggedIn');
        const emailAddress = 'testAccount@gmail.com';

        await visit('/settings/account');

        assert.dom('[data-test-unconfirmed-email]').doesNotExist();

        await fillIn('[data-test-add-email] input', emailAddress);
        await click('[data-test-add-email-button]');

        assert.dom('[data-test-unconfirmed-email]').exists();
    });

    // remove email
    test('delete email', async assert => {
        server.create('user', 'loggedIn', 'withAlternateEmails');

        await visit('/settings/account');

        assert.dom('[data-test-alternate-email]').exists();

        await click('[data-test-remove-email]');

        assert.dom('[data-test-alternate-email]').doesNotExist();
    });

    // make primary
    test('make email primary', async assert => {
        server.create('user', 'loggedIn', 'withAlternateEmails');

        await visit('/settings/account');

        const emailAddress = $('[data-test-alternate-email]').val();

        await click('[data-test-make-primary]');

        const primaryEmail = $('[data-test-primary-email]').val();
        assert.equal(primaryEmail, emailAddress);
    });
});
