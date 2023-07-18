import { click as untrackedClick, currentRouteName, currentURL, fillIn, visit, waitFor } from '@ember/test-helpers';

import { setupMirage } from 'ember-cli-mirage/test-support';
import { percySnapshot } from 'ember-percy';
import { module, test } from 'qunit';

import { click, setupOSFApplicationTest } from 'ember-osf-web/tests/helpers';
import { timeout } from 'ember-concurrency';

module('Acceptance | settings | personal access tokens', hooks => {
    setupOSFApplicationTest(hooks);
    setupMirage(hooks);

    test('visit page', async function(assert) {
        server.create('user', 'loggedIn');
        await visit('/settings/tokens');

        assert.equal(currentURL(), '/settings/tokens', 'Went to the PAT route.');
    });

    test('empty tokens list', async function(assert) {
        server.create('user', 'loggedIn');

        await visit('/settings/tokens');

        assert.dom('[data-test-token-card]').doesNotExist();
    });

    test('tokens list', async function(assert) {
        server.create('user', 'loggedIn');
        server.createList('token', 7);

        await visit('/settings/tokens');

        assert.dom('[data-test-token-card]').exists({ count: 7 });
    });

    test('long tokens list', async function(assert) {
        server.create('user', 'loggedIn');
        server.createList('token', 27);

        await visit('/settings/tokens');

        assert.dom('[data-test-token-card]').exists({ count: 10 });
        await percySnapshot(assert);
    });

    test('create token', async function(assert) {
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
        await timeout(50);
        assert.dom('[data-test-new-token-value]').exists();

        await visit('/settings/tokens');

        assert.dom('[data-test-token-card]').exists({ count: 1 });
    });

    test('edit token', async function(assert) {
        server.create('user', 'loggedIn');

        const oldName = 'token the grey';
        const newName = 'token the white';
        const token = server.create('token', { name: oldName });

        await visit('/settings/tokens');
        const link = `[data-test-token-link='${token.id}']`;
        await waitFor(link, { timeout: 10000 });
        assert.dom(link).exists({ count: 1 });
        assert.dom(link).containsText(oldName);

        await click(link);

        const input = '[data-test-token-name] input';
        await waitFor(`${input}:enabled`);

        assert.equal(currentRouteName(), 'settings.tokens.edit', 'current route is settings.tokens.edit');
        assert.ok(currentURL().includes(`${token.id}`), 'current URL has token id');

        assert.dom(input).hasValue(oldName);
        await fillIn(input, newName);
        await percySnapshot(assert);
        await click('[data-analytics-name="Save"]');
        await timeout(50);
        assert.equal(currentRouteName(), 'settings.tokens.index', 'current route is settings.tokens.index');

        await waitFor(link, { timeout: 10000 });
        assert.dom(link).exists({ count: 1 });
        assert.dom(link).containsText(newName);
    });

    test('delete token', async function(assert) {
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
