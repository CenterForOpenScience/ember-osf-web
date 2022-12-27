import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import { setupMirage } from 'ember-cli-mirage/test-support';
import { setupIntl, t, TestContext } from 'ember-intl/test-support';
import { setupRenderingTest } from 'ember-qunit';
import { module, test } from 'qunit';

import ReviewActionModel from 'ember-osf-web/models/review-action';
import formattedTimeSince from 'ember-osf-web/utils/formatted-time-since';
import { CollectionSubmissionActionTrigger } from 'ember-osf-web/models/collection-submission-action';

interface ThisTestContext extends TestContext {
    reviewAction: ReviewActionModel;
}

module('Integration | Component | Collection | review-actions', hooks => {
    setupRenderingTest(hooks);
    setupIntl(hooks);
    setupMirage(hooks);

    // Collection Moderator actions
    test('Collection submission: Moderator accept action', async function(this: ThisTestContext, assert) {
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
        const action = await this.store.findRecord('collection-submission-action', mirageAction.id);
        this.set('reviewAction', action);

        await render(hbs`<ReviewActionsList::ReviewAction @reviewAction={{this.reviewAction}}/>`);
        assert.dom('[data-test-review-action-wrapper]').exists('Review action wrapper shown');
        assert.dom('[data-test-review-action-wrapper]').containsText(
            'Request accepted 2 days ago by moderator Superb Mario',
            'Collection submission action wrapper shows accept string',
        );
        assert.dom('[data-test-review-action-comment]').doesNotExist('Empty strings do not create comment');
    });

    test('Collection submission: Moderator reject action', async function(this: ThisTestContext, assert) {
        this.store = this.owner.lookup('service:store');
        const collection = server.create('collection');
        const mirageAction = server.create('collection-submission-action', {
            actionTrigger: CollectionSubmissionActionTrigger.Reject,
            creator: server.create('user', { fullName: 'Superb Mario' }, 'loggedIn'),
            target: server.create('collection-submission', {
                guid: server.create('node', 'withContributors'),
                collection,
            }),
        });
        const action = await this.store.findRecord('collection-submission-action', mirageAction.id);
        this.set('reviewAction', action);

        action.set('actionTrigger', CollectionSubmissionActionTrigger.Reject);
        await render(hbs`<ReviewActionsList::ReviewAction @reviewAction={{this.reviewAction}}/>`);
        assert.dom('[data-test-review-action-wrapper]').containsText(
            'Request rejected 2 days ago by moderator Superb Mario',
            'Collection submission action wrapper shows reject string',
        );
    });

    test('Collection submission: Moderator remove action', async function(this: ThisTestContext, assert) {
        this.store = this.owner.lookup('service:store');
        const collection = server.create('collection');
        const mirageAction = server.create('collection-submission-action', {
            actionTrigger: CollectionSubmissionActionTrigger.Remove,
            creator: server.create('user', { fullName: 'Superb Mario' }, 'loggedIn'),
            target: server.create('collection-submission', {
                guid: server.create('node', 'withContributors'),
                collection,
            }),
        });
        const action = await this.store.findRecord('collection-submission-action', mirageAction.id);
        this.set('reviewAction', action);

        action.set('actionTrigger', CollectionSubmissionActionTrigger.Remove);
        await render(hbs`<ReviewActionsList::ReviewAction @reviewAction={{this.reviewAction}}/>`);
        assert.dom('[data-test-review-action-wrapper]').containsText(
            'Item removed 2 days ago by Superb Mario',
            'Collection submission action wrapper shows moderator remove string',
        );
    });

    // Collection Admin actions
    test('Collection submission: Admin actions', async function(this: ThisTestContext, assert) {
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
        const action = await this.store.findRecord('collection-submission-action', mirageAction.id);
        const dateString = formattedTimeSince(action.dateModified);
        let pastTenseString = t('collections.actions.triggerPastTense.submit');
        this.set('reviewAction', action);

        await render(hbs`<ReviewActionsList::ReviewAction @reviewAction={{this.reviewAction}}/>`);
        assert.dom('[data-test-review-action-wrapper]').exists('Review action wrapper shown');
        assert.dom('[data-test-review-action-wrapper]').containsText(
            t('osf-components.reviewActionsList.reviewAction.collectionContributorAction',
                { action: pastTenseString, contributor: 'Superb Mario', date: dateString }),
            'Collection submission action wrapper shows submit string',
        );
        assert.dom('[data-test-review-action-comment]').doesNotExist('Empty strings do not create comment');

        action.set('actionTrigger', CollectionSubmissionActionTrigger.Resubmit);
        await render(hbs`<ReviewActionsList::ReviewAction @reviewAction={{this.reviewAction}}/>`);
        pastTenseString = t('collections.actions.triggerPastTense.resubmit');
        assert.dom('[data-test-review-action-wrapper]').containsText(
            t('osf-components.reviewActionsList.reviewAction.collectionContributorAction',
                { action: pastTenseString, contributor: 'Superb Mario', date: dateString }),
            'Collection submission action wrapper shows resubmit string',
        );

        action.set('actionTrigger', CollectionSubmissionActionTrigger.Remove);
        await render(hbs`<ReviewActionsList::ReviewAction @reviewAction={{this.reviewAction}}/>`);
        pastTenseString = t('collections.actions.triggerPastTense.remove');
        assert.dom('[data-test-review-action-wrapper]').containsText(
            t('osf-components.reviewActionsList.reviewAction.collectionAction',
                { action: pastTenseString, user: 'Superb Mario', date: dateString }),
            'Collection submission action wrapper shows admin remove string',
        );
    });
});
