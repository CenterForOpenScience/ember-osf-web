import { currentURL, fillIn, settled, visit, waitFor } from '@ember/test-helpers';
import setupMirage from 'ember-cli-mirage/test-support/setup-mirage';
import { percySnapshot } from 'ember-percy';
import { module, test } from 'qunit';

import { click, setupOSFApplicationTest } from 'ember-osf-web/tests/helpers';

module('Acceptance | settings | developer apps', hooks => {
    setupOSFApplicationTest(hooks);
    setupMirage(hooks);

    test('visit page', async assert => {
        server.create('user', 'loggedIn');
        await visit('/settings/applications');

        assert.equal(currentURL(), '/settings/applications', 'Went to the Applications route.');
    });

    test('empty app list', async assert => {
        server.create('user', 'loggedIn');
        await visit('/settings/applications');
        assert.dom('[data-test-developer-app-card]').doesNotExist();
    });

    test('apps list', async assert => {
        server.create('user', 'loggedIn');
        server.createList('developer-app', 7);

        await visit('/settings/applications');

        assert.dom('[data-test-developer-app-card]').exists({ count: 7 });
    });

    test('long apps list', async assert => {
        server.create('user', 'loggedIn');
        server.createList('developer-app', 27);

        await visit('/settings/applications');

        assert.dom('[data-test-developer-app-card]').exists({ count: 10 });
        await percySnapshot(assert);
    });

    test('create app', async assert => {
        server.create('user', 'loggedIn');
        const appName = 'my app!';

        await visit('/settings/applications');

        assert.dom('[data-test-developer-app-card]').doesNotExist();

        await click('[data-test-create-app-link]');

        await fillIn('[data-test-developer-app-name] input', appName);
        await fillIn('[data-test-developer-app-homepage] input', 'http://osf.io/');
        await fillIn('[data-test-developer-app-callback-url] input', 'https://osf.io/');
        await percySnapshot(assert);
        await click('[data-test-create-developer-app-button]');
        await percySnapshot('Acceptance | settings | developer apps | create app | create');

        assert.dom('[data-test-client-secret]').exists();

        await visit('/settings/applications');

        assert.dom('[data-test-developer-app-card]').exists({ count: 1 });
    });

    test('edit app', async assert => {
        server.create('user', 'loggedIn');

        const oldName = 'app the grey';
        const newName = 'app the white';
        const app = server.create('developer-app', { name: oldName });

        await visit('/settings/applications');

        const link = `[data-test-developer-app-link='${app.id}']`;
        assert.dom(link).exists({ count: 1 });
        assert.dom(link).containsText(oldName);

        await click(link);

        const input = '[data-test-developer-app-name] input';
        await waitFor(`${input}:enabled`);

        assert.equal(currentURL(), `/settings/applications/${app.id}`);

        assert.dom(input).hasValue(oldName);
        await fillIn(input, newName);
        await percySnapshot(assert);
        await click('[data-test-save-developer-app-button]');

        assert.equal(currentURL(), '/settings/applications');

        assert.dom(link).exists({ count: 1 });
        assert.dom(link).containsText(newName);
    });

    test('delete app', async assert => {
        server.create('user', 'loggedIn');

        const [app] = server.createList('developer-app', 2);

        await visit('/settings/applications');
        const card = `[data-test-developer-app-card='${app.id}']`;
        assert.dom('[data-test-developer-app-card]').exists({ count: 2 });
        assert.dom(card).exists({ count: 1 });

        await click(`${card} [data-test-delete-button]`);
        await percySnapshot(assert);
        await click('[data-test-confirm-delete]');

        assert.dom('[data-test-developer-app-card]').exists({ count: 1 });
        assert.dom(card).doesNotExist();
    });

    test('reset client secret', async assert => {
        server.create('user', 'loggedIn');

        const app = server.create('developer-app');
        const oldSecret = app.clientSecret;

        await visit(`/settings/applications/${app.id}`);

        assert.dom('[data-test-client-secret] button').isDisabled();
        assert.dom('[data-test-client-secret] input[type=text]').hasValue('*********************');

        await click('[data-test-toggle-client-secret]');

        assert.dom('[data-test-client-secret] button').isNotDisabled();
        assert.dom('[data-test-client-secret] input[type=text]').hasValue(oldSecret);

        await click('[data-analytics-scope="Reset client secret"] [data-test-delete-button]');
        await click('[data-test-confirm-delete]');
        await settled();

        app.reload();
        assert.notEqual(app.clientSecret, oldSecret, 'client secret updated');

        assert.dom('[data-test-client-secret] button').isDisabled();
        assert.dom('[data-test-client-secret] input[type=text]').hasValue('*********************');

        await click('[data-test-toggle-client-secret]');

        assert.dom('[data-test-client-secret] button').isNotDisabled();
        assert.dom('[data-test-client-secret] input[type=text]').hasValue(app.clientSecret);
    });
});
