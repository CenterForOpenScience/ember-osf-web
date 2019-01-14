import { click as untrackedClick, currentURL, fillIn, visit, waitFor } from '@ember/test-helpers';

import setupMirage from 'ember-cli-mirage/test-support/setup-mirage';
import { percySnapshot } from 'ember-percy';
import { module, test } from 'qunit';

import { click, setupOSFApplicationTest } from 'ember-osf-web/tests/helpers';

module('Acceptance | settings | personal access tokens', hooks => {
    setupOSFApplicationTest(hooks);
    setupMirage(hooks);

    test('visit page', async assert => {
        server.create('user', 'loggedIn');
        await visit('/settings/tokens');

        assert.equal(currentURL(), '/settings/tokens', 'Went to the PAT route.');
    });

    test('empty tokens list', async assert => {
        server.create('user', 'loggedIn');

        await visit('/settings/tokens');

        assert.dom('[data-test-token-card]').doesNotExist();
    });

    test('tokens list', async assert => {
        server.create('user', 'loggedIn');
        server.createList('token', 7);

        await visit('/settings/tokens');

        assert.dom('[data-test-token-card]').exists({ count: 7 });
    });

    test('long tokens list', async assert => {
        server.create('user', 'loggedIn');
        server.createList('token', 27);

        await visit('/settings/tokens');

        assert.dom('[data-test-token-card]').exists({ count: 10 });
        await percySnapshot(assert);
    });

    test('create token', async assert => {
        server.create('user', 'loggedIn');
        server.create('scope');
        const tokenName = 'my token!';

        await visit('/settings/tokens');

        assert.dom('[data-test-token-card]').doesNotExist();

        await visit('/settings/tokens/create');

        await fillIn('[data-test-token-name] input', tokenName);
        await untrackedClick('[data-test-scope] input[type=checkbox]');
        await percySnapshot(assert);
        await click('[data-analytics-name="Submit button"]');

        assert.dom('[data-test-new-token-value]').exists();

        await visit('/settings/tokens');

        assert.dom('[data-test-token-card]').exists({ count: 1 });
    });

    test('edit token', async assert => {
        server.create('user', 'loggedIn');

        const oldName = 'token the grey';
        const newName = 'token the white';
        const token = server.create('token', { name: oldName });

        await visit('/settings/tokens');

        const link = `[data-test-token-link='${token.id}']`;
        assert.dom(link).exists({ count: 1 });
        assert.dom(link).containsText(oldName);

        await click(link);

        const input = '[data-test-token-name] input';
        await waitFor(`${input}:enabled`);

        assert.equal(currentURL(), `/settings/tokens/${token.id}`);

        assert.dom(input).hasValue(oldName);
        await fillIn(input, newName);
        await percySnapshot(assert);
        await click('[data-analytics-name="Save"]');

        assert.equal(currentURL(), '/settings/tokens');

        assert.dom(link).exists({ count: 1 });
        assert.dom(link).containsText(newName);
    });

    test('delete token', async assert => {
        server.create('user', 'loggedIn');

        const [token] = server.createList('token', 2);

        await visit('/settings/tokens');

        const card = `[data-test-token-card='${token.id}']`;
        assert.dom('[data-test-token-card]').exists({ count: 2 });
        assert.dom(card).exists({ count: 1 });

        await click(`${card} [data-test-delete-button]`);
        await percySnapshot(assert);
        await click('[data-test-confirm-delete]');

        assert.dom('[data-test-token-card]').exists({ count: 1 });
        assert.dom(card).doesNotExist();
    });
});
