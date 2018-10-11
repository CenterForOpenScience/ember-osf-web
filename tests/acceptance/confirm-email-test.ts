import { click, visit } from '@ember/test-helpers';

import setupMirage from 'ember-cli-mirage/test-support/setup-mirage';
import { setupApplicationTest } from 'ember-qunit';
import { module, test } from 'qunit';

module('Acceptance | confirm email', hooks => {
    setupApplicationTest(hooks);
    setupMirage(hooks);

    test('no unverified emails', async assert => {
        server.create('user', 'loggedIn');

        await visit('/dashboard');

        assert.dom('[data-test-verify-email-prompt]').doesNotExist();
    });

    test('verify email', async assert => {
        const user = server.create('user', 'loggedIn', 'withUnverifiedEmail');

        await visit('/dashboard');

        assert.dom('[data-test-verify-email-prompt]').exists();

        await click('[data-test-verify-email]');

        console.log(user);
        debugger;
    });
});
