import { /* click, currentURL, fillIn, */ visit } from '@ember/test-helpers';

import setupMirage from 'ember-cli-mirage/test-support/setup-mirage';
import { setupApplicationTest } from 'ember-qunit';
import { module, test } from 'qunit';

module('Acceptance | settings | personal access tokens', hooks => {
    setupApplicationTest(hooks);
    setupMirage(hooks);

    test('empty tokens list', async assert => {
        server.create('user', 'loggedIn');

        await visit('/settings/tokens');

        assert.dom('[data-test-token-list]').exists();
        assert.dom('[data-test-no-tokens]').exists();
    });

    test('tokens list', async assert => {
        server.create('user', 'loggedIn');
        server.createList('token', 7);

        await visit('/settings/tokens');

        assert.dom('[data-test-token-list]').exists();
        assert.dom('[data-test-no-tokens]').doesNotExist();
        assert.dom('[data-test-token-link]').exists({ count: 7 });
    });

    test('long tokens list', async assert => {
        server.create('user', 'loggedIn');
        server.createList('token', 27);

        await visit('/settings/tokens');

        assert.dom('[data-test-token-list]').exists();
        assert.dom('[data-test-no-tokens]').doesNotExist();
        assert.dom('[data-test-token-link]').exists({ count: 10 });
    });
    /*

    test('create token', async assert => {
    });

    test('delete token', async assert => {
    });

    test('edit token', async assert => {
    });
    */
});
