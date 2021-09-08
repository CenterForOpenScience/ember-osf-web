import { visit } from '@ember/test-helpers';

import { ModelInstance } from 'ember-cli-mirage';
import { setupMirage } from 'ember-cli-mirage/test-support';
import { percySnapshot } from 'ember-percy';
import { module, test } from 'qunit';

import Registration, { RegistrationReviewStates } from 'ember-osf-web/models/registration';
import { RevisionReviewStates } from 'ember-osf-web/models/revision';
import { click, setupOSFApplicationTest } from 'ember-osf-web/tests/helpers';

import { Permission } from 'ember-osf-web/models/osf-model';

function allRevisions(registration: ModelInstance<Registration>){
    return registration.revisions
        .filter(revision => !revision.versionNumber)
        .sort((a,b) => parseInt(b.id, 10) - parseInt(a.id, 10));
}

module('Acceptance | update dropdown', hooks => {
    setupOSFApplicationTest(hooks);
    setupMirage(hooks);

    test('update dropdown - all revisions', async assert => {
        const userServer = server.create('user', 'loggedIn');

        const node = server.create('node', {
            id: 'cobalt',
            title: 'Outcome Reporting Testing',
            currentUserPermissions: [Permission.Read],
            currentUserIsContributor: true,
            registration: true,
            public: true,
        });
        server.create('registration', {
            registeredFrom: node,
            reviewsState: RegistrationReviewStates.Accepted,
            revisionState: RevisionReviewStates.Approved,
        });
        server.create('draft-registration', {
            branchedFrom: node,
        }, 'currentUserIsReadAndWrite');
        server.create('revision', {
            reviewState: RevisionReviewStates.Approved,
            versionNumber: 1,
        });
        server.create('revision', {
            reviewState: RevisionReviewStates.Approved,
            versionNumber: 2,
        });
        server.create('revision', {
            reviewState: RevisionReviewStates.Approved,
            versionNumber: 3,
        });
        const beforeCount = userServer.registrations.length;

        const revisions = server.createList('revision', 10, 'withChildren');

        const revisions = allRevisions(registration);

        const url = `/${node.id}/registrations`;
        await visit(url);

        // for the component itself
        assert.dom('[data-test-update-button]').exists();
        await percySnapshot(assert);

        // for the list of revisions
        assert.dom('[data-test-update-list]').doesNotExist();
        await percySnapshot(assert);
        await click('[data-test-update-list]');
        assert.dom('[data-test-list-view]').exists();
        assert.equal(registration.revisions.length, beforeCount, 'Correct number of revisions');
        assert.ok(revisions.every(revision => revision.versionNumber), 'Version number present.');
        userServer.reload();
        assert.dom('[data-test-list-view]').doesNotExist();
    });
});
