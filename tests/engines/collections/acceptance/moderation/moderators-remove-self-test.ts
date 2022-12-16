import { setupMirage } from 'ember-cli-mirage/test-support';
import { percySnapshot } from 'ember-percy';
import { module, test } from 'qunit';

import { click, visit } from 'ember-osf-web/tests/helpers';
import { setupEngineApplicationTest } from 'ember-osf-web/tests/helpers/engines';
import { currentRouteName } from '@ember/test-helpers/setup-application-context';

module('Collections | Acceptance | moderation | moderators | remove self', hooks => {
    setupEngineApplicationTest(hooks, 'collections');
    setupMirage(hooks);

    test('Can remove self as a collection moderator', async assert => {
        // Given I create a collection, collection-provider and a second moderator
        server.create('user', 'loggedIn');
        const primaryCollection = server.create('collection');
        const provider = server.create('collection-provider', {
            id: 'studyswap',
            primaryCollection,
        }, 'currentUserIsModerator');
        server.createList('moderator', 1, { provider });

        // When I visit the discover page
        await visit(`/collections/${provider.id}/discover`);

        // And I click on the moderation tab
        await click('[data-test-branded-navbar-moderation]');

        // And I click on the moderators tab
        await click('[data-test-collections-moderation-moderators-tab]');

        // Then I assert both moderators exist
        assert.dom('[data-test-moderator-row]').exists({ count: 2 }, '1 moderator is listed');
        // Then I assert that only I have a delete button as a moderator and not admin
        assert.dom('[data-test-delete-button]').exists({ count: 1 },
            'Can delete a single moderator, including self');

        // When I click on the delete button as myself
        await click('[data-test-delete-button]');

        // And I delete the permissions
        // I have to update the provider permissions manually to
        // simulate the server response
        provider.update({permissions: []});

        // When I click on the confirm remove moderator dialog
        await click('[data-test-confirm-delete]');

        // Then I verify the user is re-routed to the discover page
        assert.equal(currentRouteName(), 'collections.discover', 'Users are rerouted to discover page.');

        // Given the previous-moderator no longer has permission

        // Then I verify the moderation button is no longer visable
        assert.dom('[data-test-branded-navbar-moderation]').doesNotExist('The moderation button does not exist.');

        // When I attempt to go to the moderators page from the url
        await visit(`/collections/${provider.id}/moderation/moderators`);

        // Then I verify I am on the page not found since I do not have access
        assert.equal(currentRouteName(), 'collections.page-not-found', 'The route should be page-not-found.');

        await percySnapshot(assert);
    });
});
