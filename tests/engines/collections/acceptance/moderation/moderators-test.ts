import { setupMirage } from 'ember-cli-mirage/test-support';
import { percySnapshot } from 'ember-percy';
import { module, test } from 'qunit';

import { visit } from 'ember-osf-web/tests/helpers';
import { setupEngineApplicationTest } from 'ember-osf-web/tests/helpers/engines';

module('Collections | Acceptance | moderation | moderators', hooks => {
    setupEngineApplicationTest(hooks, 'collections');
    setupMirage(hooks);

    test('it renders for collection admins', async assert => {
        server.create('user', 'loggedIn');
        const primaryCollection = server.create('collection');
        const provider = server.create('collection-provider', {
            id: 'studyswap',
            primaryCollection,
        }, 'currentUserIsAdmin');
        server.createList('moderator', 10, { provider });
        await visit(`/collections/${provider.id}/moderation/moderators`);
        assert.dom('[data-test-collections-moderation-moderators-tab]').hasClass('active', 'moderators is active tab');

        assert.dom('[data-test-moderator-row]').exists({ count: 10 }, '10 moderators are listed at a time');
        assert.dom('[data-test-delete-button]').exists({ count: 10 }, 'Can delete all moderators, including self');
        assert.dom('[data-test-add-moderator-button]').exists('Can add a moderator');
        assert.dom('[data-test-next-page-button]').exists('Has next page of moderators');
        await percySnapshot(assert);
    });

    test('it renders for collection moderators', async assert => {
        server.create('user', 'loggedIn');
        const primaryCollection = server.create('collection');
        const provider = server.create('collection-provider', {
            id: 'studyswap',
            primaryCollection,
        }, 'currentUserIsModerator');
        server.createList('moderator', 5, { provider });
        await visit(`/collections/${provider.id}/moderation/moderators`);

        assert.dom('[data-test-moderator-row]').exists({ count: 6 }, '6 moderators are listed');
        assert.dom('[data-test-delete-button]').exists({ count: 1 }, 'Can only delete self');
        assert.dom('[data-test-add-moderator-button]').doesNotExist('Cannot add moderators');
        await percySnapshot(assert);
    });
});
