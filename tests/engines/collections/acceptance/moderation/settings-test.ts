import { setupMirage } from 'ember-cli-mirage/test-support';
import { percySnapshot } from 'ember-percy';
import { module, test } from 'qunit';

import { visit } from 'ember-osf-web/tests/helpers';
import { setupEngineApplicationTest } from 'ember-osf-web/tests/helpers/engines';

module('Collections | Acceptance | moderation | settings', hooks => {
    setupEngineApplicationTest(hooks, 'collections');
    setupMirage(hooks);

    test('it renders settings for collection moderators', async assert => {
        server.create('user', 'loggedIn');
        const primaryCollection = server.create('collection');
        const provider = server.create('collection-provider', {
            id: 'studyswap',
            primaryCollection,
        }, 'currentUserIsAdmin');

        await visit(`/collections/${provider.id}/moderation/settings`);
        // await pauseTest();
        assert.dom('[data-test-collections-moderation-settings-tab]').hasClass('active', 'settings is active tab');

        await percySnapshot(assert);
    });
});
