import { click, render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import { setupRenderingTest } from 'ember-qunit';
import { module, test } from 'qunit';
import { setupMirage } from 'ember-cli-mirage/test-support';
import { TestContext } from 'ember-test-helpers';

import CollectionModel from 'ember-osf-web/models/collection';
import CollectionSubmissionModel,{ CollectionSubmissionReviewStates } from 'ember-osf-web/models/collection-submission';
import { CollectionSubmissionActionTrigger } from 'ember-osf-web/models/collection-submission-action';
import NodeModel from 'ember-osf-web/models/node';

import { OsfLinkRouterStub } from '../../helpers/osf-link-router-stub';

interface ThisTestContext extends TestContext {
    collection: CollectionModel;
    node: NodeModel;
    submission: CollectionSubmissionModel;
}

module('Integration | Component | collection-submission-card', hooks => {
    setupRenderingTest(hooks);
    setupMirage(hooks);

    hooks.beforeEach(async function(this: ThisTestContext) {
        this.owner.unregister('service:router');
        this.owner.register('service:router', OsfLinkRouterStub);
        const store = this.owner.lookup('service:store');
        const collection = server.create('collection');
        this.collection = await store.findRecord('collection', collection.id);
        const mirageNode = server.create('node');
        this.node = await store.findRecord('node', mirageNode.id);
        const submissionId = `${collection.id}-${mirageNode.id}`;

        const currentUser = server.create('user', 'loggedIn');
        const mirageSubmission = server.create('collection-submission', {
            creator: currentUser,
            guid: mirageNode,
            id: mirageNode.id,
            collection,
        });
        server.create('collection-submission-action', {
            creator: currentUser,
            target: mirageSubmission,
            actionTrigger: CollectionSubmissionActionTrigger.Accept,
            fromState: CollectionSubmissionReviewStates.Pending,
            toState: CollectionSubmissionReviewStates.Accepted,
        });
        this.submission = await store.findRecord('collection-submission', submissionId);
    });

    test('it renders accepted submission', async function(this: ThisTestContext, assert) {
        this.submission.reviewsState = CollectionSubmissionReviewStates.Accepted;
        await render(hbs`
        <CollectionSubmissionCard
            @submission={{this.submission}}
        />`);
        assert.dom('[data-test-submission-card-icon]').hasAttribute('data-icon', 'check', 'Accepted icon shown');
        assert.dom('[data-test-submission-card-title]').containsText(this.node.title, 'Node title shown');
        assert.dom('[data-test-submission-card-latest-action]')
            .containsText('Submission accepted', 'Latest action shown');
        await click('[data-test-moderation-dropdown-button]');
        assert.dom('[data-test-moderation-dropdown-submit]').isDisabled('Submit button is disabled');
        assert.dom('[data-test-moderation-dropdown-decision-label="moderator_remove"]').exists('Accept option shown');
        await click('[data-test-moderation-dropdown-button]');

        this.submission.reviewsState = CollectionSubmissionReviewStates.Pending;
        await render(hbs`
        <CollectionSubmissionCard
            @submission={{this.submission}}
        />`);
        assert.dom('[data-test-submission-card-icon]').hasAttribute('data-icon', 'clock', 'Pending icon shown');
        await click('[data-test-moderation-dropdown-button]');
        assert.dom('[data-test-moderation-dropdown-decision-label="accept"]').exists('Accept trigger shown');
        assert.dom('[data-test-moderation-dropdown-decision-label="reject"]').exists('Reject trigger shown');
        await click('[data-test-moderation-dropdown-button]');

        this.submission.reviewsState = CollectionSubmissionReviewStates.Rejected;
        await render(hbs`
        <CollectionSubmissionCard
            @submission={{this.submission}}
        />`);
        assert.dom('[data-test-submission-card-icon]').hasAttribute('data-icon', 'times', 'Rejected icon shown');
        assert.dom('[data-test-moderation-dropdown-button]').doesNotExist('No moderation dropdown for rejected');

        this.submission.reviewsState = CollectionSubmissionReviewStates.Removed;
        await render(hbs`
        <CollectionSubmissionCard
            @submission={{this.submission}}
        />`);
        assert.dom('[data-test-submission-card-icon]').hasAttribute('data-icon', 'trash', 'Removed icon shown');
        assert.dom('[data-test-moderation-dropdown-button]').doesNotExist('No moderation dropdown for removed');
    });
});
