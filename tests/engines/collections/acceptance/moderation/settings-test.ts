import { setupMirage } from 'ember-cli-mirage/test-support';
import { percySnapshot } from 'ember-percy';
import { module, test } from 'qunit';

import { click, visit } from 'ember-osf-web/tests/helpers';
import { setupEngineApplicationTest } from 'ember-osf-web/tests/helpers/engines';
import { SubscriptionFrequency } from 'ember-osf-web/models/subscription';

module('Collections | Acceptance | moderation | settings', hooks => {
    setupEngineApplicationTest(hooks, 'collections');
    setupMirage(hooks);

    test('it renders settings for collection moderators', async function(assert) {
        // Given I create a collection, collection-provider and a second subscription
        server.create('user', 'loggedIn');
        const primaryCollection = server.create('collection');
        const provider = server.create('collection-provider', {
            id: 'studyswap',
            primaryCollection,
        }, 'currentUserIsAdmin');

        server.create('subscription', {
            id: `${provider.id}_other_submissions`,
            eventName: 'other_submissions',
            frequency: SubscriptionFrequency.Instant ,
        });

        // When I visit the discover page
        await visit(`/collections/${provider.id}/discover`);

        // And click on the moderation tab
        await click('[data-test-branded-navbar-moderation]');

        // And click on the settings tab
        await click('[data-test-collections-moderation-settings-tab]');

        // Then assert the heading text is correct
        assert.dom('[data-test-collections-moderation-settings-heading]').hasText(
            'Configure review state notification preferences',
            'The setting heading text is not correct',
        );

        // And the settings paragraph text is correct
        assert.dom('[data-test-collections-moderation-settings-paragraph]').hasText(
            'To configure other notification preferences visit your user settings.',
            'The other notification text is not correct',
        );

        // And the settings tab is active
        assert.dom('[data-test-collections-moderation-settings-tab]').hasClass('active', 'settings is active tab');

        // And only the new pending submissions option exists
        const eventNames = this.element.querySelectorAll('[data-test-subscription-event-name]');
        assert.equal(eventNames.length, 1, 'The expected event names do not exist.');
        assert.dom(eventNames[0]).hasText('New pending submissions',
            'The new pending submission notification is missing.');

        // And the power dropdown exists
        assert.dom('[data-test-subscription-option="instant"]').hasText('Instant');

        // And take a percy snapshot
        await percySnapshot(assert);
    });
});
