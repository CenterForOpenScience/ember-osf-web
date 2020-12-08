import { currentRouteName } from '@ember/test-helpers';
import { setupMirage } from 'ember-cli-mirage/test-support';
import { percySnapshot } from 'ember-percy';
import { module, test } from 'qunit';

import { SubscriptionFrequency } from 'ember-osf-web/models/subscription';
import { visit } from 'ember-osf-web/tests/helpers';
import { setupEngineApplicationTest } from 'ember-osf-web/tests/helpers/engines';

module('Registries | Acceptance | branded.moderation | notifications', hooks => {
    setupEngineApplicationTest(hooks, 'registries');
    setupMirage(hooks);

    hooks.beforeEach(() => {
        server.create('registration-provider', { id: 'mdr8n' });
        server.create('subscription', {
            id: 'mdr8n_new_pending_submissions',
            eventName: 'new_pending_submissions',
            frequency: SubscriptionFrequency.Instant,
        });
        server.create('subscription', {
            id: 'mdr8n_new_pending_withdraw_requests',
            eventName: 'new_pending_withdraw_requests',
            frequency: SubscriptionFrequency.Instant,
        });
        server.create('subscription', {
            id: 'cat_photo_repository_subscription',
            eventName: 'cat_photo_repository_subscription',
            frequency: SubscriptionFrequency.Daily,
        });
    });

    test('logged out users are rerouted', async assert => {
        await visit('/registries/mdr8n/moderation/notifications');
        assert.equal(currentRouteName(), 'registries.page-not-found', 'Non-moderators are rerouted');
    });

    test('logged in, non-moderators are rerouted', async assert => {
        server.create('user', 'loggedIn');
        await visit('/registries/mdr8n/moderation/notifications');
        assert.equal(currentRouteName(), 'registries.page-not-found', 'Non-moderators are rerouted');
    });

    test('notifications list for moderators', async assert => {
        const regProvider = server.schema.registrationProviders.find('mdr8n');
        const currentUser = server.create('user', 'loggedIn');
        server.create('moderator', { id: currentUser.id, user: currentUser, provider: regProvider }, 'asModerator');
        regProvider.update({ permissions: ['view_submissions'] });
        await visit('/registries/mdr8n/moderation/notifications');
        await percySnapshot('moderation notifications page');
        assert.equal(currentRouteName(), 'registries.branded.moderation.notifications',
            'On the notifications page of registries reviews');
        assert.dom('[data-test-subscription-list]').exists('Subscription list shown');
        assert.dom('[data-test-subscription-list-row="mdr8n_new_pending_submissions"]')
            .exists('Pending submissions notification shown');
        assert.dom('[data-test-subscription-list-row="mdr8n_new_pending_withdraw_requests"]')
            .exists('Pending withdraw requests notification shown');
        assert.dom('[data-test-subscription-list-row="cat_photo_repository_subscription"]')
            .doesNotExist('Other subscriptions are not shown');
        assert.dom('[data-test-subscription-list-row="mdr8n_new_pending_withdraw_requests"] [data-test-power-select]')
            .hasText('Instant', 'Subscription frequency is shown correctly');
    });
});
