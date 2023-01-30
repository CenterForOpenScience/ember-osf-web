import { click, render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import { setupMirage } from 'ember-cli-mirage/test-support';
import { setupIntl, t } from 'ember-intl/test-support';
import { TestContext } from 'ember-test-helpers';
import { setupRenderingTest } from 'ember-qunit';

import { RegistrationReviewStates } from 'ember-osf-web/models/registration';
import { RevisionReviewStates } from 'ember-osf-web/models/schema-response';
import { SchemaResponseActionTrigger } from 'ember-osf-web/models/schema-response-action';
import { module, test } from 'qunit';

module('Integration | Component | make-decision-dropdown | revision', hooks => {
    setupRenderingTest(hooks);
    setupIntl(hooks);
    setupMirage(hooks);

    // Registration - Revisions

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
});
