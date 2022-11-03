import { click, currentRouteName, fillIn } from '@ember/test-helpers';
import { setupMirage } from 'ember-cli-mirage/test-support';
import { percySnapshot } from 'ember-percy';
import { module, test, skip } from 'qunit';

import { timeout } from 'ember-concurrency';
import { t } from 'ember-intl/test-support';
import { visit } from 'ember-osf-web/tests/helpers';
import { setupEngineApplicationTest } from 'ember-osf-web/tests/helpers/engines';
import { selectChoose, selectSearch } from 'ember-power-select/test-support';
import { clickTrigger } from 'ember-power-select/test-support/helpers';

module('Registries | Acceptance | branded.moderation | moderators', hooks => {
    setupEngineApplicationTest(hooks, 'registries');
    setupMirage(hooks);

    hooks.beforeEach(() => {
        const regProvider = server.create('registration-provider', { id: 'mdr8n' });
        server.createList('moderator', 3, { provider: regProvider });
        server.create('registration-provider', { id: 'empty' });
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
        server.create('moderator', { id: currentUser.id, user: currentUser, provider: regProvider });
        regProvider.update({ permissions: ['view_submissions'] });
        await visit('/registries/mdr8n/moderation/moderators');
        await percySnapshot('moderation moderators page: moderator view');
        assert.equal(currentRouteName(), 'registries.branded.moderation.moderators',
            'On the moderators page of registries reviews');
        assert.dom('[data-test-moderator-row]').exists({ count: 4 }, 'There are 4 moderators shown');
        assert.dom('[data-test-delete-moderator-button]')
            .exists({ count: 1 }, 'Only one moderator is able to be removed');
        assert.dom('[data-test-moderator-permission-option]')
            .doesNotExist('Moderators are not able to edit permissions');
        assert.dom(`[data-test-delete-moderator-button=${currentUser.id}]`).exists('Only able to remove self');
        assert.dom('[data-test-add-moderator-button]')
            .doesNotExist('Button to add moderator is not visible for moderators');
    });

    test('admins list view for moderators', async assert => {
        const regProvider = server.schema.registrationProviders.find('mdr8n');
        const currentUser = server.create('user', 'loggedIn');
        server.create('moderator', { id: currentUser.id, user: currentUser, provider: regProvider }, 'asAdmin');
        regProvider.update({ permissions: ['view_submissions'] });
        await visit('/registries/mdr8n/moderation/moderators');
        await percySnapshot('moderation moderators page: admin view');
        assert.equal(currentRouteName(), 'registries.branded.moderation.moderators',
            'On the moderators page of registries reviews');

        assert.dom('[data-test-moderator-row]').exists({ count: 4 }, 'There are 4 moderators shown');
        assert.dom('[data-test-moderator-permission-option]')
            .exists({ count: 4 }, 'Admins are able to edit permissions for all users');
        assert.dom('[data-test-delete-moderator-button]')
            .exists({ count: 4 }, 'All moderators and admins are able to be removed');
        assert.dom('[data-test-add-moderator-button]')
            .exists('Button to add moderator is visible for admins');
    });

    test('moderator CRUD operations', async assert => {
        const regProvider = server.schema.registrationProviders.find('empty');
        const currentUser = server.create('user', { fullName: 'J' }, 'loggedIn');
        const suzy = server.create('user', { fullName: 'Bae Suzy' });
        server.create('moderator', { id: currentUser.id, user: currentUser, provider: regProvider }, 'asAdmin');
        regProvider.update({ permissions: ['view_submissions'] });
        await visit('/registries/empty/moderation/moderators');
        assert.dom('[data-test-moderator-row]').exists({ count: 1 }, 'There is one moderator');
        assert.dom(`[data-test-moderator-row="${currentUser.id}"]`).exists('And that moderator is the current user');
        // Adding user as a moderator
        await click('[data-test-add-moderator-button]');
        await selectSearch('[data-test-select-user]', 'Suzy');
        await selectChoose('[data-test-select-user]', 'Bae Suzy');
        await selectChoose('[data-test-select-permission]', 'Moderator');
        await click('[data-test-confirm-add-moderator-button]');
        assert.dom('#toast-container', document as any).hasTextContaining(
            t(
                'osf-components.moderators.addedNewModeratorSuccess',
                { userName: suzy.fullName, permission: 'moderator' },
            ),
            'Toast successful message for adding user as moderator',
        );
        assert.dom('[data-test-moderator-row]').exists({ count: 2 }, 'There are two moderators');
        assert.dom(`[data-test-moderator-row="${suzy.id}"]`).exists('Suzy is now a moderator');
        // Inviting a user as a moderator
        await click('[data-test-add-moderator-button]');
        await click('[data-test-toggle-invite-form]');
        await click('[data-test-confirm-add-moderator-button]');
        await fillIn('[data-test-email-input]>div>input', 'testing@cos.io');
        await fillIn('[data-test-full-name-input]>div>input', 'Baek Yerin');
        await selectChoose('[data-test-select-permission]', 'Moderator');
        await click('[data-test-confirm-add-moderator-button]');
        assert.dom('#toast-container', document as any).hasTextContaining(
            t(
                'osf-components.moderators.addedNewModeratorSuccess',
                { userName: 'Baek Yerin', permission: 'moderator' },
            ),
            'Toast successful message for inviting moderator by email',
        );
        assert.dom('[data-test-moderator-row]').exists({ count: 3 }, 'There are three moderators');
        // Updating Suzy's permission
        await clickTrigger(`[data-test-moderator-row="${suzy.id}"]`);
        await selectChoose(`[data-test-moderator-row="${suzy.id}"]`, 'Admin');
        assert.dom('#toast-container', document as any).hasTextContaining(
            t(
                'osf-components.moderators.updatedModeratorPermissionSuccess',
                { userName: suzy.fullName, permission: 'admin' },
            ),
            'Toast successful message for updating permission',
        );
        assert.dom(`[data-test-moderator-row="${suzy.id}"]>div>[data-test-permission-group]`).hasText(
            'Admin',
            'Suzy is now an admin',
        );
        // Removing Suzy as a moderator
        await click(`[data-test-delete-moderator-button="${suzy.id}"]>[data-test-delete-button]`);
        await click('[data-test-confirm-delete]');
        assert.dom('#toast-container', document as any).hasTextContaining(
            t(
                'osf-components.moderators.removedModeratorSuccess',
                { userName: suzy.fullName },
            ),
            'Toast successful message for removing moderator',
        );
        assert.dom('[data-test-moderator-row]').exists({ count: 2 }, 'There are two moderators');
        assert.dom(`[data-test-moderator-row="${suzy.id}"]`).doesNotExist('Suzy is no longer a moderator');
    });

    // skip: probabilistic failures because of multiple toast messages
    // TODO: separate the tests
    skip('moderator CRUD operations failure should toast', async assert => {
        server.namespace = '/v2';
        server.post('/providers/registrations/:parentID/moderators', () => ({
            errors: [{ detail: '' }],
        }), 400);
        server.put('/providers/registrations/:parentID/moderators/:id/', () => ({
            errors: [{ detail: '' }],
        }), 400);
        server.patch('/providers/registrations/:parentID/moderators/:id/', () => ({
            errors: [{ detail: '' }],
        }), 400);
        server.del('/providers/registrations/:parentID/moderators/:id/', () => ({
            errors: [{ detail: '' }],
        }), 400);
        const regProvider = server.schema.registrationProviders.find('empty');
        const currentUser = server.create('user', { fullName: 'J' }, 'loggedIn');
        server.create('user', { fullName: 'Bae Suzy' });
        server.create('moderator', { id: currentUser.id, user: currentUser, provider: regProvider }, 'asAdmin');
        regProvider.update({ permissions: ['view_submissions'] });
        await visit('/registries/empty/moderation/moderators');
        // add failure should toast
        await click('[data-test-add-moderator-button]');
        await selectSearch('[data-test-select-user]', 'Suzy');
        await selectChoose('[data-test-select-user]', 'Bae Suzy');
        await selectChoose('[data-test-select-permission]', 'Moderator');
        await click('[data-test-confirm-add-moderator-button]');
        assert.dom('#toast-container', document as any).hasTextContaining(
            t(
                'osf-components.moderators.addedNewModeratorError',
                { permission: 'moderator' },
            ),
            'Toast error message for adding user as moderator failure',
        );
        await timeout(5000);
        // update permission failure should toast
        await clickTrigger(`[data-test-moderator-row="${currentUser.id}"]`);
        await selectChoose(`[data-test-moderator-row="${currentUser.id}"]`, 'Moderator');
        assert.dom('#toast-container', document as any).hasTextContaining(
            t(
                'osf-components.moderators.updatedModeratorPermissionError',
                { permission: 'moderator' },
            ),
            'Toast error message for updating permission failure',
        );
        await timeout(5000);
        // delete failure should toast
        await click(`[data-test-delete-moderator-button="${currentUser.id}"]>[data-test-delete-button]`);
        await click('[data-test-confirm-delete]');
        assert.dom('#toast-container', document as any).hasTextContaining(
            t(
                'osf-components.moderators.removedModeratorError',
                { permission: 'admin' },
            ),
            'Toast error message for removing moderator failure',
        );
    });
});
