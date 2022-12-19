import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import { setupMirage } from 'ember-cli-mirage/test-support';
import { setupIntl, t, TestContext } from 'ember-intl/test-support';
import { setupRenderingTest } from 'ember-qunit';
import faker from 'faker';
import { module, test } from 'qunit';

import RegistrationModel, { RegistrationReviewStates } from 'ember-osf-web/models/registration';
import ReviewActionModel, { ReviewActionTrigger } from 'ember-osf-web/models/review-action';
import UserModel from 'ember-osf-web/models/user';
import formattedTimeSince from 'ember-osf-web/utils/formatted-time-since';
import { CollectionSubmissionActionTrigger } from 'ember-osf-web/models/collection-submission-action';

interface ThisTestContext extends TestContext {
    reviewAction: ReviewActionModel;
}

module('Integration | Component | review-actions', hooks => {
    setupRenderingTest(hooks);
    setupIntl(hooks);
    setupMirage(hooks);

    hooks.beforeEach(async function(this: ThisTestContext) {
        this.store = this.owner.lookup('service:store');
        const mirageRegistration = server.create('registration', 'withSingleReviewAction');
        const registration = await this.store.findRecord('registration', mirageRegistration.id) as RegistrationModel;
        const [reviewAction] = await registration.loadAll('reviewActions') as ReviewActionModel[];
        const creator: UserModel = await reviewAction.creator;
        this.reviewAction = reviewAction;
        this.reviewAction.setProperties({ comment: null });
        creator.set('fullName', 'Superb Mario');
    });

    // Moderator actions
    test('Standard accept action', async function(this: ThisTestContext, assert) {
        this.reviewAction.setProperties({
            actionTrigger: ReviewActionTrigger.AcceptSubmission,
            toState: RegistrationReviewStates.Accepted,
        });
        const dateString = formattedTimeSince(this.reviewAction.dateModified);
        const pastTenseString = t('registries.reviewActions.triggerPastTense.accept_submission');

        this.set('reviewAction', this.reviewAction);

        await render(hbs`<ReviewActionsList::ReviewAction @reviewAction={{this.reviewAction}}/>`);
        assert.dom('[data-test-review-action-wrapper]').exists('Review action wrapper shown');
        assert.dom('[data-test-review-action-wrapper]').containsText(
            t('osf-components.reviewActionsList.reviewAction.acceptRegistrationSubmission',
                { action: pastTenseString, moderator: 'Superb Mario', date: dateString }),
            'Review action wrapper shows proper string',
        );
        assert.dom('[data-test-review-action-wrapper]')
            .doesNotContainText('contributor', 'Review action does not mention contributor');
        assert.dom('[data-test-review-action-comment]').doesNotExist('No comment to show');
    });

    test('Embargo accept action', async function(this: ThisTestContext, assert) {
        const embargoEndDate = faker.date.future(1, new Date(2099, 0, 0));
        this.reviewAction.setProperties({
            actionTrigger: ReviewActionTrigger.AcceptSubmission,
            toState: RegistrationReviewStates.Embargo,
        });
        const dateString = formattedTimeSince(this.reviewAction.dateModified);
        const embargoEndDateString = this.intl.formatDate(embargoEndDate, { locale: this.intl.locale });
        const pastTenseString = t('registries.reviewActions.triggerPastTense.accept_submission');
        this.set('embargoEndDate', embargoEndDate);
        this.set('reviewAction', this.reviewAction);

        await render(hbs`<ReviewActionsList::ReviewAction
            @reviewAction={{this.reviewAction}}
            @embargoEndDate={{this.embargoEndDate}}/>`);
        assert.dom('[data-test-review-action-wrapper]').exists('Review action wrapper shown');
        assert.dom('[data-test-review-action-wrapper]').containsText(
            t('osf-components.reviewActionsList.reviewAction.acceptRegistrationEmbargoSubmission',
                {
                    action: pastTenseString,
                    moderator: 'Superb Mario',
                    date: dateString,
                    embargoEndDate: embargoEndDateString,
                }),
            'Review action wrapper shows proper string',
        );
        assert.dom('[data-test-review-action-wrapper]')
            .doesNotContainText('contributor', 'Review action does not mention contributors');
        assert.dom('[data-test-review-action-comment]').doesNotExist('No comment to show');
    });

    test('Accept withdraw action', async function(this: ThisTestContext, assert) {
        this.reviewAction.set('actionTrigger', ReviewActionTrigger.AcceptWithdrawal);
        const dateString = formattedTimeSince(this.reviewAction.dateModified);
        const pastTenseString = t('registries.reviewActions.triggerPastTense.accept_withdrawal');
        this.set('reviewAction', this.reviewAction);

        await render(hbs`<ReviewActionsList::ReviewAction @reviewAction={{this.reviewAction}}/>`);
        assert.dom('[data-test-review-action-wrapper]').exists('Review action wrapper shown');
        assert.dom('[data-test-review-action-wrapper]').containsText(
            t('osf-components.reviewActionsList.reviewAction.registrationModeratorAction',
                { action: pastTenseString, moderator: 'Superb Mario', date: dateString }),
            'Review action wrapper shows proper string',
        );
        assert.dom('[data-test-review-action-wrapper]')
            .doesNotContainText('contributor', 'Review action does not mention contributor');
        assert.dom('[data-test-review-action-wrapper]')
            .containsText('moderator', 'Review action explicitly mentions it is created by moderator');
    });

    test('Reject withdraw action', async function(this: ThisTestContext, assert) {
        this.reviewAction.set('actionTrigger', ReviewActionTrigger.RejectWithdrawal);
        const dateString = formattedTimeSince(this.reviewAction.dateModified);
        const pastTenseString = t('registries.reviewActions.triggerPastTense.reject_withdrawal');
        this.set('reviewAction', this.reviewAction);

        await render(hbs`<ReviewActionsList::ReviewAction @reviewAction={{this.reviewAction}}/>`);
        assert.dom('[data-test-review-action-wrapper]').exists('Review action wrapper shown');
        assert.dom('[data-test-review-action-wrapper]').containsText(
            t('osf-components.reviewActionsList.reviewAction.registrationModeratorAction',
                { action: pastTenseString, moderator: 'Superb Mario', date: dateString }),
            'Review action wrapper shows proper string',
        );
        assert.dom('[data-test-review-action-wrapper]')
            .doesNotContainText('contributor', 'Review action does not mention contributor');
        assert.dom('[data-test-review-action-wrapper]')
            .containsText('moderator', 'Review action explicitly mentions it is created by moderator');
    });

    // Registraton Admin actions
    test('Submit action without embargo end date', async function(this: ThisTestContext, assert) {
        this.reviewAction.set('actionTrigger', ReviewActionTrigger.Submit);
        const dateString = formattedTimeSince(this.reviewAction.dateModified);
        this.set('embargoEndDate', null);
        this.set('reviewAction', this.reviewAction);

        await render(hbs`<ReviewActionsList::ReviewAction
            @reviewAction={{this.reviewAction}}
            @embargoEndDate={{this.embargoEndDate}}
        />`);
        assert.dom('[data-test-review-action-wrapper]').exists('Review action wrapper shown');
        assert.dom('[data-test-review-action-wrapper]').hasTextContaining(
            t('osf-components.reviewActionsList.reviewAction.registrationSubmitActionWithoutEmbargo',
                {
                    contributor: 'Superb Mario',
                    date: dateString,
                }),
            'Review action wrapper shows proper string',
        );
        assert.dom('[data-test-review-action-wrapper]')
            .doesNotContainText('moderator', 'Review action does not mention moderator');
        assert.dom('[data-test-review-action-comment]').doesNotExist('No comment to show');
    });

    test('Submit action with embargo end date', async function(this: ThisTestContext, assert) {
        this.reviewAction.set('actionTrigger', ReviewActionTrigger.Submit);
        const dateString = formattedTimeSince(this.reviewAction.dateModified);
        const embargoEndDate = faker.date.future(1, new Date(2099, 0, 0));
        const embargoEndDateString = this.intl.formatDate(embargoEndDate, { locale: this.intl.locale });
        this.set('embargoEndDate', embargoEndDate);
        this.set('reviewAction', this.reviewAction);

        await render(hbs`<ReviewActionsList::ReviewAction
            @reviewAction={{this.reviewAction}}
            @embargoEndDate={{this.embargoEndDate}}
        />`);
        assert.dom('[data-test-review-action-wrapper]').exists('Review action wrapper shown');
        assert.dom('[data-test-review-action-wrapper]').hasTextContaining(
            t('osf-components.reviewActionsList.reviewAction.registrationSubmitActionWithEmbargo',
                {
                    contributor: 'Superb Mario',
                    date: dateString,
                    embargoEndDate: embargoEndDateString,
                }),
            'Review action wrapper shows proper string',
        );
        assert.dom('[data-test-review-action-wrapper]')
            .doesNotContainText('moderator', 'Review action does not mention moderator');
        assert.dom('[data-test-review-action-comment]').doesNotExist('No comment to show');
    });

    test('Request withdraw action', async function(assert) {
        const mirageRegistration = server.create('registration');
        const creator = server.create('user', { fullName: 'Superb Mario' });
        server.create('review-action', {
            target: mirageRegistration,
            creator,
            actionTrigger: ReviewActionTrigger.RequestWithdrawal,
            comment: 'This is a job for Mario &amp; Luigi &gt;_&lt;',
        });
        const registration = await this.store.findRecord('registration', mirageRegistration.id) as RegistrationModel;
        const [action] = await registration.loadAll('reviewActions') as ReviewActionModel[];
        this.set('reviewAction', action);
        const dateString = formattedTimeSince(action.dateModified);
        const pastTenseString = t('registries.reviewActions.triggerPastTense.request_withdrawal');

        await render(hbs`<ReviewActionsList::ReviewAction @reviewAction={{this.reviewAction}}/>`);
        assert.dom('[data-test-review-action-wrapper]').exists('Review action wrapper shown');
        assert.dom('[data-test-review-action-wrapper]').containsText(
            t('osf-components.reviewActionsList.reviewAction.registrationContributorAction',
                { action: pastTenseString, contributor: 'Superb Mario', date: dateString }),
            'Review action wrapper shows proper string',
        );
        assert.dom('[data-test-review-action-wrapper]')
            .doesNotContainText('moderator', 'Review action does not mention moderator');
        assert.dom('[data-test-review-action-comment]')
            .containsText('This is a job for Mario & Luigi >_<', 'Comment shown and characters encoded');
    });

    test('Request embargo termination action', async function(this: ThisTestContext, assert) {
        this.reviewAction.setProperties({
            actionTrigger: ReviewActionTrigger.RequestEmbargoTermination,
            comment: '',
        });
        const dateString = formattedTimeSince(this.reviewAction.dateModified);
        const pastTenseString = t('registries.reviewActions.triggerPastTense.request_embargo_termination');
        this.set('reviewAction', this.reviewAction);

        await render(hbs`<ReviewActionsList::ReviewAction @reviewAction={{this.reviewAction}}/>`);
        assert.dom('[data-test-review-action-wrapper]').exists('Review action wrapper shown');
        assert.dom('[data-test-review-action-wrapper]').containsText(
            t('osf-components.reviewActionsList.reviewAction.registrationContributorAction',
                { action: pastTenseString, contributor: 'Superb Mario', date: dateString }),
            'Review action wrapper shows proper string',
        );
        assert.dom('[data-test-review-action-wrapper]')
            .doesNotContainText('moderator', 'Review action does not mention moderator');
        assert.dom('[data-test-review-action-comment]').doesNotExist('Empty strings do not create comment');
    });

    test('Request embargo termination action', async function(this: ThisTestContext, assert) {
        this.reviewAction.setProperties({
            actionTrigger: ReviewActionTrigger.RequestEmbargoTermination,
            comment: '',
        });
        const dateString = formattedTimeSince(this.reviewAction.dateModified);
        const pastTenseString = t('registries.reviewActions.triggerPastTense.request_embargo_termination');
        this.set('reviewAction', this.reviewAction);

        await render(hbs`<ReviewActionsList::ReviewAction @reviewAction={{this.reviewAction}}/>`);
        assert.dom('[data-test-review-action-wrapper]').exists('Review action wrapper shown');
        assert.dom('[data-test-review-action-wrapper]').containsText(
            t('osf-components.reviewActionsList.reviewAction.registrationContributorAction',
                { action: pastTenseString, contributor: 'Superb Mario', date: dateString }),
            'Review action wrapper shows proper string',
        );
        assert.dom('[data-test-review-action-wrapper]')
            .doesNotContainText('moderator', 'Review action does not mention moderator');
        assert.dom('[data-test-review-action-comment]').doesNotExist('Empty strings do not create comment');
    });

    // Collection Moderator actions
    test('Collection submission: Moderator actions', async function(this: ThisTestContext, assert) {
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
        const dateString = formattedTimeSince(action.dateModified);
        let pastTenseString = t('collections.actions.triggerPastTense.accept');
        this.set('reviewAction', action);

        await render(hbs`<ReviewActionsList::ReviewAction @reviewAction={{this.reviewAction}}/>`);
        assert.dom('[data-test-review-action-wrapper]').exists('Review action wrapper shown');
        assert.dom('[data-test-review-action-wrapper]').containsText(
            t('osf-components.reviewActionsList.reviewAction.collectionModeratorAction',
                { action: pastTenseString, moderator: 'Superb Mario', date: dateString }),
            'Collection submission action wrapper shows accept string',
        );
        assert.dom('[data-test-review-action-comment]').doesNotExist('Empty strings do not create comment');

        action.set('actionTrigger', CollectionSubmissionActionTrigger.Reject);
        await render(hbs`<ReviewActionsList::ReviewAction @reviewAction={{this.reviewAction}}/>`);
        pastTenseString = t('collections.actions.triggerPastTense.reject');
        assert.dom('[data-test-review-action-wrapper]').containsText(
            t('osf-components.reviewActionsList.reviewAction.collectionModeratorAction',
                { action: pastTenseString, moderator: 'Superb Mario', date: dateString }),
            'Collection submission action wrapper shows reject string',
        );

        action.set('actionTrigger', CollectionSubmissionActionTrigger.Remove);
        await render(hbs`<ReviewActionsList::ReviewAction @reviewAction={{this.reviewAction}}/>`);
        pastTenseString = t('collections.actions.triggerPastTense.remove');
        assert.dom('[data-test-review-action-wrapper]').containsText(
            t('osf-components.reviewActionsList.reviewAction.collectionAction',
                { action: pastTenseString, user: 'Superb Mario', date: dateString }),
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
