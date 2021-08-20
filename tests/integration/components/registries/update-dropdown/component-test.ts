import { visit } from '@ember/test-helpers';

import { ModelInstance } from 'ember-cli-mirage';
import { setupMirage } from 'ember-cli-mirage/test-support';
import { percySnapshot } from 'ember-percy';
import { module, test } from 'qunit';

import Registration from 'ember-osf-web/models/registration';
import RegistrationModel from 'ember-osf-web/models/registration';
import { click, setupOSFApplicationTest } from 'ember-osf-web/tests/helpers';
import RevisionModel from 'ember-osf-web/models/revision';
import { assert } from '@ember/debug';
import decaf from 'ember-osf-web/mirage/scenarios/registrations';

// get all accepted revisions on a particular Registration; sort by date in descending order (most recent edits first)
function getAllRevisionsTest(revision: ModelInstance<RevisionModel>){
    return revision.models
        .filter((revisions: { decaf: any; }) => revisions.decaf)
        .sort((a,b) => parseInt(b.dateCreated) - parseInt(a.dateCreated)); // because only approved edits are created
}

module('Acceptance | update dropdown', hooks => {
    setupOSFApplicationTest(hooks);
    setupMirage(hooks);

    test('update dropdown component', async assert => {

        const revisions = server.createList('revision', 10, 'withChildren');
        const beforeCount = revisions.length;

        // TODO update to proper route name once on test
        await visit('/decaf');

        // for the component
        assert.dom('[data-test-verify-update-dropdown-element]').exists();
        await percySnapshot(assert);
        // for the list of revisions
        assert.dom('[data-test-verify-update-dropdown-list]').doesNotExist(); // TODO create data test link
        await percySnapshot(assert);

        await click('[data-test-verify-update-dropdown-list]');
        assert.dom('[data-test-verify-update-dropdown-list').exists();
        decaf.reload();
        assert.dom('[data-test-verify-update-dropdown-list]').doesNotExist();
        assert.equal(revisions.length, beforeCount, 'Correct number of revisions');
        assert.ok(revisions.every(revision => revision.dateCreated), 'All approved revisions present by date.');
    });
 });