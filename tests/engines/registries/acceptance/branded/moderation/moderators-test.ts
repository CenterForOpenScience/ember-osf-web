import { currentRouteName } from '@ember/test-helpers';
import { setupMirage } from 'ember-cli-mirage/test-support';
import { percySnapshot } from 'ember-percy';
import { module, test } from 'qunit';

import { visit } from 'ember-osf-web/tests/helpers';
import { setupEngineApplicationTest } from 'ember-osf-web/tests/helpers/engines';

module('Registries | Acceptance | branded.moderation | moderators', hooks => {
    setupEngineApplicationTest(hooks, 'registries');
    setupMirage(hooks);

    hooks.beforeEach(() => {
        const regProvider = server.create('registration-provider', { id: 'mdr8n' });
        server.createList('moderator', 3, { provider: regProvider });
    });

    test('logged out users are rerouted', async assert => {
        await visit('/registries/mdr8n/moderation/moderators');
        assert.equal(currentRouteName(), 'registries.page-not-found', 'Non-moderators are rerouted');
    });

    test('logged in, non-moderators are rerouted', async assert => {
        server.create('user', 'loggedIn');
        await visit('/registries/mdr8n/moderation/moderators');
        assert.equal(currentRouteName(), 'registries.page-not-found', 'Non-moderators are rerouted');
    });

    test('moderators list view for moderators', async assert => {
        const regProvider = server.schema.registrationProviders.find('mdr8n');
        const currentUser = server.create('user', 'loggedIn');
        server.create('moderator', { id: currentUser.id, user: currentUser, provider: regProvider }, 'asModerator');
        await visit('/registries/mdr8n/moderation/moderators');
        await percySnapshot('moderation moderators page');
        assert.equal(currentRouteName(), 'registries.branded.moderation.moderators',
            'On the moderators page of registries reviews');
        assert.dom('[data-test-moderator-row]').exists({ count: 4 }, 'There are 4 moderators shown');
        assert.dom('[data-test-delete-moderator-button]')
            .exists({ count: 1 }, 'Only one moderator is able to be removed');
        assert.dom('[data-test-moderator-permission-option]')
            .doesNotExist('Moderators are not able to edit permissions');
        assert.dom(`[data-test-delete-moderator-button=${currentUser.id}]`).exists('Only able to remove self');
    });

    test('admins list view for moderators', async assert => {
        const regProvider = server.schema.registrationProviders.find('mdr8n');
        const currentUser = server.create('user', 'loggedIn');
        server.create('moderator', { id: currentUser.id, user: currentUser, provider: regProvider }, 'asAdmin');
        await visit('/registries/mdr8n/moderation/moderators');
        await percySnapshot('moderation moderators page');
        assert.equal(currentRouteName(), 'registries.branded.moderation.moderators',
            'On the moderators page of registries reviews');

        assert.dom('[data-test-moderator-row]').exists({ count: 4 }, 'There are 4 moderators shown');
        assert.dom('[data-test-moderator-permission-option]')
            .exists({ count: 4 }, 'Admins are able to edit permissions for all users');
        assert.dom('[data-test-delete-moderator-button]')
            .exists({ count: 4 }, 'All moderators and admins are able to be removed');
    });
});
