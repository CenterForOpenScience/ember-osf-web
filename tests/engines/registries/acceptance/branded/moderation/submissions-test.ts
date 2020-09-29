import { click, currentRouteName } from '@ember/test-helpers';
import { ModelInstance } from 'ember-cli-mirage';
import { setupMirage } from 'ember-cli-mirage/test-support';
import { percySnapshot } from 'ember-percy';
import { TestContext } from 'ember-test-helpers';
import { module, test } from 'qunit';

import RegistrationProviderModel from 'ember-osf-web/models/registration-provider';
import { visit } from 'ember-osf-web/tests/helpers';
import { setupEngineApplicationTest } from 'ember-osf-web/tests/helpers/engines';

interface ModerationSubmissionsTestContext extends TestContext {
    registrationProvider: ModelInstance<RegistrationProviderModel>;
}

module('Registries | Acceptance | branded.moderation | submissions', hooks => {
    setupEngineApplicationTest(hooks, 'registries');
    setupMirage(hooks);

    hooks.beforeEach(function(this: ModerationSubmissionsTestContext) {
        this.registrationProvider = server.create('registration-provider', { id: 'sbmit' });
    });

    test('logged out users are rerouted', async assert => {
        await visit('/registries/sbmit/moderation/submissions');
        assert.equal(currentRouteName(), 'registries.page-not-found', 'Logged out users are rerouted');
    });

    test('logged in, non-moderators are rerouted', async assert => {
        server.create('user', 'loggedIn');
        await visit('/registries/sbmit/moderation/submissions');
        assert.equal(currentRouteName(), 'registries.page-not-found', 'Non-moderators are rerouted');
    });

    test('Submissions pending: no registrations', async function(this: ModerationSubmissionsTestContext, assert) {
        const currentUser = server.create('user', 'loggedIn');
        server.create('moderator', {
            id: currentUser.id,
            user: currentUser,
            provider: this.registrationProvider,
        }, 'asModerator');
        await visit('/registries/sbmit/moderation/submissions');
        await percySnapshot('moderation submissions page');
        assert.equal(currentRouteName(), 'registries.branded.moderation.submissions',
            'On the submissions page of registries reviews');

        // Pending tab
        assert.dom('[data-test-submissions-type="pending"]')
            .hasClass('selected', 'Pending is selected by default for submissions page');
        assert.dom('[data-test-registration-list-card]')
            .doesNotExist('No cards shown for pending submissions');
        assert.dom('[data-test-registration-list-none]').containsText('No pending registrations have been found',
            'Proper message is shown when no pending registrations found');

        // Accepted tab
        await click('[data-test-submissions-type="accepted"]');
        assert.dom('[data-test-submissions-type="accepted"]')
            .hasClass('selected', 'Accepted tab has been selected');
        assert.dom('[data-test-registration-list-card]')
            .doesNotExist('No cards shown for accepted submissions');
        assert.dom('[data-test-registration-list-none]').containsText('No accepted registrations have been found',
            'Proper message is shown when no accepted registrations found');

        // Rejected tab
        await click('[data-test-submissions-type="rejected"]');
        assert.dom('[data-test-submissions-type="rejected"]')
            .hasClass('selected', 'Rejected tab has been selected');
        assert.dom('[data-test-registration-list-card]')
            .doesNotExist('No cards shown for rejected submissions');
        assert.dom('[data-test-registration-list-none]').containsText('No rejected registrations have been found',
            'Proper message is shown when no rejected registrations found');

        // Withdrawn tab
        await click('[data-test-submissions-type="withdrawn"]');
        assert.dom('[data-test-submissions-type="withdrawn"]')
            .hasClass('selected', 'Withdrawn tab has been selected');
        assert.dom('[data-test-registration-list-card]')
            .doesNotExist('No cards shown for withdrawn submissions');
        assert.dom('[data-test-registration-list-none]').containsText('No withdrawn registrations have been found',
            'Proper message is shown when no withdrawn registrations found');
    });

    test('Submissions pending: many registrations', async function(this: ModerationSubmissionsTestContext, assert) {
        server.createList('registration', 12, { machineState: 'pending', provider: this.registrationProvider });
        server.createList('registration', 3, { machineState: 'accepted', provider: this.registrationProvider });
        server.createList('registration', 3, { machineState: 'rejected', provider: this.registrationProvider });
        server.createList('registration', 3, { machineState: 'withdrawn', provider: this.registrationProvider });
        const currentUser = server.create('user', 'loggedIn');
        server.create('moderator', {
            id: currentUser.id,
            user: currentUser,
            provider: this.registrationProvider,
        }, 'asAdmin');
        await visit('/registries/sbmit/moderation/submissions');
        await percySnapshot('moderation submissions page');
        assert.equal(currentRouteName(), 'registries.branded.moderation.submissions',
            'On the submissions page of registries reviews');

        // Pending tab
        // check for pagination
        // check for icon
        // check for title
        // check for time submitted
        // check for time admin action taken

        // Accepted tab

        // Rejected tab

        // Withdrawn tab
    });
});
