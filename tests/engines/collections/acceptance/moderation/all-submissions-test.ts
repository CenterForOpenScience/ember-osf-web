import { setupMirage } from 'ember-cli-mirage/test-support';
import { percySnapshot } from 'ember-percy';
import { module, test } from 'qunit';

import { visit } from 'ember-osf-web/tests/helpers';
import { setupEngineApplicationTest } from 'ember-osf-web/tests/helpers/engines';
import { currentRouteName } from '@ember/test-helpers/setup-application-context';

import { CollectionSubmissionReviewStates } from 'ember-osf-web/models/collection-submission';
import click from '@ember/test-helpers/dom/click';

module('Collections | Acceptance | moderation | all', hooks => {
    setupEngineApplicationTest(hooks, 'collections');
    setupMirage(hooks);

    test('it defaults to pending and changes tabs', async assert => {
        server.create('user', 'loggedIn');
        const primaryCollection = server.create('collection');
        server.create('collection-submission', {
            creator: server.create('user'),
            reviewsState: CollectionSubmissionReviewStates.Pending,
            collection: primaryCollection,
            guid: server.create('node'),
        });
        server.create('collection-submission', {
            creator: server.create('user'),
            reviewsState: CollectionSubmissionReviewStates.Accepted,
            collection: primaryCollection,
            guid: server.create('node'),
        });
        server.create('collection-submission', {
            creator: server.create('user'),
            reviewsState: CollectionSubmissionReviewStates.Rejected,
            collection: primaryCollection,
            guid: server.create('node'),
        });
        const provider = server.create('collection-provider', {
            id: 'studyswap',
            primaryCollection,
        }, 'currentUserIsAdmin');
        await visit(`/collections/${provider.id}/moderation/`);
        assert.equal(currentRouteName(), 'collections.provider.moderation.all');
        assert.dom('[data-test-collections-moderation-all-tab]').hasClass('active', 'all submissions is active tab');

        assert.dom('[data-test-submissions-type="pending"][data-test-is-selected="true"]')
            .exists('pending is selected by default');
        assert.dom('[data-test-submission-card-icon]').exists({ count: 1 }, 'has one pending submission');

        await click('[data-test-submissions-type="accepted"]');
        assert.dom('[data-test-submissions-type="accepted"][data-test-is-selected="true"]')
            .exists('accepted is selected');
        assert.dom('[data-test-submission-card-icon]').exists({ count: 1 }, 'has one accepted submission');

        await click('[data-test-submissions-type="rejected"]');
        assert.dom('[data-test-submissions-type="rejected"][data-test-is-selected="true"]')
            .exists('rejected is selected');
        assert.dom('[data-test-submission-card-icon]').exists({ count: 1 }, 'has one rejected submission');

        await click('[data-test-submissions-type="removed"]');
        assert.dom('[data-test-submissions-type="removed"][data-test-is-selected="true"]')
            .exists('removed is selected');
        assert.dom('[data-test-moderation-submissions-empty]').exists('no removed submssions are shown');
        await percySnapshot(assert);
    });

    test('it moderates pending submissions', async assert => {
        server.create('user', 'loggedIn');
        const primaryCollection = server.create('collection');
        server.create('collection-submission', {
            creator: server.create('user'),
            reviewsState: CollectionSubmissionReviewStates.Pending,
            collection: primaryCollection,
            guid: server.create('node', {title: 'To be accepted'}),
        });
        server.create('collection-submission', {
            creator: server.create('user'),
            reviewsState: CollectionSubmissionReviewStates.Pending,
            collection: primaryCollection,
            guid: server.create('node', {title: 'To be rejected'}),
        });
        const provider = server.create('collection-provider', {
            id: 'studyswap',
            primaryCollection,
        }, 'currentUserIsAdmin');
        await visit(`/collections/${provider.id}/moderation/`);
        assert.dom('[data-test-moderation-dropdown-button]').exists({ count: 2 }, 'has two moderation dropdowns');
        // check accepted and rejected tab
        await click('[data-test-submissions-type="accepted"]');
        assert.dom('[data-test-moderation-dropdown-button]').doesNotExist('no accepted submissions');
        await click('[data-test-submissions-type="rejected"]');
        assert.dom('[data-test-moderation-dropdown-button]').doesNotExist('no rejected submissions');

        // Accept first submission
        await click('[data-test-submissions-type="pending"]');
        await click('[data-test-moderation-dropdown-button]');
        assert.dom('[data-test-moderation-dropdown-submit]').isDisabled('submit button is disabled');
        await click('[data-test-moderation-dropdown-decision-label="accept"]');
        await click('[data-test-moderation-dropdown-submit]');
        // TODO: need to reload automatically
        await click('[data-test-submissions-type="pending"]');
        assert.dom('[data-test-moderation-dropdown-button]').exists({ count: 1 }, 'has one moderation dropdown');
        await click('[data-test-submissions-type="accepted"]');
        assert.dom('[data-test-submission-card-title]').containsText('To be accepted', 'has one accepted submission');

        // Reject second submission
        await click('[data-test-submissions-type="pending"]');
        await click('[data-test-moderation-dropdown-button]');
        assert.dom('[data-test-moderation-dropdown-submit]').isDisabled('submit button is disabled');
        await click('[data-test-moderation-dropdown-decision-label="reject"]');
        await click('[data-test-moderation-dropdown-submit]');
        // TODO: need to reload automatically
        await click('[data-test-submissions-type="pending"]');
        assert.dom('[data-test-moderation-dropdown-button]').doesNotExist('No more pending submisisons');
        assert.dom('[data-test-moderation-submissions-empty]').exists('no pending submssions message shown');
        await click('[data-test-submissions-type="rejected"]');
        assert.dom('[data-test-submission-card-title]').containsText('To be rejected', 'has one rejected submission');
    });

    // 1 accepted -> 1 removed
    test('it moderates accepted submissions', async assert => {
        server.create('user', 'loggedIn');
        const primaryCollection = server.create('collection');
        server.create('collection-submission', {
            creator: server.create('user'),
            reviewsState: CollectionSubmissionReviewStates.Accepted,
            collection: primaryCollection,
            guid: server.create('node', {title: 'To be removed'}),
        });
        const provider = server.create('collection-provider', {
            id: 'studyswap',
            primaryCollection,
        }, 'currentUserIsAdmin');
        await visit(`/collections/${provider.id}/moderation/all?state=accepted`);
        assert.dom('[data-test-moderation-dropdown-button]').exists({ count: 1 }, 'has 1 pending submission');
        // check removed tab
        await click('[data-test-submissions-type="removed"]');
        assert.dom('[data-test-moderation-dropdown-button]').doesNotExist('no removed submissions');

        // Remove submission
        await click('[data-test-submissions-type="accepted"]');
        await click('[data-test-moderation-dropdown-button]');
        assert.dom('[data-test-moderation-dropdown-submit]').isDisabled('submit button is disabled');
        await click('[data-test-moderation-dropdown-decision-label="moderator_remove"]');
        await click('[data-test-moderation-dropdown-submit]');
        // TODO: need to reload automatically
        await click('[data-test-submissions-type="accepted"]');
        assert.dom('[data-test-moderation-dropdown-button]').doesNotExist('No more pending submisisons');
        await click('[data-test-submissions-type="removed"]');
        assert.dom('[data-test-submission-card-title]').containsText('To be removed', 'has one removed submission');
    });
});
