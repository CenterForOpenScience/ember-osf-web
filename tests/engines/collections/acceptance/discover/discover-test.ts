import setupMirage from 'ember-cli-mirage/test-support/setup-mirage';
import { percySnapshot } from 'ember-percy';
import { module, test } from 'qunit';

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
        server.create('collected-metadatum', {
            creator: currentUser,
            guid: nodeAdded,
            id: nodeAdded.id,
            collection: primaryCollection,
        });
        const licensesAcceptable = server.schema.licenses.all().models;
        const provider = server.create('collection-provider', {
            id: 'studyswap',
            primaryCollection,
            licensesAcceptable,
        });
        await visit(`/collections/${provider.id}/discover`);
        assert.dom('.results-top').exists();
        assert.dom('.results-top').hasTextContaining(nodeAdded.title);
        assert.dom('.results-top').hasTextContaining(currentUser.familyName);
        await percySnapshot(assert);
    });
});
