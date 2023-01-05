import { click as untrackedClick, fillIn } from '@ember/test-helpers';
import { setupMirage } from 'ember-cli-mirage/test-support';
import { percySnapshot } from 'ember-percy';
import { module, test } from 'qunit';

import Collection from 'ember-osf-web/models/collection';
import { Permission } from 'ember-osf-web/models/osf-model';
import { visit } from 'ember-osf-web/tests/helpers';
import { setupEngineApplicationTest } from 'ember-osf-web/tests/helpers/engines';

module('Collections | Acceptance | discover', hooks => {
    setupEngineApplicationTest(hooks, 'collections');
    setupMirage(hooks);

    test('it renders', async assert => {
        const currentUser = server.create('user', 'loggedIn');
        const primaryCollection = server.create('collection');
        const nodeAdded = server.create('node', {
            title: 'Added to collection',
            currentUserPermissions: Object.values(Permission),
        });
        server.create('contributor', {
            node: nodeAdded,
            users: currentUser,
            index: 0,
        });
        server.create('collection-submission', {
            creator: currentUser,
            guid: nodeAdded,
            id: nodeAdded.id,
            collection: primaryCollection,
        });
        const provider = server.create('collection-provider', {
            id: 'studyswap',
            primaryCollection,
        });
        await visit(`/collections/${provider.id}/discover`);
        assert.dom(`[data-test-collection-search-result-node=${nodeAdded.id}]`)
            .exists({ count: 1 }, 'node added exists in search results');
        assert.dom(`[data-test-collection-search-result-node=${nodeAdded.id}]
                    [data-test-collection-search-result-node-title]`)
            .hasText(nodeAdded.title, 'title displayed in search result for node added');
        assert.dom(`[data-test-collection-search-result-node=${nodeAdded.id}]
                    [data-test-contributor-name=${currentUser.id}]`)
            .hasText(currentUser.familyName, 'contributor listed in search result for node added');
        assert.dom('[data-test-provider-description]').containsText('Find out more', 'Provider description exists');
        assert.dom('[data-test-provider-description] a').exists('There is a link in the provider description');
        await percySnapshot(assert);
    });

    test('sorting', async assert => {
        const currentUser = server.create('user', 'loggedIn');
        const primaryCollection = server.create('collection');
        const node1 = server.create('node', {
            title: 'This is node1',
            currentUserPermissions: Object.values(Permission),
            dateModified: new Date('2018-01-01'),
        });
        server.create('collection-submission', {
            creator: currentUser,
            guid: node1,
            id: node1.id,
            collection: primaryCollection,
        });
        const node2 = server.create('node', {
            title: 'This is node2',
            currentUserPermissions: Object.values(Permission),
            dateModified: new Date('2017-01-01'),
        });
        server.create('collection-submission', {
            creator: currentUser,
            guid: node2,
            id: node2.id,
            collection: primaryCollection,
        });
        const node3 = server.create('node', {
            title: 'This is node3',
            currentUserPermissions: Object.values(Permission),
            dateModified: new Date('2019-01-01'),
        });
        server.create('collection-submission', {
            creator: currentUser,
            guid: node3,
            id: node3.id,
            collection: primaryCollection,
        });
        const provider = server.create('collection-provider', {
            id: 'studyswap',
            primaryCollection,
        });
        await visit(`/collections/${provider.id}/discover`);
        assert.dom(`:first-child > [data-test-collection-search-result-node="${node1.id}"]`)
            .exists({ count: 1 }, 'unsorted: node1 is first in list');
        assert.dom(`:last-child > [data-test-collection-search-result-node="${node3.id}"]`)
            .exists({ count: 1 }, 'unsorted: node3 is last in list');
        await untrackedClick('[data-test-sort-by-button]');
        await untrackedClick('[data-test-sort-by-item="modified"]');
        assert.dom(`:first-child > [data-test-collection-search-result-node="${node2.id}"]`)
            .exists({ count: 1 }, 'sort by modified: node2 is first in list');
        assert.dom(`:last-child > [data-test-collection-search-result-node="${node3.id}"]`)
            .exists({ count: 1 }, 'sort by modified: node3 is last in list');
        await untrackedClick('[data-test-sort-by-button]');
        await untrackedClick('[data-test-sort-by-item="-modified"]');
        assert.dom(`:first-child > [data-test-collection-search-result-node="${node3.id}"]`)
            .exists({ count: 1 }, 'sort by -modified: node3 is first in list');
        assert.dom(`:last-child > [data-test-collection-search-result-node="${node2.id}"]`)
            .exists({ count: 1 }, 'sort by -modified: node2 is last in list');
    });

    test('keyword search', async assert => {
        const currentUser = server.create('user', 'loggedIn');
        const primaryCollection = server.create('collection');
        const node1 = server.create('node', {
            title: 'This is node1',
            currentUserPermissions: Object.values(Permission),
        });
        server.create('collection-submission', {
            creator: currentUser,
            guid: node1,
            id: node1.id,
            collection: primaryCollection,
        });
        const node2 = server.create('node', {
            title: 'This is node2',
            currentUserPermissions: Object.values(Permission),
        });
        server.create('collection-submission', {
            creator: currentUser,
            guid: node2,
            id: node2.id,
            collection: primaryCollection,
        });
        const provider = server.create('collection-provider', {
            id: 'studyswap',
            primaryCollection,
        });
        await visit(`/collections/${provider.id}/discover`);
        assert.dom(`[data-test-collection-search-result-node="${node1.id}"]`)
            .exists({ count: 1 }, 'node1 exists in search results');
        assert.dom(`[data-test-collection-search-result-node="${node2.id}"]`)
            .exists({ count: 1 }, 'node2 exists in search results');
        await fillIn('[data-test-search-input] input', 'node1');
        await untrackedClick('[data-test-search-button]');
        assert.dom(`[data-test-collection-search-result-node="${node1.id}"]`)
            .exists({ count: 1 }, 'node1 exists in search results');
        assert.dom(`[data-test-collection-search-result-node="${node2.id}"]`)
            .doesNotExist('node2 does not exist in search results');
    });

    test('metadata filters', async function(assert) {
        const currentUser = server.create('user', 'loggedIn');
        const primaryCollection = server.create('collection');
        const node1 = server.create('node', {
            title: 'This is node1',
            currentUserPermissions: Object.values(Permission),
        });
        const store = this.owner.lookup('service:store');
        const collection: Collection = await store.findRecord('collection', primaryCollection.id);
        collection.collectedTypeChoices.sort();
        collection.issueChoices.sort();
        collection.programAreaChoices.sort();
        collection.statusChoices.sort();
        collection.volumeChoices.sort();
        server.create('collection-submission', {
            creator: currentUser,
            guid: node1,
            id: node1.id,
            collection: primaryCollection,
            collectedType: collection.collectedTypeChoices[0],
            issue: collection.issueChoices[0],
            programArea: collection.programAreaChoices[0],
            status: collection.statusChoices[0],
            volume: collection.volumeChoices[0],
        });
        const node2 = server.create('node', {
            title: 'This is node2',
            currentUserPermissions: Object.values(Permission),
        });
        server.create('collection-submission', {
            creator: currentUser,
            guid: node2,
            id: node2.id,
            collection: primaryCollection,
            collectedType: collection.collectedTypeChoices[1],
            issue: collection.issueChoices[1],
            programArea: collection.programAreaChoices[1],
            status: collection.statusChoices[1],
            volume: collection.volumeChoices[1],
        });
        const provider = server.create('collection-provider', {
            id: 'studyswap',
            primaryCollection,
        });

        await visit(`/collections/${provider.id}/discover`);

        /* Type */
        assert.dom(`[data-test-collection-search-result-node="${node1.id}"]`)
            .exists({ count: 1 }, 'Type: node1 exists in search results');
        assert.dom(`[data-test-collection-search-result-node="${node2.id}"]`)
            .exists({ count: 1 }, 'Type: node2 exists in search results');
        await untrackedClick(`[data-test-checklist-facet-item="${collection.collectedTypeChoices[0]}"] input`);
        assert.dom(`[data-test-collection-search-result-node="${node1.id}"]`)
            .exists({ count: 1 }, 'Type: node1 exists in search results');
        assert.dom(`[data-test-collection-search-result-node="${node2.id}"]`)
            .doesNotExist('Type: node2 does not exist in search results');
        await untrackedClick(`[data-test-checklist-facet-item="${collection.collectedTypeChoices[1]}"] input`);
        assert.dom(`[data-test-collection-search-result-node="${node1.id}"]`)
            .exists({ count: 1 }, 'Type: node1 exists in search results');
        assert.dom(`[data-test-collection-search-result-node="${node2.id}"]`)
            .exists({ count: 1 }, 'Type: node2 exists in search results');
        await untrackedClick(`[data-test-checklist-facet-item="${collection.collectedTypeChoices[0]}"] input`);
        assert.dom(`[data-test-collection-search-result-node="${node1.id}"]`)
            .doesNotExist('Type: node1 does not exist in search results');
        assert.dom(`[data-test-collection-search-result-node="${node2.id}"]`)
            .exists({ count: 1 }, 'Type: node2 exists in search results');
        await untrackedClick(`[data-test-checklist-facet-item="${collection.collectedTypeChoices[1]}"] input`);
        assert.dom(`[data-test-collection-search-result-node="${node1.id}"]`)
            .exists({ count: 1 }, 'Type: node1 exists in search results');
        assert.dom(`[data-test-collection-search-result-node="${node2.id}"]`)
            .exists({ count: 1 }, 'Type: node2 exists in search results');

        /* Issue */
        assert.dom(`[data-test-collection-search-result-node="${node1.id}"]`)
            .exists({ count: 1 }, 'Issue: node1 exists in search results');
        assert.dom(`[data-test-collection-search-result-node="${node2.id}"]`)
            .exists({ count: 1 }, 'Issue: node2 exists in search results');
        await untrackedClick(`[data-test-checklist-facet-item="${collection.issueChoices[0]}"] input`);
        assert.dom(`[data-test-collection-search-result-node="${node1.id}"]`)
            .exists({ count: 1 }, 'Issue: node1 exists in search results');
        assert.dom(`[data-test-collection-search-result-node="${node2.id}"]`)
            .doesNotExist('Issue: node2 does not exist in search results');
        await untrackedClick(`[data-test-checklist-facet-item="${collection.issueChoices[1]}"] input`);
        assert.dom(`[data-test-collection-search-result-node="${node1.id}"]`)
            .exists({ count: 1 }, 'Issue: node1 exists in search results');
        assert.dom(`[data-test-collection-search-result-node="${node2.id}"]`)
            .exists({ count: 1 }, 'Issue: node2 exists in search results');
        await untrackedClick(`[data-test-checklist-facet-item="${collection.issueChoices[0]}"] input`);
        assert.dom(`[data-test-collection-search-result-node="${node1.id}"]`)
            .doesNotExist('Issue: node1 does not exist in search results');
        assert.dom(`[data-test-collection-search-result-node="${node2.id}"]`)
            .exists({ count: 1 }, 'Issue: node2 exists in search results');
        await untrackedClick(`[data-test-checklist-facet-item="${collection.issueChoices[1]}"] input`);
        assert.dom(`[data-test-collection-search-result-node="${node1.id}"]`)
            .exists({ count: 1 }, 'Issue: node1 exists in search results');
        assert.dom(`[data-test-collection-search-result-node="${node2.id}"]`)
            .exists({ count: 1 }, 'Issue: node2 exists in search results');

        /* Program Area */
        assert.dom(`[data-test-collection-search-result-node="${node1.id}"]`)
            .exists({ count: 1 }, 'Program Area: node1 exists in search results');
        assert.dom(`[data-test-collection-search-result-node="${node2.id}"]`)
            .exists({ count: 1 }, 'Program Area: node2 exists in search results');
        await untrackedClick(`[data-test-checklist-facet-item="${collection.programAreaChoices[0]}"] input`);
        assert.dom(`[data-test-collection-search-result-node="${node1.id}"]`)
            .exists({ count: 1 }, 'Program Area: node1 exists in search results');
        assert.dom(`[data-test-collection-search-result-node="${node2.id}"]`)
            .doesNotExist('Program Area: node2 does not exist in search results');
        await untrackedClick(`[data-test-checklist-facet-item="${collection.programAreaChoices[1]}"] input`);
        assert.dom(`[data-test-collection-search-result-node="${node1.id}"]`)
            .exists({ count: 1 }, 'Program Area: node1 exists in search results');
        assert.dom(`[data-test-collection-search-result-node="${node2.id}"]`)
            .exists({ count: 1 }, 'Program Area: node2 exists in search results');
        await untrackedClick(`[data-test-checklist-facet-item="${collection.programAreaChoices[0]}"] input`);
        assert.dom(`[data-test-collection-search-result-node="${node1.id}"]`)
            .doesNotExist('Program Area: node1 does not exist in search results');
        assert.dom(`[data-test-collection-search-result-node="${node2.id}"]`)
            .exists({ count: 1 }, 'Program Area: node2 exists in search results');
        await untrackedClick(`[data-test-checklist-facet-item="${collection.programAreaChoices[1]}"] input`);
        assert.dom(`[data-test-collection-search-result-node="${node1.id}"]`)
            .exists({ count: 1 }, 'Program Area: node1 exists in search results');
        assert.dom(`[data-test-collection-search-result-node="${node2.id}"]`)
            .exists({ count: 1 }, 'Program Area: node2 exists in search results');

        /* Status */
        assert.dom(`[data-test-collection-search-result-node="${node1.id}"]`)
            .exists({ count: 1 }, 'Status: node1 exists in search results');
        assert.dom(`[data-test-collection-search-result-node="${node2.id}"]`)
            .exists({ count: 1 }, 'Status: node2 exists in search results');
        await untrackedClick(`[data-test-checklist-facet-item="${collection.statusChoices[0]}"] input`);
        assert.dom(`[data-test-collection-search-result-node="${node1.id}"]`)
            .exists({ count: 1 }, 'Status: node1 exists in search results');
        assert.dom(`[data-test-collection-search-result-node="${node2.id}"]`)
            .doesNotExist('Status: node2 does not exist in search results');
        await untrackedClick(`[data-test-checklist-facet-item="${collection.statusChoices[1]}"] input`);
        assert.dom(`[data-test-collection-search-result-node="${node1.id}"]`)
            .exists({ count: 1 }, 'Status: node1 exists in search results');
        assert.dom(`[data-test-collection-search-result-node="${node2.id}"]`)
            .exists({ count: 1 }, 'Status: node2 exists in search results');
        await untrackedClick(`[data-test-checklist-facet-item="${collection.statusChoices[0]}"] input`);
        assert.dom(`[data-test-collection-search-result-node="${node1.id}"]`)
            .doesNotExist('Status: node1 does not exist in search results');
        assert.dom(`[data-test-collection-search-result-node="${node2.id}"]`)
            .exists({ count: 1 }, 'Status: node2 exists in search results');
        await untrackedClick(`[data-test-checklist-facet-item="${collection.statusChoices[1]}"] input`);
        assert.dom(`[data-test-collection-search-result-node="${node1.id}"]`)
            .exists({ count: 1 }, 'Status: node1 exists in search results');
        assert.dom(`[data-test-collection-search-result-node="${node2.id}"]`)
            .exists({ count: 1 }, 'Status: node2 exists in search results');

        /* Volume */
        assert.dom(`[data-test-collection-search-result-node="${node1.id}"]`)
            .exists({ count: 1 }, 'Volume: node1 exists in search results');
        assert.dom(`[data-test-collection-search-result-node="${node2.id}"]`)
            .exists({ count: 1 }, 'Volume: node2 exists in search results');
        await untrackedClick(`[data-test-checklist-facet-item="${collection.volumeChoices[0]}"] input`);
        assert.dom(`[data-test-collection-search-result-node="${node1.id}"]`)
            .exists({ count: 1 }, 'Volume: node1 exists in search results');
        assert.dom(`[data-test-collection-search-result-node="${node2.id}"]`)
            .doesNotExist('Volume: node2 does not exist in search results');
        await untrackedClick(`[data-test-checklist-facet-item="${collection.volumeChoices[1]}"] input`);
        assert.dom(`[data-test-collection-search-result-node="${node1.id}"]`)
            .exists({ count: 1 }, 'Volume: node1 exists in search results');
        assert.dom(`[data-test-collection-search-result-node="${node2.id}"]`)
            .exists({ count: 1 }, 'Volume: node2 exists in search results');
        await untrackedClick(`[data-test-checklist-facet-item="${collection.volumeChoices[0]}"] input`);
        assert.dom(`[data-test-collection-search-result-node="${node1.id}"]`)
            .doesNotExist('Volume: node1 does not exist in search results');
        assert.dom(`[data-test-collection-search-result-node="${node2.id}"]`)
            .exists({ count: 1 }, 'Volume: node2 exists in search results');
        await untrackedClick(`[data-test-checklist-facet-item="${collection.volumeChoices[1]}"] input`);
        assert.dom(`[data-test-collection-search-result-node="${node1.id}"]`)
            .exists({ count: 1 }, 'Volume: node1 exists in search results');
        assert.dom(`[data-test-collection-search-result-node="${node2.id}"]`)
            .exists({ count: 1 }, 'Volume: node2 exists in search results');
    });
});
