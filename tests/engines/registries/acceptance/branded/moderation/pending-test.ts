import { click, currentRouteName, currentURL } from '@ember/test-helpers';
import { ModelInstance } from 'ember-cli-mirage';
import { setupMirage } from 'ember-cli-mirage/test-support';
import { percySnapshot } from 'ember-percy';
import { TestContext } from 'ember-test-helpers';
import { module, test } from 'qunit';

import { RegistrationReviewStates } from 'ember-osf-web/models/registration';
import RegistrationProviderModel from 'ember-osf-web/models/registration-provider';
import { visit } from 'ember-osf-web/tests/helpers';
import { setupEngineApplicationTest } from 'ember-osf-web/tests/helpers/engines';
import { RevisionReviewStates } from 'ember-osf-web/models/schema-response';

interface ModerationPendingTestContext extends TestContext {
    registrationProvider: ModelInstance<RegistrationProviderModel>;
}

module('Registries | Acceptance | branded.moderation | pending', hooks => {
    setupEngineApplicationTest(hooks, 'registries');
    setupMirage(hooks);

    hooks.beforeEach(function(this: ModerationPendingTestContext) {
        this.registrationProvider = server.create('registration-provider', { id: 'sbmit' });
    });

    test('logged out users are rerouted', async assert => {
        await visit('/registries/sbmit/moderation/pending');
        assert.equal(currentRouteName(), 'registries.page-not-found', 'Logged out users are rerouted');
    });

    test('logged in, non-moderators are rerouted', async assert => {
        server.create('user', 'loggedIn');
        await visit('/registries/sbmit/moderation/pending');
        assert.equal(currentRouteName(), 'registries.page-not-found', 'Non-moderators are rerouted');
    });

    test('Pending: no updates allowed', async function(this: ModerationPendingTestContext, assert) {
        this.registrationProvider.update({ allowUpdates: false, permissions: ['view_submissions'] });
        const currentUser = server.create('user', 'loggedIn');
        server.create('moderator', {
            id: currentUser.id,
            user: currentUser,
            provider: this.registrationProvider,
        }, 'asModerator');
        await visit('/registries/sbmit/moderation/pending');
        await percySnapshot('moderation pending page: updates not allowed');
        assert.equal(currentRouteName(), 'registries.branded.moderation.pending',
            'On the pending page of registries reviews');

        assert.dom('[data-test-submissions-type="pending"]').exists('pending tab shown');
        assert.dom('[data-test-submissions-type="pending-withdraw"]').exists('pending withdraw tab shown');
        assert.dom('[data-test-submissions-type="revision-pending"]')
            .doesNotExist('pending revisions tab not shown');
    });

    test('Pending: no registrations', async function(this: ModerationPendingTestContext, assert) {
        this.registrationProvider.update({ permissions: ['view_submissions'] });
        const currentUser = server.create('user', 'loggedIn');
        server.create('moderator', {
            id: currentUser.id,
            user: currentUser,
            provider: this.registrationProvider,
        }, 'asModerator');
        await visit('/registries/sbmit/moderation/pending');
        await percySnapshot('moderation pending page: no registrations');
        assert.equal(currentRouteName(), 'registries.branded.moderation.pending',
            'On the pending page of registries reviews');

        // Pending tab
        assert.ok(currentURL().includes('state=pending'), 'Default state is pending');
        assert.dom('[data-test-submissions-type="pending"][data-test-is-selected="true"]')
            .exists('Pending is selected by default for pending page');
        assert.dom('[data-test-registration-list-card]')
            .doesNotExist('No cards shown for pending registrations');
        assert.dom('[data-test-registration-list-none]').containsText(
            'No registrations pending approval have been found',
            'Proper message is shown when no pending registrations found',
        );

        // Pending revision tab
        await click('[data-test-submissions-type="revision-pending"]');
        assert.ok(currentURL().includes('state=pending_moderation'), 'query param set to pending revision');
        assert.dom('[data-test-submissions-type="revision-pending"][data-test-is-selected="true"]')
            .exists('Pending revisions has been selected');
        assert.dom('[data-test-registration-list-card]')
            .doesNotExist('No cards shown for pending revisions');
        assert.dom('[data-test-registration-list-none]').containsText(
            'No registrations found with updates pending',
            'Proper message is shown when no pending revisions found',
        );

        // Pending Withdrawal tab
        await click('[data-test-submissions-type="pending-withdraw"]');
        assert.ok(currentURL().includes('state=pending_withdraw'), 'query param set to pending withdraw');
        assert.dom('[data-test-submissions-type="pending-withdraw"][data-test-is-selected="true"]')
            .exists('Pending withdraw tab has been selected');
        assert.dom('[data-test-registration-list-card]')
            .doesNotExist('No cards shown for pending withdrawals');
        assert.dom('[data-test-registration-list-none]').containsText('No registrations found pending withdrawal',
            'Proper message is shown when no registrations pending withdrawal found');
    });

    test('Pending: many registrations', async function(this: ModerationPendingTestContext, assert) {
        server.createList(
            'registration', 12, {
                reviewsState: RegistrationReviewStates.Pending, provider: this.registrationProvider,
            }, 'withReviewActions',
        );
        const acceptedReg = server.create(
            'registration', {
                reviewsState: RegistrationReviewStates.Accepted,
                revisionState: RevisionReviewStates.RevisionPendingModeration,
                provider: this.registrationProvider,
            },
        );
        server.create('schemaResponse', { registration: acceptedReg }, 'withSchemaResponseActions');
        server.createList(
            'registration', 2, {
                reviewsState: RegistrationReviewStates.PendingWithdraw, provider: this.registrationProvider,
            },
        );
        this.registrationProvider.update({ permissions: ['view_submissions'] });
        const currentUser = server.create('user', 'loggedIn');
        server.create('moderator', {
            id: currentUser.id,
            user: currentUser,
            provider: this.registrationProvider,
        }, 'asAdmin');
        await visit('/registries/sbmit/moderation/pending');
        await percySnapshot('moderation pending page: many registrations');
        assert.equal(currentRouteName(), 'registries.branded.moderation.pending',
            'On the pending page of registries reviews');

        // Pending tab
        assert.ok(currentURL().includes('state=pending'), 'Default state is pending');
        assert.dom('[data-test-ascending-sort]').exists({ count: 1 }, 'Ascending sort button exists');
        assert.dom('[data-test-descending-sort]').exists({ count: 1 }, 'Descending sort button exists');
        assert.dom('[data-test-registration-list-card]').exists({ count: 10 }, '10 pending registrations shown');
        assert.dom('[data-test-registration-list-card-icon="pending"]').exists({ count: 10 }, 'Proper icons shown');
        assert.dom('[data-test-registration-list-card-title]').exists({ count: 10 }, 'Title shown');
        assert.dom('[data-test-registration-list-card-latest-action]').exists({ count: 10 }, 'Latest actions shown');
        assert.dom('[data-test-next-page-button]').exists('Pagination shown');
        await click('[data-test-next-page-button]');
        assert.dom('[data-test-next-page-button]').hasAttribute('disabled');
        assert.dom('[data-test-registration-list-card]').exists({ count: 2 }, '2 more pending registrations shown');
        assert.dom('[data-test-registration-card-toggle-actions]')
            .exists({ count: 2 }, 'Toggle to show more review actions');
        const toggleActions = this.element.querySelectorAll('[data-test-registration-card-toggle-actions]');
        await click(toggleActions[0]);
        assert.dom('[data-test-registration-list-card-more-actions]')
            .exists({ count: 2 }, 'More actions shown after clicking the toggler');

        // Pending revision tab
        await click('[data-test-submissions-type="revision-pending"]');
        assert.dom('[data-test-ascending-sort]').exists({ count: 1 }, 'Ascending sort button exists');
        assert.dom('[data-test-descending-sort]').exists({ count: 1 }, 'Descending sort button exists');
        assert.dom('[data-test-registration-list-card]').exists({ count: 1 }, '1 pending revision registrations shown');
        assert.dom('[data-test-registration-list-card-icon="pending_moderation"]')
            .exists({ count: 1 }, 'Proper icons shown');
        assert.dom('[data-test-registration-list-card-title]').exists({ count: 1 }, 'Title shown');
        assert.dom('[data-test-registration-list-card-latest-action]')
            .exists({ count: 1 }, 'Latest schema response action shown');
        assert.dom('[data-test-registration-card-toggle-actions]')
            .exists({ count: 1}, 'Toggle to show more revision actions');
        assert.dom('[data-test-next-page-button]').doesNotExist('No pagination shown');

        // Pending Withdrawal tab
        await click('[data-test-submissions-type="pending-withdraw"]');
        assert.dom('[data-test-ascending-sort]').exists({ count: 1 }, 'Ascending sort button exists');
        assert.dom('[data-test-descending-sort]').exists({ count: 1 }, 'Descending sort button exists');
        assert.dom('[data-test-registration-list-card]')
            .exists({ count: 2 }, '2 registrations pending withdrawal shown');
        assert.dom('[data-test-registration-list-card-icon="pending_withdraw"]')
            .exists({ count: 2 }, 'Proper icons shown');
        assert.dom('[data-test-registration-list-card-title]').exists({ count: 2 }, 'Title shown');
        assert.dom('[data-test-no-actions-found]').exists({ count: 2 }, 'No actions found');
        assert.dom('[data-test-next-page-button]').doesNotExist('No pagination shown');
        await click('[data-test-registration-list-card-title]>a');
        assert.equal(currentRouteName(), 'registries.overview.index',
            'Clicking the registration title from moderation takes moderators to the overview page');
        assert.ok(currentURL().includes('mode=moderator'), 'Mode query param set to moderator');
    });

    test('Submissions page: queryParams', async function(this: ModerationPendingTestContext, assert) {
        this.registrationProvider.update({ permissions: ['view_submissions'] });
        const currentUser = server.create('user', 'loggedIn');
        server.create('moderator', {
            id: currentUser.id,
            user: currentUser,
            provider: this.registrationProvider,
        }, 'asModerator');
        await visit('/registries/sbmit/moderation/pending?state=pending_moderation');
        assert.equal(currentRouteName(), 'registries.branded.moderation.pending',
            'On the pending page of registries reviews');
        assert.ok(currentURL()
            .includes('state=pending_moderation'), 'current URL contains the state query param set');
        assert.dom('[data-test-is-selected="true"]').hasText('Pending Updates', 'Updates tab selected');
    });

    test('Submissions page: invalid queryParam', async function(this: ModerationPendingTestContext, assert) {
        this.registrationProvider.update({ permissions: ['view_submissions'] });
        const currentUser = server.create('user', 'loggedIn');
        server.create('moderator', {
            id: currentUser.id,
            user: currentUser,
            provider: this.registrationProvider,
        }, 'asModerator');
        await visit('/registries/sbmit/moderation/pending?state=donkey_kong');
        assert.equal(currentRouteName(), 'registries.branded.moderation.pending',
            'On the pending page of registries reviews');
        assert.notOk(currentURL().includes('state=donkey_kong'), 'Invalid query param is gone');
        assert.ok(currentURL().includes('state=pending'), 'Invalid query param replaced with pending');
        assert.dom('[data-test-is-selected="true"]').hasText('Pending', 'Pending tab selected');
    });
});
