import { currentRouteName } from '@ember/test-helpers';
import { ModelInstance } from 'ember-cli-mirage';
import { setupMirage } from 'ember-cli-mirage/test-support';
import { setupIntl, t, TestContext } from 'ember-intl/test-support';
import { Permission } from 'ember-osf-web/models/osf-model';
import RegistrationProviderModel from 'ember-osf-web/models/registration-provider';
import { click, visit } from 'ember-osf-web/tests/helpers';
import { setupEngineApplicationTest } from 'ember-osf-web/tests/helpers/engines';
import stripHtmlTags from 'ember-osf-web/utils/strip-html-tags';
import { percySnapshot } from 'ember-percy';
import { module, test } from 'qunit';

interface ModeratorModeTestContext extends TestContext {
    provider: ModelInstance<RegistrationProviderModel>;
}

module('Registries | Acceptance | overview.moderator-mode', hooks => {
    setupEngineApplicationTest(hooks, 'registries');
    setupMirage(hooks);
    setupIntl(hooks);

    hooks.beforeEach(function(this: ModeratorModeTestContext) {
        server.loadFixtures('schema-blocks');
        server.loadFixtures('registration-schemas');
        server.create('user', 'loggedIn');
        this.provider = server.create('registration-provider', {
            reviewsWorkflow: 'pre-moderation',
            allowSubmissions: true,
            registrations: [],
        }, 'currentUserIsModerator');
    });

    test('pending -> accepted', async function(this: ModeratorModeTestContext, assert) {
        const registration = server.create('registration', {
            currentUserPermissions: Object.values(Permission),
            registrationSchema: server.schema.registrationSchemas.find('prereg_challenge'),
            provider: this.provider,
            id: 'stayc',
        }, 'isPending', 'withReviewActions');
        await visit(`/${registration.id}?mode=moderator`);
        await click('[data-test-moderation-dropdown-button]');
        assert.dom('[data-test-moderation-dropdown-decision-label]').exists({ count: 2 }, 'Two options are available');
        assert.dom('[data-test-moderation-dropdown-decision-label="accept_submission"]').exists(
            'Option to accept submission exists',
        );
        assert.dom('[data-test-moderation-dropdown-decision-label="accept_submission"]').hasText(
            'Accept submission',
            'Accept submission option has correct text',
        );
        assert.dom('[data-test-moderation-dropdown-decision-label="reject_submission"]').exists(
            'Option to reject submission exists',
        );
        assert.dom('[data-test-moderation-dropdown-decision-label="reject_submission"]').hasText(
            'Reject submission',
            'Reject submission option has correct text',
        );
        await percySnapshot(assert);
        await click('[data-test-moderation-dropdown-decision-checkbox="accept_submission"]');
        await click('[data-test-moderation-dropdown-submit]');
        assert.dom('#toast-container', document as any).hasTextContaining(
            t('registries.makeDecisionDropdown.success'),
            'Toast successful message for submitting decision',
        );
        await click('[data-test-state-button]');
        assert.dom('[data-test-state-description-short]').exists('Short description for the status exists');
        assert.dom('[data-test-state-description-short]').hasText(
            t('registries.overview.accepted.short_description').toString(),
            'The registration is now accepted',
        );
        assert.dom('[data-test-state-description-long]').hasText(
            stripHtmlTags(t('registries.overview.accepted.long_description', { projectUrl: '' })),
            'Long description matches the reviewsState of the registration',
        );
    });

    test('pending -> rejected', async function(this: ModeratorModeTestContext, assert) {
        const registration = server.create('registration', {
            currentUserPermissions: Object.values(Permission),
            registrationSchema: server.schema.registrationSchemas.find('prereg_challenge'),
            provider: this.provider,
            id: 'stayc',
        }, 'isPending', 'withReviewActions');
        await visit(`/${registration.id}?mode=moderator`);
        await click('[data-test-moderation-dropdown-button]');
        await click('[data-test-moderation-dropdown-decision-checkbox="reject_submission"]');
        await click('[data-test-moderation-dropdown-submit]');
        assert.dom('#toast-container', document as any).hasTextContaining(
            t('registries.makeDecisionDropdown.success'),
            'Toast successful message for submitting decision',
        );
        assert.equal(
            currentRouteName(),
            'registries.branded.moderation.submissions',
            'Redirected to the submissions page',
        );
        assert.dom(
            '[data-test-submissions-type="rejected"][data-test-is-selected="true"]',
        ).exists('Rejected tab is selected');
    });
});
