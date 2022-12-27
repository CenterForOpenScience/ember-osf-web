import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import { setupMirage } from 'ember-cli-mirage/test-support';
import { setupIntl, TestContext } from 'ember-intl/test-support';
import { setupRenderingTest } from 'ember-qunit';
import { module, test } from 'qunit';

import CollectionSubmissionAction, { CollectionSubmissionActionTrigger }
    from 'ember-osf-web/models/collection-submission-action';

interface ThisTestContext extends TestContext {
    collectionSubmissionAction: CollectionSubmissionAction;
}

module('Integration | Component | Collection | Admin or Moderator | review-actions', hooks => {
    setupRenderingTest(hooks);
    setupIntl(hooks);
    setupMirage(hooks);

    hooks.beforeEach(async function(this: ThisTestContext) {
        this.store = this.owner.lookup('service:store');
        const collection = server.create('collection');
        const mirageAction = server.create('collection-submission-action', {
            actionTrigger: CollectionSubmissionActionTrigger.Accept,
            creator: server.create('user', { fullName: 'Superb Mario' }, 'loggedIn'),
            target: server.create('collection-submission', {
                guid: server.create('node', 'withContributors'),
                collection,
            }),
        });
        this.collectionSubmissionAction = await this.store.findRecord('collection-submission-action', mirageAction.id);
    });

    test('Collection submission: Moderator accept action', async function(this: ThisTestContext, assert) {
        this.collectionSubmissionAction.actionTrigger = CollectionSubmissionActionTrigger.Accept;

        await render(hbs`<ReviewActionsList::ReviewAction @reviewAction={{this.collectionSubmissionAction}}/>`);
        assert.dom('[data-test-review-action-wrapper]').exists('Review action wrapper shown');
        assert.dom('[data-test-review-action-wrapper]').containsText(
            'Request accepted 2 days ago by moderator Superb Mario',
            'Collection submission action wrapper shows accept string',
        );
        assert.dom('[data-test-review-action-comment]').doesNotExist('Empty strings do not create comment');
    });

    test('Collection submission: Moderator reject action', async function(this: ThisTestContext, assert) {
        this.collectionSubmissionAction.actionTrigger = CollectionSubmissionActionTrigger.Reject;

        await render(hbs`<ReviewActionsList::ReviewAction @reviewAction={{this.collectionSubmissionAction}}/>`);
        assert.dom('[data-test-review-action-wrapper]').containsText(
            'Request rejected 2 days ago by moderator Superb Mario',
            'Collection submission action wrapper shows reject string',
        );
    });

    test('Collection submission: Moderator remove action', async function(this: ThisTestContext, assert) {
        this.collectionSubmissionAction.actionTrigger = CollectionSubmissionActionTrigger.Remove;

        await render(hbs`<ReviewActionsList::ReviewAction @reviewAction={{this.collectionSubmissionAction}}/>`);
        assert.dom('[data-test-review-action-wrapper]').containsText(
            'Item removed 2 days ago by Superb Mario',
            'Collection submission action wrapper shows moderator remove string',
        );
    });
});

module('Integration | Component | Collection | Project Admin | review-actions', hooks => {
    setupRenderingTest(hooks);
    setupIntl(hooks);
    setupMirage(hooks);

    hooks.beforeEach(async function(this: ThisTestContext) {
        this.store = this.owner.lookup('service:store');
        const collection = server.create('collection');
        const mirageAction = server.create('collection-submission-action', {
            actionTrigger: CollectionSubmissionActionTrigger.Submit,
            creator: server.create('user', { fullName: 'Superb Mario' }, 'loggedIn'),
            target: server.create('collection-submission', {
                guid: server.create('node', 'withContributors'),
                collection,
            }),
        });
        this.collectionSubmissionAction = await this.store.findRecord('collection-submission-action', mirageAction.id);
    });

    test('Collection submission: Project Admin remove action', async function(this: ThisTestContext, assert) {

        this.collectionSubmissionAction.actionTrigger = CollectionSubmissionActionTrigger.Remove;


        await render(hbs`<ReviewActionsList::ReviewAction @reviewAction={{this.collectionSubmissionAction}}/>`);
        assert.dom('[data-test-review-action-wrapper]').exists('Review action wrapper shown');
        assert.dom('[data-test-review-action-wrapper]').containsText(
            'Item removed 2 days ago by Superb Mario',
            'Collection submission action wrapper shows submit string',
        );
        assert.dom('[data-test-review-action-comment]').doesNotExist('Empty strings do not create comment');
    });

    test('Collection submission: Project Admin resubmit action', async function(this: ThisTestContext, assert) {

        this.collectionSubmissionAction.actionTrigger = CollectionSubmissionActionTrigger.Resubmit;

        await render(hbs`<ReviewActionsList::ReviewAction @reviewAction={{this.collectionSubmissionAction}}/>`);
        assert.dom('[data-test-review-action-wrapper]').containsText(
            'Request resubmitted 2 days ago by contributor Superb Mario',
            'Collection submission action wrapper shows resubmit string',
        );
    });
});
