import { click as untrackedClick } from '@ember/test-helpers';
import setupMirage from 'ember-cli-mirage/test-support/setup-mirage';
import { percySnapshot } from 'ember-percy';
import { module, test } from 'qunit';

import { Permission } from 'ember-osf-web/models/osf-model';
import { click, visit } from 'ember-osf-web/tests/helpers';
import { setupEngineApplicationTest } from 'ember-osf-web/tests/helpers/engines';

module('Collections | Acceptance | submit', hooks => {
    setupEngineApplicationTest(hooks, 'collections');
    setupMirage(hooks);

    test('it renders', async () => {
        server.loadFixtures('licenses');
        const currentUser = server.create('user', 'loggedIn');
        const primaryCollection = server.create('collection');
        const nodeToBeAdded = server.create('node', {
            title: 'Node to be added to collection',
            currentUserPermissions: Object.values(Permission),
        });
        server.create('contributor', {
            node: nodeToBeAdded,
            users: currentUser,
            index: 0,
        });
        const licensesAcceptable = server.schema.licenses.all().models;
        const provider = server.create('collection-provider', {
            id: 'studyswap',
            primaryCollection,
            licensesAcceptable,
        });
        await visit(`/collections/${provider.id}/submit`);
        await percySnapshot('Collections | Acceptance | submit | select project');
        await untrackedClick('[data-test-collections-item-picker] .ember-power-select-trigger');
        await untrackedClick(`[data-test-collections-node-title="${nodeToBeAdded.title}"]`);

        await percySnapshot('Collections | Acceptance | submit | project metadata');
        await untrackedClick('[data-test-collections-license-picker] .ember-power-select-trigger');
        await untrackedClick('.ember-power-select-option');
        await untrackedClick('[data-test-project-metadata-continue]');

        await percySnapshot('Collections | Acceptance | submit | project contributors');
        await untrackedClick('[data-test-collection-project-contributors] [data-test-submit-section-continue]');

        await percySnapshot('Collections | Acceptance | submit | collection metadata');
        await untrackedClick('[data-test-metadata-field="collected_type_label"] .ember-power-select-trigger');
        await untrackedClick('.ember-power-select-option');
        await untrackedClick('[data-test-metadata-field="issue_label"] .ember-power-select-trigger');
        await untrackedClick('.ember-power-select-option');
        await untrackedClick('[data-test-metadata-field="program_area_label"] .ember-power-select-trigger');
        await untrackedClick('.ember-power-select-option');
        await untrackedClick('[data-test-metadata-field="status_label"] .ember-power-select-trigger');
        await untrackedClick('.ember-power-select-option');
        await untrackedClick('[data-test-metadata-field="volume_label"] .ember-power-select-trigger');
        await untrackedClick('.ember-power-select-option');
        await untrackedClick('[data-test-collection-metadata] [data-test-submit-section-continue]');
        await click('[data-test-collection-submit]');

        await percySnapshot('Collections | Acceptance | submit | confirm public modal');
    });
});
