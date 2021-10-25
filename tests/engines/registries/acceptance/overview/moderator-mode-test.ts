import { currentRouteName } from '@ember/test-helpers';
import { ModelInstance } from 'ember-cli-mirage';
import { setupMirage } from 'ember-cli-mirage/test-support';
import { setupIntl, t, TestContext } from 'ember-intl/test-support';
import { Permission } from 'ember-osf-web/models/osf-model';
import { RegistrationReviewStates } from 'ember-osf-web/models/registration';
import RegistrationProviderModel from 'ember-osf-web/models/registration-provider';
import { RevisionReviewStates } from 'ember-osf-web/models/schema-response';
import { click, visit } from 'ember-osf-web/tests/helpers';
import { setupEngineApplicationTest } from 'ember-osf-web/tests/helpers/engines';
import stripHtmlTags from 'ember-osf-web/utils/strip-html-tags';
import { deserializeResponseKey } from 'ember-osf-web/transforms/registration-response-key';
import { percySnapshot } from 'ember-percy';
import moment from 'moment';
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
            revisionState: RevisionReviewStates.RevisionPendingModeration,
            provider: this.provider,
            id: 'stayc',
        }, 'isPending', 'withReviewActions');
        await visit(`/${registration.id}?mode=moderator`);
        assert.dom('[data-test-state-description-short]').exists('Short description for pending status exists');
        assert.dom('[data-test-state-description-short]').hasText(
            t('registries.overview.pending.short_description'),
            'The registration is pending',
        );
        assert.dom('[data-test-state-description-long]').hasText(
            stripHtmlTags(t('registries.overview.pending.long_description')),
            'Long description matches the reviewsState of the registration',
        );
        await click('[data-test-moderation-dropdown-button]');
        assert.dom('[data-test-moderation-dropdown-decision-label]').exists({ count: 2 }, 'Two options are available');
        assert.dom('[data-test-moderation-dropdown-decision-label="accept_submission"]').exists(
            'Option to accept submission exists',
        );
        assert.dom('[data-test-moderation-dropdown-decision-label="accept_submission"]').hasText(
            t('registries.makeDecisionDropdown.acceptSubmission'),
            'Accept submission option has correct text',
        );
        assert.dom('[data-test-moderation-dropdown-decision-label="reject_submission"]').exists(
            'Option to reject submission exists',
        );
        assert.dom('[data-test-moderation-dropdown-decision-label="reject_submission"]').hasText(
            t('registries.makeDecisionDropdown.rejectSubmission'),
            'Reject submission option has correct text',
        );
        await percySnapshot(assert);
        await click('[data-test-moderation-dropdown-decision-checkbox="accept_submission"]');
        await click('[data-test-moderation-dropdown-submit]');
        await click('[data-test-state-button]');
        assert.dom('[data-test-state-description-short]').exists('Short description for accepted status exists');
        assert.dom('[data-test-state-description-short]').hasText(
            t('registries.overview.accepted.short_description'),
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
            revisionState: RevisionReviewStates.RevisionPendingModeration,
            provider: this.provider,
            id: 'stayc',
        }, 'isPending', 'withReviewActions');
        await visit(`/${registration.id}?mode=moderator`);
        await click('[data-test-moderation-dropdown-button]');
        await click('[data-test-moderation-dropdown-decision-checkbox="reject_submission"]');
        await click('[data-test-moderation-dropdown-submit]');
        assert.equal(
            currentRouteName(),
            'registries.branded.moderation.submissions',
            'Redirected to the submissions page',
        );
        assert.dom(
            '[data-test-submissions-type="rejected"][data-test-is-selected="true"]',
        ).exists('Rejected tab is selected');
    });

    test('pending_withdraw_request -> withdrawn', async function(this: ModeratorModeTestContext, assert) {
        const registration = server.create('registration', {
            currentUserPermissions: Object.values(Permission),
            registrationSchema: server.schema.registrationSchemas.find('prereg_challenge'),
            revisionState: RevisionReviewStates.Approved,
            provider: this.provider,
            id: 'stayc',
        }, 'isPendingWithdrawRequest', 'withReviewActions');
        await visit(`/${registration.id}?mode=moderator`);
        assert.dom('[data-test-state-description-short]').exists(
            'Short description for pending_withdraw_request status exists',
        );
        assert.dom('[data-test-state-description-short]').hasText(
            t('registries.overview.pendingWithdrawRequest.short_description'),
            'The registration is pending withdraw request',
        );
        assert.dom('[data-test-state-description-long]').hasText(
            stripHtmlTags(t('registries.overview.pendingWithdrawRequest.long_description')),
            'Long description matches the reviewsState of the registration',
        );
        await click('[data-test-moderation-dropdown-button]');
        assert.dom('[data-test-moderation-dropdown-decision-label]').exists(
            { count: 1 },
            'Only one option is available',
        );
        assert.dom('[data-test-moderation-dropdown-decision-label="force_withdraw"]').exists(
            'Option to force withdraw exists',
        );
        assert.dom('[data-test-moderation-dropdown-decision-label="force_withdraw"]').hasText(
            t('registries.makeDecisionDropdown.forceWithdraw'),
            'Force withdraw option has correct text',
        );
        await percySnapshot(assert);
        await click('[data-test-moderation-dropdown-decision-checkbox="force_withdraw"]');
        await click('[data-test-moderation-dropdown-submit]');
        assert.dom('[data-test-tombstone-title]').exists('Tombstone page shows');
    });

    test('pending_withdraw -> withdrawn', async function(this: ModeratorModeTestContext, assert) {
        const registration = server.create('registration', {
            currentUserPermissions: Object.values(Permission),
            registrationSchema: server.schema.registrationSchemas.find('prereg_challenge'),
            revisionState: RevisionReviewStates.Approved,
            provider: this.provider,
            id: 'stayc',
        }, 'isPendingWithdraw', 'withReviewActions');
        await visit(`/${registration.id}?mode=moderator`);
        assert.dom('[data-test-state-description-short]').exists(
            'Short description for pending_withdraw status exists',
        );
        assert.dom('[data-test-state-description-short]').hasText(
            t('registries.overview.pendingWithdraw.short_description'),
            'The registration is pending withdraw',
        );
        assert.dom('[data-test-state-description-long]').hasText(
            stripHtmlTags(t('registries.overview.pendingWithdraw.long_description')),
            'Long description matches the reviewsState of the registration',
        );
        await click('[data-test-moderation-dropdown-button]');
        assert.dom('[data-test-moderation-dropdown-decision-label]').exists({ count: 2 }, 'Two options are available');
        assert.dom('[data-test-moderation-dropdown-decision-label="accept_withdrawal"]').exists(
            'Option to accept withdraw exists',
        );
        assert.dom('[data-test-moderation-dropdown-decision-label="accept_withdrawal"]').hasText(
            t('registries.makeDecisionDropdown.acceptWithdrawal'),
            'Accept withdrawal option has correct text',
        );
        assert.dom('[data-test-moderation-dropdown-decision-label="reject_withdrawal"]').exists(
            'Option to reject withdraw exists',
        );
        assert.dom('[data-test-moderation-dropdown-decision-label="reject_withdrawal"]').hasText(
            t('registries.makeDecisionDropdown.rejectWithdrawal'),
            'Reject withdrawal option has correct text',
        );
        await percySnapshot(assert);
        await click('[data-test-moderation-dropdown-decision-checkbox="accept_withdrawal"]');
        await click('[data-test-moderation-dropdown-submit]');
        assert.dom('[data-test-tombstone-title]').exists('Tombstone page shows');
    });

    test('pending_withdraw -> accepted', async function(this: ModeratorModeTestContext, assert) {
        const registration = server.create('registration', {
            currentUserPermissions: Object.values(Permission),
            registrationSchema: server.schema.registrationSchemas.find('prereg_challenge'),
            revisionState: RevisionReviewStates.Approved,
            provider: this.provider,
            id: 'stayc',
        }, 'isPendingWithdraw', 'withReviewActions');
        await visit(`/${registration.id}?mode=moderator`);
        await click('[data-test-moderation-dropdown-button]');
        await percySnapshot(assert);
        await click('[data-test-moderation-dropdown-decision-checkbox="reject_withdrawal"]');
        await click('[data-test-moderation-dropdown-submit]');
        await click('[data-test-state-button]');
        assert.dom('[data-test-state-description-short]').exists('Short description for accepted status exists');
        assert.dom('[data-test-state-description-short]').hasText(
            t('registries.overview.accepted.short_description'),
            'The registration is now accepted',
        );
        assert.dom('[data-test-state-description-long]').hasText(
            stripHtmlTags(t('registries.overview.accepted.long_description', { projectUrl: '' })),
            'Long description matches the reviewsState of the registration',
        );
    });

    test('accepted -> withdrawn', async function(this: ModeratorModeTestContext, assert) {
        const registration = server.create('registration', {
            currentUserPermissions: Object.values(Permission),
            registrationSchema: server.schema.registrationSchemas.find('prereg_challenge'),
            revisionState: RevisionReviewStates.Approved,
            provider: this.provider,
            id: 'stayc',
        }, 'isPublic', 'withReviewActions');
        await visit(`/${registration.id}?mode=moderator`);
        await click('[data-test-state-button]');
        assert.dom('[data-test-state-description-short]').exists(
            'Short description for accepted status exists',
        );
        assert.dom('[data-test-state-description-short]').hasText(
            t('registries.overview.accepted.short_description'),
            'The registration is accepted',
        );
        assert.dom('[data-test-state-description-long]').hasText(
            stripHtmlTags(t('registries.overview.accepted.long_description', { projectUrl: '' })),
            'Long description matches the reviewsState of the registration',
        );
        await click('[data-test-moderation-dropdown-button]');
        assert.dom('[data-test-moderation-dropdown-decision-label]').exists(
            { count: 1 },
            'Only one option is available',
        );
        assert.dom('[data-test-moderation-dropdown-decision-label="force_withdraw"]').exists(
            'Option to force withdraw exists',
        );
        assert.dom('[data-test-moderation-dropdown-decision-label="force_withdraw"]').hasText(
            t('registries.makeDecisionDropdown.forceWithdraw'),
            'Force withdraw option has correct text',
        );
        await percySnapshot(assert);
        await click('[data-test-moderation-dropdown-decision-checkbox="force_withdraw"]');
        await click('[data-test-moderation-dropdown-submit]');
        assert.dom('[data-test-tombstone-title]').exists('Tombstone page shows');
    });

    test('embargo -> withdrawn', async function(this: ModeratorModeTestContext, assert) {
        const registration = server.create('registration', {
            currentUserPermissions: Object.values(Permission),
            registrationSchema: server.schema.registrationSchemas.find('prereg_challenge'),
            revisionState: RevisionReviewStates.Approved,
            provider: this.provider,
            id: 'stayc',
        }, 'isEmbargo', 'withReviewActions');
        await visit(`/${registration.id}?mode=moderator`);
        await click('[data-test-state-button]');
        assert.dom('[data-test-state-description-short]').exists(
            'Short description for embargo status exists',
        );
        assert.dom('[data-test-state-description-short]').hasText(
            t('registries.overview.embargo.short_description'),
            'The registration is in embargo',
        );
        assert.dom('[data-test-state-description-long]').hasText(
            stripHtmlTags(
                t('registries.overview.embargo.long_description', {
                    embargoEndDate: moment(registration.embargoEndDate!).format('MMMM D, YYYY'),
                    htmlSafe: true,
                }).toString(),
            ),
        );
        await click('[data-test-moderation-dropdown-button]');
        assert.dom('[data-test-moderation-dropdown-decision-label]').exists(
            { count: 1 },
            'Only one option is available',
        );
        assert.dom('[data-test-moderation-dropdown-decision-label="force_withdraw"]').exists(
            'Option to force withdraw exists',
        );
        assert.dom('[data-test-moderation-dropdown-decision-label="force_withdraw"]').hasText(
            t('registries.makeDecisionDropdown.forceWithdraw'),
            'Force withdraw option has correct text',
        );
        await percySnapshot(assert);
        await click('[data-test-moderation-dropdown-decision-checkbox="force_withdraw"]');
        await click('[data-test-moderation-dropdown-submit]');
        assert.dom('[data-test-tombstone-title]').exists('Tombstone page shows');
    });

    test('pending_embargo_termination -> withdrawn', async function(this: ModeratorModeTestContext, assert) {
        const registration = server.create('registration', {
            currentUserPermissions: Object.values(Permission),
            registrationSchema: server.schema.registrationSchemas.find('prereg_challenge'),
            revisionState: RevisionReviewStates.Approved,
            provider: this.provider,
            id: 'stayc',
        }, 'isPendingEmbargoTermination', 'withReviewActions');
        await visit(`/${registration.id}?mode=moderator`);
        assert.dom('[data-test-state-description-short]').exists(
            'Short description for pending_embargo_termination status exists',
        );
        assert.dom('[data-test-state-description-short]').hasText(
            t('registries.overview.pendingEmbargoTermination.short_description'),
            'The registration is pending embargo termination',
        );
        assert.dom('[data-test-state-description-long]').hasText(
            stripHtmlTags(
                t('registries.overview.pendingEmbargoTermination.long_description', {
                    embargoEndDate: moment(registration.embargoEndDate!).format('MMMM D, YYYY'),
                    htmlSafe: true,
                }).toString(),
            ),
        );
        await click('[data-test-moderation-dropdown-button]');
        assert.dom('[data-test-moderation-dropdown-decision-label]').exists(
            { count: 1 },
            'Only one option is available',
        );
        assert.dom('[data-test-moderation-dropdown-decision-label="force_withdraw"]').exists(
            'Option to force withdraw exists',
        );
        assert.dom('[data-test-moderation-dropdown-decision-label="force_withdraw"]').hasText(
            t('registries.makeDecisionDropdown.forceWithdraw'),
            'Force withdraw option has correct text',
        );
        await percySnapshot(assert);
        await click('[data-test-moderation-dropdown-decision-checkbox="force_withdraw"]');
        await click('[data-test-moderation-dropdown-submit]');
        assert.dom('[data-test-tombstone-title]').exists('Tombstone page shows');
    });

    test('Updates: pending -> accepted', async function(this: ModeratorModeTestContext, assert) {
        const registration = server.create('registration', {
            reviewsState: RegistrationReviewStates.Accepted,
            revisionState: RevisionReviewStates.RevisionPendingModeration,
            registrationSchema: server.schema.registrationSchemas.find('testSchema'),
            provider: this.provider,
            id: 'zip',
            registrationResponses: {
                'page-one_short-text': 'alpaca',
                'page-one_multi-select': ['Crocs'],
            },
        });

        const revision = server.create('schema-response', {
            reviewsState: RevisionReviewStates.RevisionPendingModeration,
            registration,
            id: 'zap',
            revisionResponses: {
                'page-one_short-text': 'llama',
                'page-one_multi-select': ['Crocs'],
            },
        }, 'withSchemaResponseActions');
        await visit(`/${registration.id}?mode=moderator&revisionId=${revision.id}`);
        assert.dom(`[data-test-read-only-response=${deserializeResponseKey('page-one_short-text')}]`).hasText(
            'llama', 'Revised response is shown',
        );
        await click('[data-test-moderation-dropdown-button]');
        assert.dom('[data-test-moderation-dropdown-decision-label]').exists(
            { count: 2 },
            'Two moderator actions available',
        );
        assert.dom('[data-test-moderation-dropdown-decision-label="accept"]').hasText(
            t('registries.makeDecisionDropdown.acceptRevision'),
            'Accept update option has correct text',
        );
        assert.dom('[data-test-moderation-dropdown-decision-label="moderator_reject"]').hasText(
            t('registries.makeDecisionDropdown.rejectRevision'),
            'Reject update option has correct text',
        );
        await percySnapshot(assert);
        await click('[data-test-moderation-dropdown-decision-checkbox="accept"]');
        await click('[data-test-moderation-dropdown-submit]');
        assert.dom(`[data-test-read-only-response=${deserializeResponseKey('page-one_short-text')}]`).hasText(
            'llama', 'Response from the accepted update still shown',
        );
    });

    test('Updates: pending -> rejected', async function(this: ModeratorModeTestContext, assert) {
        const registration = server.create('registration', {
            currentUserPermissions: Object.values(Permission),
            reviewsState: RegistrationReviewStates.Accepted,
            revisionState: RevisionReviewStates.RevisionPendingModeration,
            registrationSchema: server.schema.registrationSchemas.find('testSchema'),
            provider: this.provider,
            id: 'zip',
            registrationResponses: {
                'page-one_short-text': 'Krobus',
                'page-one_multi-select': ['Crocs'],
            },
        });
        const revision = server.create('schema-response', {
            id: 'zap',
            registration,
            reviewsState: RevisionReviewStates.RevisionPendingModeration,
            revisionResponses: {
                'page-one_short-text': 'junimo',
                'page-one_multi-select': ['Crocs'],
            },
        });
        await visit(`/${registration.id}?mode=moderator&revisionId=${revision.id}`);
        assert.dom(`[data-test-read-only-response=${deserializeResponseKey('page-one_short-text')}]`).hasText(
            'junimo', 'Response from the pending update shown',
        );
        await click('[data-test-moderation-dropdown-button]');
        await click('[data-test-moderation-dropdown-decision-checkbox="moderator_reject"]');
        await click('[data-test-moderation-dropdown-submit]');
        assert.dom(`[data-test-read-only-response=${deserializeResponseKey('page-one_short-text')}]`).hasText(
            'Krobus', 'Response from the registration shown',
        );
    });
});
