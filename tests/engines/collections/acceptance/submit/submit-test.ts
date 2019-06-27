import { click } from '@ember/test-helpers';
import setupMirage from 'ember-cli-mirage/test-support/setup-mirage';
import { percySnapshot } from 'ember-percy';
import { module, test } from 'qunit';

import { Permission } from 'ember-osf-web/models/osf-model';
import { visit } from 'ember-osf-web/tests/helpers';
import { setupEngineApplicationTest } from 'ember-osf-web/tests/helpers/engines';

module('Collections | Acceptance | submit', hooks => {
    setupEngineApplicationTest(hooks, 'collections');
    setupMirage(hooks);

    test('it renders', async assert => {
        server.loadFixtures('taxonomies');
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
        const taxonomies = server.schema.taxonomies.all().models;
        const licensesAcceptable = server.schema.licenses.all().models;
        const provider = server.create('collection-provider', {
            id: 'studyswap',
            primaryCollection,
            taxonomies,
            licensesAcceptable,
        });
        await visit(`/collections/${provider.id}/submit`);
        await percySnapshot(assert);
        await click('.ember-power-select-placeholder');
        await click('.ember-power-select-option');
        await percySnapshot(assert);
        await click('.ember-power-select-placeholder');
        await click('.ember-power-select-option');
        await click('.btn-primary');
        await percySnapshot(assert);
        await click('.btn-primary');
        await percySnapshot(assert);
        await click('ol > li');
        await click('.btn-primary');
        await percySnapshot(assert);
        await click('[data-test-metadata-field="collected_type_label"] > div > div > .ember-power-select-trigger');
        await click('.ember-power-select-option');
        await click('[data-test-metadata-field="issue_label"] > div > div > .ember-power-select-trigger');
        await click('.ember-power-select-option');
        await click('[data-test-metadata-field="program_area_label"] > div > div > .ember-power-select-trigger');
        await click('.ember-power-select-option');
        await click('[data-test-metadata-field="status_label"] > div > div > .ember-power-select-trigger');
        await click('.ember-power-select-option');
        await click('[data-test-metadata-field="volume_label"] > div > div > .ember-power-select-trigger');
        await click('.ember-power-select-option');
        await click('.btn-primary');
        await click('.btn-success');
        await percySnapshot(assert);
    });
});
