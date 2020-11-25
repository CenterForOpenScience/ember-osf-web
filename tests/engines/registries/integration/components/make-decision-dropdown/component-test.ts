import { camelize } from '@ember/string';
import { click, render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import { setupMirage } from 'ember-cli-mirage/test-support';
import { setupIntl, t } from 'ember-intl/test-support';
import { TestContext } from 'ember-test-helpers';

import { RegistrationReviewStates } from 'ember-osf-web/models/registration';
import { ReviewActionTrigger } from 'ember-osf-web/models/review-action';
import { setupEngineRenderingTest } from 'ember-osf-web/tests/helpers/engines';
import { module, test } from 'qunit';

module('Registries | Integration | Component | make-decision-dropdown', hooks => {
    setupEngineRenderingTest(hooks, 'registries');
    setupIntl(hooks);
    setupMirage(hooks);

    const testCases: {
        [key in RegistrationReviewStates]: {
            actions: ReviewActionTrigger[],
            commentLabel?: string,
            commentPlaceholder?: string,
        }
    } = {
        [RegistrationReviewStates.Pending]: {
            actions: [ReviewActionTrigger.AcceptSubmission, ReviewActionTrigger.RejectSubmission],
            commentLabel: 'registries.makeDecisionDropdown.additionalComment',
            commentPlaceholder: 'registries.makeDecisionDropdown.additionalCommentPlaceholder',
        },
        [RegistrationReviewStates.PendingWithdraw]: {
            actions: [ReviewActionTrigger.AcceptWithdrawal, ReviewActionTrigger.RejectWithdrawal],
            commentLabel: 'registries.makeDecisionDropdown.additionalComment',
            commentPlaceholder: 'registries.makeDecisionDropdown.additionalCommentPlaceholder',
        },
        [RegistrationReviewStates.Accepted]: {
            actions: [ReviewActionTrigger.ForceWithdraw],
            commentLabel: 'registries.makeDecisionDropdown.justificationForWithdrawal',
            commentPlaceholder: 'registries.makeDecisionDropdown.justificationForWithdrawalPlaceholder',
        },
        [RegistrationReviewStates.Embargo]: {
            actions: [ReviewActionTrigger.ForceWithdraw],
            commentLabel: 'registries.makeDecisionDropdown.justificationForWithdrawal',
            commentPlaceholder: 'registries.makeDecisionDropdown.justificationForWithdrawalPlaceholder',
        },
        [RegistrationReviewStates.PendingWithdrawRequest]: {
            actions: [ReviewActionTrigger.ForceWithdraw],
            commentLabel: 'registries.makeDecisionDropdown.justificationForWithdrawal',
            commentPlaceholder: 'registries.makeDecisionDropdown.justificationForWithdrawalPlaceholder',
        },
        [RegistrationReviewStates.PendingEmbargoTermination]: {
            actions: [ReviewActionTrigger.ForceWithdraw],
            commentLabel: 'registries.makeDecisionDropdown.justificationForWithdrawal',
            commentPlaceholder: 'registries.makeDecisionDropdown.justificationForWithdrawalPlaceholder',
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

    for (const reviewsState of (Object.keys(testCases) as RegistrationReviewStates[])) {
        test(`shows the right actions based on state: ${reviewsState}`, async function(this: TestContext, assert) {
            const registration = server.create('registration', {
                provider: server.create('registration-provider', 'currentUserIsModerator'),
                reviewsState,
            }, 'withReviewActions');

            this.set('registration', registration);

            await render(hbs`<MakeDecisionDropdown @registration={{this.registration}} />`);
            await click('[data-test-moderation-dropdown-button]');

            testCases[reviewsState].actions.forEach(actionTrigger => {
                assert.dom(`[data-test-moderation-dropdown-decision-checkbox=${actionTrigger}]`)
                    .isVisible(`'${actionTrigger}' checkbox option is visible`);
                assert.dom(`[data-test-moderation-dropdown-decision-checkbox=${actionTrigger}]`)
                    .isNotChecked(`'${actionTrigger}' checkbox option is not checked by default`);
                assert.dom('[data-test-moderation-action-text]').hasAnyText();
                assert.dom(`[data-test-moderation-action-text=${actionTrigger}`).hasText(
                    t(`registries.makeDecisionDropdown.${camelize(actionTrigger)}`),
                    'has the right action trigger text',
                );
            });

            if (testCases[reviewsState].actions.length) {
                assert.dom('[data-test-moderation-dropdown-action-label]')
                    .hasText(`${t(testCases[reviewsState].commentLabel!)}`, 'Comment label has the right text');
                assert.dom('[data-test-moderation-dropdown-comment]')
                    .hasAttribute('placeholder', `${t(testCases[reviewsState].commentPlaceholder!)}`,
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
