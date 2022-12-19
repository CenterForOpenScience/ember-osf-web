import { setupMirage } from 'ember-cli-mirage/test-support';
import { percySnapshot } from 'ember-percy';
import { module, test } from 'qunit';

import { visit } from 'ember-osf-web/tests/helpers';
import { setupEngineApplicationTest } from 'ember-osf-web/tests/helpers/engines';

module('Collections | Acceptance | moderation | settings', hooks => {
    setupEngineApplicationTest(hooks, 'collections');
    setupMirage(hooks);

    test('it renders settings for collection moderators', async function(assert) {
        server.create('user', 'loggedIn');
        const primaryCollection = server.create('collection');
        const provider = server.create('collection-provider', {
            id: 'studyswap',
            primaryCollection,
        }, 'currentUserIsAdmin');

        await visit(`/collections/${provider.id}/moderation/settings`);
        assert.dom('[data-test-collections-moderation-settings-heading]').hasText(
            'Configure review state notification preferences',
            'The setting heading text is not correct',
        );

        assert.dom('[data-test-collections-moderation-settings-paragraph]').hasText(
            'To configure other notification preferences visit your user settings.',
            'The other notification text is not correct',
        );

        assert.dom('[data-test-collections-moderation-settings-tab]').hasClass('active', 'settings is active tab');

        const eventNames = this.element.querySelectorAll('[data-test-subscription-event-name]');
        assert.equal(eventNames.length, 1, 'The expected event names do not exist.');
        assert.dom(eventNames[0]).hasText('New pending submissions',
            'The new pending submission notification is missing.');

        await percySnapshot(assert);
    });
});
