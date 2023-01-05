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

interface ModerationSubmittedTestContext extends TestContext {
    registrationProvider: ModelInstance<RegistrationProviderModel>;
}

module('Registries | Acceptance | branded.moderation | submitted', hooks => {
    setupEngineApplicationTest(hooks, 'registries');
    setupMirage(hooks);

    hooks.beforeEach(function(this: ModerationSubmittedTestContext) {
        this.registrationProvider = server.create('registration-provider', { id: 'sbmit' });
    });

    test('logged out users are rerouted', async assert => {
        await visit('/registries/sbmit/moderation/submitted');
        assert.equal(currentRouteName(), 'registries.page-not-found', 'Logged out users are rerouted');
    });

    test('logged in, non-moderators are rerouted', async assert => {
        server.create('user', 'loggedIn');
        await visit('/registries/sbmit/moderation/submitted');
        assert.equal(currentRouteName(), 'registries.page-not-found', 'Non-moderators are rerouted');
    });

    test('Submitted: no registrations', async function(this: ModerationSubmittedTestContext, assert) {
        this.registrationProvider.update({ permissions: ['view_submissions'] });
        const currentUser = server.create('user', 'loggedIn');
        server.create('moderator', {
            id: currentUser.id,
            user: currentUser,
            provider: this.registrationProvider,
        });
        await visit('/registries/sbmit/moderation/submitted');
        await percySnapshot('moderation submitted page: no registrations');
        assert.equal(currentRouteName(), 'registries.branded.moderation.submitted',
            'On the submitted page of registries reviews');

        // Accepted tab
        assert.ok(currentURL().includes('state=accepted'), 'Default state is accepted');
        assert.ok(currentURL().includes('state=accepted'), 'query param set to accepted');
        assert.dom('[data-test-submissions-type="accepted"][data-test-is-selected="true"]')
            .exists('Accepted tab has been selected');
        assert.dom('[data-test-registration-list-card]')
            .doesNotExist('No cards shown for accepted submissions');
        assert.dom('[data-test-registration-list-none]').containsText('No public registrations have been found',
            'Proper message is shown when no accepted registrations found');

        // Embargo tab
        await click('[data-test-submissions-type="embargo"]');
        assert.ok(currentURL().includes('state=embargo'), 'query param set to embargo');
        assert.dom('[data-test-submissions-type="embargo"][data-test-is-selected="true"]')
            .exists('Embargo tab has been selected');
        assert.dom('[data-test-registration-list-card]')
            .doesNotExist('No cards shown for embargoed submissions');
        assert.dom('[data-test-registration-list-none]').containsText('No embargoed registrations have been found',
            'Proper message is shown when no accepted registrations found');

        // Rejected tab
        await click('[data-test-submissions-type="rejected"]');
        assert.ok(currentURL().includes('state=rejected'), 'query param set to rejected');
        assert.dom('[data-test-submissions-type="rejected"][data-test-is-selected="true"]')
            .exists('Rejected tab has been selected');
        assert.dom('[data-test-registration-list-card]')
            .doesNotExist('No cards shown for rejected submissions');
        assert.dom('[data-test-registration-list-none]').containsText('No rejected registrations have been found',
            'Proper message is shown when no rejected registrations found');

        // Withdrawn tab
        await click('[data-test-submissions-type="withdrawn"]');
        assert.ok(currentURL().includes('state=withdrawn'), 'query param set to withdrawn');
        assert.dom('[data-test-submissions-type="withdrawn"][data-test-is-selected="true"]')
            .exists('Withdrawn tab has been selected');
        assert.dom('[data-test-registration-list-card]')
            .doesNotExist('No cards shown for withdrawn submissions');
        assert.dom('[data-test-registration-list-none]').containsText('No withdrawn registrations have been found',
            'Proper message is shown when no withdrawn registrations found');
    });

    test('Submitted: many registrations', async function(this: ModerationSubmittedTestContext, assert) {
        server.createList(
            'registration', 12, {
                reviewsState: RegistrationReviewStates.Accepted,
                provider: this.registrationProvider,
            }, 'withReviewActions',
        );
        server.createList(
            'registration', 5, {
                provider: this.registrationProvider,
            }, 'withSingleReviewAction', 'isEmbargo',
        );
        server.createList(
            'registration', 3, {
                reviewsState: RegistrationReviewStates.Rejected, provider: this.registrationProvider,
            },
        );
        server.createList(
            'registration', 4, {
                reviewsState: RegistrationReviewStates.Withdrawn, provider: this.registrationProvider,
            },
        );
        this.registrationProvider.update({ permissions: ['view_submissions'] });
        const currentUser = server.create('user', 'loggedIn');
        server.create('moderator', {
            id: currentUser.id,
            user: currentUser,
            provider: this.registrationProvider,
        }, 'asAdmin');
        await visit('/registries/sbmit/moderation/submitted');
        await percySnapshot('moderation submitted page: many registrations');
        assert.equal(currentRouteName(), 'registries.branded.moderation.submitted',
            'On the submitted page of registries reviews');

        // Accepted tab
        assert.ok(currentURL().includes('state=accepted'), 'Default state is accepted');
        assert.dom('[data-test-ascending-sort]').exists({ count: 1 }, 'Ascending sort button exists');
        assert.dom('[data-test-descending-sort]').exists({ count: 1 }, 'Descending sort button exists');
        assert.dom('[data-test-registration-list-card]').exists({ count: 10 }, '10 accepted registrations shown');
        assert.dom('[data-test-registration-list-card-icon="accepted"]').exists({ count: 10 }, 'Proper icons shown');
        assert.dom('[data-test-registration-list-card-title]').exists({ count: 10 }, 'Title shown');
        assert.dom('[data-test-registration-list-card-latest-action]').exists({ count: 10 }, 'Latest action shown');
        assert.dom('[data-test-next-page-button]').exists('Pagination shown');
        await click('[data-test-next-page-button]');
        assert.dom('[data-test-next-page-button]').hasAttribute('disabled');
        assert.dom('[data-test-registration-list-card]').exists({ count: 2 }, '2 more accepted registrations shown');
        assert.dom('[data-test-registration-card-toggle-actions]')
            .exists({ count: 2 }, 'Toggle to show more review actions');
        const toggleActions = this.element.querySelectorAll('[data-test-registration-card-toggle-actions]');
        await click(toggleActions[0]);
        assert.dom('[data-test-registration-list-card-more-actions]')
            .exists({ count: 2 }, 'More actions shown after clicking the toggler');

        // Embargo tab
        await click('[data-test-submissions-type="embargo"]');
        assert.dom('[data-test-ascending-sort]').exists({ count: 1 }, 'Ascending sort button exists');
        assert.dom('[data-test-descending-sort]').exists({ count: 1 }, 'Descending sort button exists');
        assert.dom('[data-test-registration-list-card]').exists({ count: 5 }, '5 embargoed registrations shown');
        assert.dom('[data-test-registration-list-card-icon="embargo"]').exists({ count: 5 }, 'Proper icons shown');
        assert.dom('[data-test-registration-list-card-title]').exists({ count: 5 }, 'Title shown');
        assert.dom('[data-test-registration-list-card-latest-action]').exists({ count: 5 }, 'Latest action shown');
        assert.dom('[data-test-registration-card-toggle-actions]')
            .doesNotExist('No toggle to show more review actions');
        assert.dom('[data-test-next-page-button]').doesNotExist('No pagination shown');

        // Rejected tab
        await click('[data-test-submissions-type="rejected"]');
        assert.dom('[data-test-ascending-sort]').exists({ count: 1 }, 'Ascending sort button exists');
        assert.dom('[data-test-descending-sort]').exists({ count: 1 }, 'Descending sort button exists');
        assert.dom('[data-test-registration-list-card]').exists({ count: 3 }, '3 rejected registrations shown');
        assert.dom('[data-test-registration-list-card-icon="rejected"]').exists({ count: 3 }, 'Proper icons shown');
        assert.dom('[data-test-registration-list-card-title]').exists({ count: 3 }, 'Title shown');
        assert.dom('[data-test-no-actions-found]').exists({ count: 3 }, 'No actions found');
        assert.dom('[data-test-next-page-button]').doesNotExist('No pagination shown');

        // Withdrawn tab
        await click('[data-test-submissions-type="withdrawn"]');
        assert.dom('[data-test-ascending-sort]').exists({ count: 1 }, 'Ascending sort button exists');
        assert.dom('[data-test-descending-sort]').exists({ count: 1 }, 'Descending sort button exists');
        assert.dom('[data-test-registration-list-card]').exists({ count: 4 }, '4 withdrawn registrations shown');
        assert.dom('[data-test-registration-list-card-icon="withdrawn"]').exists({ count: 4 }, 'Proper icons shown');
        assert.dom('[data-test-registration-list-card-title]').exists({ count: 4 }, 'Title shown');
        assert.dom('[data-test-no-actions-found]').exists({ count: 4 }, 'No actions found');
        assert.dom('[data-test-next-page-button]').doesNotExist('No pagination shown');
    });

    test('Submitted page: queryParams', async function(this: ModerationSubmittedTestContext, assert) {
        this.registrationProvider.update({ permissions: ['view_submissions'] });
        const currentUser = server.create('user', 'loggedIn');
        server.create('moderator', {
            id: currentUser.id,
            user: currentUser,
            provider: this.registrationProvider,
        });
        await visit('/registries/sbmit/moderation/submitted?state=embargo');
        assert.equal(currentRouteName(), 'registries.branded.moderation.submitted',
            'On the submitted page of registries reviews');
        assert.ok(currentURL().includes('state=embargo'), 'current URL contains the state query param set');
        assert.dom('[data-test-is-selected="true"]').hasText('Embargo', 'embargo tab selected');
    });

    test('Submitted page: invalid queryParam', async function(this: ModerationSubmittedTestContext, assert) {
        this.registrationProvider.update({ permissions: ['view_submissions'] });
        const currentUser = server.create('user', 'loggedIn');
        server.create('moderator', {
            id: currentUser.id,
            user: currentUser,
            provider: this.registrationProvider,
        });
        await visit('/registries/sbmit/moderation/submitted?state=embargooooo');
        assert.equal(currentRouteName(), 'registries.branded.moderation.submitted',
            'On the submitted page of registries reviews');
        assert.notOk(currentURL().includes('state=embargooooo'), 'Invalid query param is gone');
        assert.ok(currentURL().includes('state=accepted'), 'Invalid query param replaced with accepted');
        assert.dom('[data-test-is-selected="true"]').hasText('Public', 'Accepted tab selected');
    });
});
