import { setupMirage } from 'ember-cli-mirage/test-support';
import { percySnapshot } from 'ember-percy';
import { module, test } from 'qunit';

import { visit } from 'ember-osf-web/tests/helpers';
import { setupEngineApplicationTest } from 'ember-osf-web/tests/helpers/engines';
import { settled, triggerKeyEvent } from '@ember/test-helpers';
import click from '@ember/test-helpers/dom/click';
import fillIn from '@ember/test-helpers/dom/fill-in';
import { currentRouteName } from '@ember/test-helpers/setup-application-context';

import { CollectionSubmissionReviewStates } from 'ember-osf-web/models/collection-submission';

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

        assert.dom('[data-test-submission-sort]').containsText('Date (newest first)',
            'Sort dropdown exists and default is sort by date descending');

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
            guid: server.create('node', { id: 'accept', title: 'To be accepted' }),
            id: 'accept',
        });
        server.create('collection-submission', {
            creator: server.create('user'),
            reviewsState: CollectionSubmissionReviewStates.Pending,
            collection: primaryCollection,
            guid: server.create('node', { id: 'reject', title: 'To be rejected' }),
            id: 'reject',
        });
        const provider = server.create('collection-provider', {
            id: 'studyswap',
            primaryCollection,
        }, 'currentUserIsAdmin');
        await visit(`/collections/${provider.id}/moderation/`);
        assert.dom('[data-test-submission-card-icon]').exists({ count: 2 }, 'has two pending submissions');
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
        assert.dom('[data-test-submission-card="accept"]').doesNotExist('accepted submission is removed');
        assert.dom('[data-test-submission-card="reject"]').exists('submission to be rejected is still present');
        assert.dom('[data-test-moderation-dropdown-button]').exists({ count: 1 }, 'has one moderation dropdown');
        await click('[data-test-submissions-type="accepted"]');
        assert.dom('[data-test-submission-card-title]').containsText('To be accepted', 'has one accepted submission');

        // Reject second submission
        await click('[data-test-submissions-type="pending"]');
        await click('[data-test-moderation-dropdown-button]');
        assert.dom('[data-test-moderation-dropdown-submit]').isDisabled('submit button is disabled');
        await click('[data-test-moderation-dropdown-decision-label="reject"]');
        assert.dom('[data-test-validation-errors="comment"]').exists('Comment is required');
        await fillIn('[data-test-moderation-dropdown-comment]', 'This is a comment');
        triggerKeyEvent('[data-test-moderation-dropdown-comment]', 'keyup', 32);
        await settled();
        await click('[data-test-moderation-dropdown-submit]');
        assert.dom('[data-test-submission-card="reject"]').doesNotExist('rejected submission is removed');
        assert.dom('[data-test-moderation-dropdown-button]').doesNotExist('No more pending submisisons');
        assert.dom('[data-test-moderation-submissions-empty]').exists('no pending submssions message shown');
        await click('[data-test-submissions-type="rejected"]');
        assert.dom('[data-test-submission-card="reject"]').exists('rejected submission is shown');
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
            guid: server.create('node', {id: 'remove', title: 'To be removed'}),
        });
        const provider = server.create('collection-provider', {
            id: 'studyswap',
            primaryCollection,
        }, 'currentUserIsAdmin');
        await visit(`/collections/${provider.id}/moderation/all?state=accepted`);
        assert.dom('[data-test-submission-card="remove"]').exists('submission to be removed is present');
        assert.dom('[data-test-moderation-dropdown-button]').exists({ count: 1 }, 'has 1 pending submission');
        // check removed tab
        await click('[data-test-submissions-type="removed"]');
        assert.dom('[data-test-moderation-dropdown-button]').doesNotExist('no removed submissions');

        // Remove submission
        await click('[data-test-submissions-type="accepted"]');
        await click('[data-test-moderation-dropdown-button]');
        assert.dom('[data-test-moderation-dropdown-submit]').isDisabled('submit button is disabled');
        await click('[data-test-moderation-dropdown-decision-label="remove"]');
        assert.dom('[data-test-validation-errors="comment"]').exists('Comment is required');
        await fillIn('[data-test-moderation-dropdown-comment]', 'This is a comment');
        triggerKeyEvent('[data-test-moderation-dropdown-comment]', 'keyup', 32);
        await settled();
        await click('[data-test-moderation-dropdown-submit]');
        assert.dom('[data-test-submission-card="remove"]').doesNotExist('removed submission is gone');
        assert.dom('[data-test-moderation-dropdown-button]').doesNotExist('No more pending submisisons');
        await click('[data-test-submissions-type="removed"]');
        assert.dom('[data-test-submission-card-title]').containsText('To be removed', 'has one removed submission');
    });
});
