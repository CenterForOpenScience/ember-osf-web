import { click } from '@ember/test-helpers';
import setupMirage from 'ember-cli-mirage/test-support/setup-mirage';
import { percySnapshot } from 'ember-percy';
import { module, test } from 'qunit';

import { Permission } from 'ember-osf-web/models/osf-model';
import { visit } from 'ember-osf-web/tests/helpers';
import { setupEngineApplicationTest } from 'ember-osf-web/tests/helpers/engines';

module('Collections | Acceptance | update', hooks => {
    setupEngineApplicationTest(hooks, 'collections');
    setupMirage(hooks);

    test('it renders', async assert => {
        server.loadFixtures('taxonomies');
        server.loadFixtures('licenses');
        const taxonomies = server.schema.taxonomies.all().models;
        const licensesAcceptable = server.schema.licenses.all().models;
        const currentUser = server.create('user', 'loggedIn');
        const primaryCollection = server.create('collection');
        const nodeAdded = server.create('node', {
            title: 'Added to collection',
            license: licensesAcceptable[0],
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
            subjects: [[{ text: 'Arts and Humanities', id: '123' }]],
        });
        const provider = server.create('collection-provider', {
            id: 'studyswap',
            primaryCollection,
            taxonomies,
            licensesAcceptable,
        });
        await visit(`/collections/${provider.id}/${nodeAdded.id}/edit`);
        await percySnapshot(assert);
        await click('.btn-primary');
        await percySnapshot(assert);
        await click('.btn-primary');
        await percySnapshot(assert);
        await click('.btn-primary');
        await percySnapshot(assert);
        await click('.btn-primary');
        await percySnapshot(assert);
    });
});
