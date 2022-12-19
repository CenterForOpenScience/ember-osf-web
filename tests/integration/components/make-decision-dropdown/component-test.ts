import { camelize } from '@ember/string';
import { click, render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import { setupMirage } from 'ember-cli-mirage/test-support';
import { setupIntl, t } from 'ember-intl/test-support';
import { TestContext } from 'ember-test-helpers';
import { setupRenderingTest } from 'ember-qunit';

import { CollectionSubmissionReviewStates } from 'ember-osf-web/models/collection-submission';
import { CollectionSubmissionActionTrigger } from 'ember-osf-web/models/collection-submission-action';
import { RegistrationReviewStates } from 'ember-osf-web/models/registration';
import { ReviewActionTrigger } from 'ember-osf-web/models/review-action';
import { RevisionReviewStates } from 'ember-osf-web/models/schema-response';
import { SchemaResponseActionTrigger } from 'ember-osf-web/models/schema-response-action';
import { module, test } from 'qunit';
import { Permission } from 'ember-osf-web/models/osf-model';

module('Integration | Component | make-decision-dropdown', hooks => {
    setupRenderingTest(hooks);
    setupIntl(hooks);
    setupMirage(hooks);

    const registrationTestCases: {
        [key in RegistrationReviewStates]: {
            actions: ReviewActionTrigger[],
            commentLabel?: string,
            commentPlaceholder?: string,
        }
    } = {
        [RegistrationReviewStates.Pending]: {
            actions: [ReviewActionTrigger.AcceptSubmission, ReviewActionTrigger.RejectSubmission],
            commentLabel: 'osf-components.makeDecisionDropdown.additionalComment',
            commentPlaceholder: 'osf-components.makeDecisionDropdown.additionalCommentPlaceholder',
        },
        [RegistrationReviewStates.PendingWithdraw]: {
            actions: [ReviewActionTrigger.AcceptWithdrawal, ReviewActionTrigger.RejectWithdrawal],
            commentLabel: 'osf-components.makeDecisionDropdown.additionalComment',
            commentPlaceholder: 'osf-components.makeDecisionDropdown.additionalCommentPlaceholder',
        },
        [RegistrationReviewStates.Accepted]: {
            actions: [ReviewActionTrigger.ForceWithdraw],
            commentLabel: 'osf-components.makeDecisionDropdown.justificationForWithdrawal',
            commentPlaceholder: 'osf-components.makeDecisionDropdown.justificationForWithdrawalPlaceholder',
        },
        [RegistrationReviewStates.Embargo]: {
            actions: [ReviewActionTrigger.ForceWithdraw],
            commentLabel: 'osf-components.makeDecisionDropdown.justificationForWithdrawal',
            commentPlaceholder: 'osf-components.makeDecisionDropdown.justificationForWithdrawalPlaceholder',
        },
        [RegistrationReviewStates.PendingWithdrawRequest]: {
            actions: [ReviewActionTrigger.ForceWithdraw],
            commentLabel: 'osf-components.makeDecisionDropdown.justificationForWithdrawal',
            commentPlaceholder: 'osf-components.makeDecisionDropdown.justificationForWithdrawalPlaceholder',
        },
        [RegistrationReviewStates.PendingEmbargoTermination]: {
            actions: [ReviewActionTrigger.ForceWithdraw],
            commentLabel: 'osf-components.makeDecisionDropdown.justificationForWithdrawal',
            commentPlaceholder: 'osf-components.makeDecisionDropdown.justificationForWithdrawalPlaceholder',
        },
        [RegistrationReviewStates.Rejected]: {
            actions: [],
        },
        [RegistrationReviewStates.Initial]: {
            actions: [],
        },
        [RegistrationReviewStates.Withdrawn]: {
            actions: [],
        },
    };

    const collectionSubmissionTestCases: {
        [key in CollectionSubmissionReviewStates]: {
            actions: CollectionSubmissionActionTrigger[],
            commentLabel?: string,
            commentPlaceholder?: string,
        }
    } = {
        [CollectionSubmissionReviewStates.Pending]: {
            actions: [CollectionSubmissionActionTrigger.Accept, CollectionSubmissionActionTrigger.Reject],
            commentLabel: 'osf-components.makeDecisionDropdown.additionalComment',
            commentPlaceholder: 'osf-components.makeDecisionDropdown.additionalCommentPlaceholder',
        },
        [CollectionSubmissionReviewStates.Accepted]: {
            actions: [CollectionSubmissionActionTrigger.Remove],
            commentLabel: 'osf-components.makeDecisionDropdown.justificationForRemoval',
            commentPlaceholder: 'osf-components.makeDecisionDropdown.justificationForRemovalPlaceholder',
        },
        [CollectionSubmissionReviewStates.InProgress]: {
            actions: [],
        },
        [CollectionSubmissionReviewStates.Rejected]: {
            actions: [],
        },
        [CollectionSubmissionReviewStates.Removed]: {
            actions: [],
        },
    };

    for (const reviewsState of (Object.keys(registrationTestCases) as RegistrationReviewStates[])) {
        test(`shows actions for registration state: ${reviewsState}`, async function(this: TestContext, assert) {
            const testCase = registrationTestCases[reviewsState];
            const mirageRegistration = server.create('registration', {
                provider: server.create('registration-provider', 'currentUserIsModerator'),
                reviewsState,
            }, 'withReviewActions');
            const store = this.owner.lookup('service:store');
            const registration = await store.findRecord('registration', mirageRegistration.id);
            this.set('registration', registration);

            await render(hbs`<MakeDecisionDropdown @registration={{this.registration}} />`);
            await click('[data-test-moderation-dropdown-button]');

            testCase.actions.forEach(actionTrigger => {
                assert.dom(`[data-test-moderation-dropdown-decision-checkbox=${actionTrigger}]`)
                    .isVisible(`'${actionTrigger}' checkbox option is visible`);
                assert.dom(`[data-test-moderation-dropdown-decision-checkbox=${actionTrigger}]`)
                    .isNotChecked(`'${actionTrigger}' checkbox option is not checked by default`);
                assert.dom('[data-test-moderation-dropdown-decision-label]').hasAnyText();
                assert.dom(`[data-test-moderation-dropdown-decision-label=${actionTrigger}]`).hasText(
                    t(`osf-components.makeDecisionDropdown.${camelize(actionTrigger)}`),
                    'has the right action trigger text',
                );
            });

            if (testCase.actions.length) {
                assert.dom('[data-test-moderation-dropdown-action-label]')
                    .hasText(`${t(testCase.commentLabel!, { targetType: 'registration' })}`,
                        'Comment label has the right text');
                assert.dom('[data-test-moderation-dropdown-comment]')
                    .hasAttribute('placeholder', `${t(testCase.commentPlaceholder!, { targetType: 'registration' })}`,
                        'Comment placeholder has the right text');
                assert.dom('[data-test-moderation-dropdown-submit]')
                    .isDisabled('Submit button is disabled by default');
            } else {
                assert.dom('[data-test-moderation-dropdown-comment]')
                    .doesNotExist('No actions in non-actionable states');
                assert.dom('[data-test-moderation-dropdown-action-label]')
                    .doesNotExist('No comment label in non-actionable states');
                assert.dom('[data-test-moderation-dropdown-submit]')
                    .doesNotExist('No submit button in non-actionable states');
                assert.dom('[data-test-no-moderator-actions]')
                    .isVisible('No moderator action text in non-actionable states');
            }
        });
    }

    test('shows actions for pending revision', async function(this: TestContext, assert) {
        const mirageRegistration = server.create('registration', {
            provider: server.create('registration-provider', 'currentUserIsModerator'),
            reviewsState: RegistrationReviewStates.Accepted,
            revisionState: RevisionReviewStates.RevisionPendingModeration,
        }, 'withReviewActions');
        const store = this.owner.lookup('service:store');
        const registration = await store.findRecord('registration', mirageRegistration.id);
        this.set('registration', registration);

        await render(hbs`<MakeDecisionDropdown @registration={{this.registration}} />`);
        await click('[data-test-moderation-dropdown-button]');

        [SchemaResponseActionTrigger.AcceptRevision,
            SchemaResponseActionTrigger.RejectRevision].forEach(actionTrigger => {
            assert.dom(`[data-test-moderation-dropdown-decision-checkbox=${actionTrigger}]`)
                .isVisible(`'${actionTrigger}' checkbox option is visible`);
            assert.dom(`[data-test-moderation-dropdown-decision-checkbox=${actionTrigger}]`)
                .isNotChecked(`'${actionTrigger}' checkbox option is not checked by default`);
            assert.dom('[data-test-moderation-dropdown-decision-label]').hasAnyText();
            const expectedLabel = actionTrigger === SchemaResponseActionTrigger.AcceptRevision ?
                'acceptRevision' : 'rejectRevision';
            assert.dom(`[data-test-moderation-dropdown-decision-label=${actionTrigger}]`).hasText(
                t(`osf-components.makeDecisionDropdown.${expectedLabel}`),
                'has the right action trigger text',
            );
        });

        assert.dom('[data-test-moderation-dropdown-action-label]')
            .hasText(t('osf-components.makeDecisionDropdown.additionalComment'),
                'Comment label has the right text');
        assert.dom('[data-test-moderation-dropdown-comment]').hasAttribute('placeholder',
            t('osf-components.makeDecisionDropdown.additionalCommentPlaceholder', { targetType: 'registration' }),
            'Comment placeholder has the right text');
        assert.dom('[data-test-moderation-dropdown-submit]')
            .isDisabled('Submit button is disabled by default');
    });

    for (const reviewsState of (Object.keys(collectionSubmissionTestCases) as CollectionSubmissionReviewStates[])) {
        test(`shows actions for collection submission state: ${reviewsState}`,
            async function(this: TestContext, assert) {
                server.loadFixtures('licenses');
                const currentUser = server.create('user', 'loggedIn');
                const licensesAcceptable = server.schema.licenses.all().models;
                const testCase = collectionSubmissionTestCases[reviewsState];
                const provider = server.create('collection-provider', 'currentUserIsModerator');
                const mirageCollection = server.create('collection', {
                    provider,
                });
                const guid = server.create('node', {
                    license: licensesAcceptable[0],
                    currentUserPermissions: [Permission.Admin],
                }, 'withContributors');
                server.create('contributor', {
                    node: guid,
                    users: currentUser,
                    index: 0,
                });
                server.create('moderator', { provider });
                const mirageSubmission = server.create('collection-submission', {
                    id: guid.id,
                    creator: currentUser,
                    collection: mirageCollection,
                    guid,
                    reviewsState,
                });
                const submissionId = mirageSubmission.id + '-' + mirageSubmission.id;
                const store = this.owner.lookup('service:store');
                const collectionSubmission = await store.findRecord('collection-submission', submissionId);
                this.set('collectionSubmission', collectionSubmission);

                await render(hbs`<MakeDecisionDropdown @collectionSubmission={{this.collectionSubmission}} />`);
                await click('[data-test-moderation-dropdown-button]');

                testCase.actions.forEach(actionTrigger => {
                    assert.dom(`[data-test-moderation-dropdown-decision-checkbox=${actionTrigger}]`)
                        .isVisible(`'${actionTrigger}' checkbox option is visible`);
                    assert.dom(`[data-test-moderation-dropdown-decision-checkbox=${actionTrigger}]`)
                        .isNotChecked(`'${actionTrigger}' checkbox option is not checked by default`);
                    assert.dom('[data-test-moderation-dropdown-decision-label]').hasAnyText();
                    const expectedLabel = actionTrigger === CollectionSubmissionActionTrigger.Remove ?
                        'removeCollectionSubmission' : actionTrigger + 'CollectionSubmission';
                    assert.dom(`[data-test-moderation-dropdown-decision-label=${actionTrigger}]`).hasText(
                        t(`osf-components.makeDecisionDropdown.${expectedLabel}`),
                        'has the right action trigger text',
                    );
                });

                if (testCase.actions.length) {
                    assert.dom('[data-test-moderation-dropdown-action-label]')
                        .hasText(`${t(testCase.commentLabel!)}`,
                            'Comment label has the right text');
                    assert.dom('[data-test-moderation-dropdown-comment]')
                        .hasAttribute('placeholder', t(testCase.commentPlaceholder!,
                            { targetType: t('osf-components.makeDecisionDropdown.project') }),
                        'Comment placeholder has the right text');
                    assert.dom('[data-test-moderation-dropdown-submit]')
                        .isDisabled('Submit button is disabled by default');
                } else {
                    assert.dom('[data-test-moderation-dropdown-comment]')
                        .doesNotExist('No actions in non-actionable states');
                    assert.dom('[data-test-moderation-dropdown-action-label]')
                        .doesNotExist('No comment label in non-actionable states');
                    assert.dom('[data-test-moderation-dropdown-submit]')
                        .doesNotExist('No submit button in non-actionable states');
                    assert.dom('[data-test-no-moderator-actions]')
                        .isVisible('No moderator action text in non-actionable states');
                }
            });
    }
});
