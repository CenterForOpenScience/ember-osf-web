import { click as untrackedClick } from '@ember/test-helpers';
import setupMirage from 'ember-cli-mirage/test-support/setup-mirage';
import { percySnapshot } from 'ember-percy';
import { module, test } from 'qunit';

import { Permission } from 'ember-osf-web/models/osf-model';
import { visit } from 'ember-osf-web/tests/helpers';
import { setupEngineApplicationTest } from 'ember-osf-web/tests/helpers/engines';

module('Collections | Acceptance | update', hooks => {
    setupEngineApplicationTest(hooks, 'collections');
    setupMirage(hooks);

    test('it renders', async () => {
        server.loadFixtures('licenses');
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
        });
        const provider = server.create('collection-provider', {
            id: 'studyswap',
            primaryCollection,
            licensesAcceptable,
        });
        await visit(`/collections/${provider.id}/${nodeAdded.id}/edit`);
        await percySnapshot('Collections | Acceptance | update | project metadata');
        await untrackedClick('[data-test-project-metadata-save-button]');
        await percySnapshot('Collections | Acceptance | update | project contributors');
        await untrackedClick('[data-test-collection-project-contributors] [data-test-submit-section-continue]');
        await percySnapshot('Collections | Acceptance | update | collection metadata');
        await untrackedClick('[data-test-collection-metadata] [data-test-submit-section-continue]');
        await percySnapshot('Collections | Acceptance | update | finished');
    });
});
