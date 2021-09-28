import { currentRouteName } from '@ember/test-helpers';
import { setupMirage } from 'ember-cli-mirage/test-support';
import { percySnapshot } from 'ember-percy';
import { module, test } from 'qunit';

import { SubscriptionFrequency } from 'ember-osf-web/models/subscription';
import { click, visit } from 'ember-osf-web/tests/helpers';
import { setupEngineApplicationTest } from 'ember-osf-web/tests/helpers/engines';
import { triggerEvent, settled } from '@ember/test-helpers';
import { t } from 'ember-intl/test-support';
import stripHtmlTags from 'ember-osf-web/utils/strip-html-tags';

module('Registries | Acceptance | branded.moderation | settings', hooks => {
    setupEngineApplicationTest(hooks, 'registries');
    setupMirage(hooks);

    hooks.beforeEach(() => {
        server.create('registration-provider', { id: 'mdr8n' });
        server.create('subscription', {
            id: 'mdr8n_new_pending_submissions',
            eventName: 'new_pending_submissions',
            frequency: SubscriptionFrequency.Instant,
        });
        server.create('subscription', {
            id: 'mdr8n_new_pending_withdraw_requests',
            eventName: 'new_pending_withdraw_requests',
            frequency: SubscriptionFrequency.Instant,
        });
        server.create('subscription', {
            id: 'cat_photo_repository_subscription',
            eventName: 'cat_photo_repository_subscription',
            frequency: SubscriptionFrequency.Daily,
        });
    });

    test('logged out users are rerouted', async assert => {
        await visit('/registries/mdr8n/moderation/settings');
        assert.equal(currentRouteName(), 'registries.page-not-found', 'Non-moderators are rerouted');
    });

    test('logged in, non-moderators are rerouted', async assert => {
        server.create('user', 'loggedIn');
        await visit('/registries/mdr8n/moderation/settings');
        assert.equal(currentRouteName(), 'registries.page-not-found', 'Non-moderators are rerouted');
    });

    test('notifications list shows for moderators, but not bulk upload widget', async assert => {
        const regProvider = server.schema.registrationProviders.find('mdr8n');
        const currentUser = server.create('user', 'loggedIn');
        server.create('moderator', { id: currentUser.id, user: currentUser, provider: regProvider }, 'asModerator');
        regProvider.update({ permissions: ['view_submissions'] });
        await visit('/registries/mdr8n/moderation/settings');
        await percySnapshot('moderation settings page for moderators');
        assert.equal(currentRouteName(), 'registries.branded.moderation.settings',
            'On the settings page of registries reviews');
        assert.dom('[data-test-subscription-list]').exists('Subscription list shown');
        assert.dom('[data-test-subscription-list-row="mdr8n_new_pending_submissions"]')
            .exists('Pending submissions notification shown');
        assert.dom('[data-test-subscription-list-row="mdr8n_new_pending_withdraw_requests"]')
            .exists('Pending withdraw requests notification shown');
        assert.dom('[data-test-subscription-list-row="cat_photo_repository_subscription"]')
            .doesNotExist('Other subscriptions are not shown');
        assert.dom('[data-test-subscription-list-row="mdr8n_new_pending_withdraw_requests"] [data-test-power-select]')
            .hasText('Instant', 'Subscription frequency is shown correctly');
        assert.dom('[data-test-bulk-upload-widget]').doesNotExist();
    });

    test('notifications list and bulk upload widget shows for admins', async assert => {
        const regProvider = server.schema.registrationProviders.find('mdr8n');
        const currentUser = server.create('user', 'loggedIn');
        server.create('moderator', { id: currentUser.id, user: currentUser, provider: regProvider }, 'asModerator');
        regProvider.update({ permissions: ['view_submissions', 'add_moderator'] });
        await visit('/registries/mdr8n/moderation/settings');
        await percySnapshot('moderation settings page for admins');
        assert.equal(currentRouteName(), 'registries.branded.moderation.settings',
            'On the settings page of registries reviews');
        assert.dom('[data-test-subscription-list]').exists('Subscription list shown');
        assert.dom('[data-test-subscription-list-row="mdr8n_new_pending_submissions"]')
            .exists('Pending submissions notification shown');
        assert.dom('[data-test-subscription-list-row="mdr8n_new_pending_withdraw_requests"]')
            .exists('Pending withdraw requests notification shown');
        assert.dom('[data-test-subscription-list-row="cat_photo_repository_subscription"]')
            .doesNotExist('Other subscriptions are not shown');
        assert.dom('[data-test-subscription-list-row="mdr8n_new_pending_withdraw_requests"] [data-test-power-select]')
            .hasText('Instant', 'Subscription frequency is shown correctly');
        assert.dom('[data-test-bulk-upload-widget]').exists();
    });

    test('test bulk upload widget', async assert => {
        const filename = 'itzy.csv';
        const triggerFileUpload = () => triggerEvent(
            '[data-test-bulk-upload-widget]',
            'drop',
            {
                dataTransfer: {
                    files: [new File(['Loco!'], filename)],
                },
            },
        );
        const regProvider = server.schema.registrationProviders.find('mdr8n');
        const currentUser = server.create('user', 'loggedIn');
        server.create('moderator', { id: currentUser.id, user: currentUser, provider: regProvider }, 'asModerator');
        regProvider.update({ permissions: ['view_submissions', 'add_moderator'] });
        await visit('/registries/mdr8n/moderation/settings');
        assert.dom('[data-test-bulk-upload-widget]').exists();
        server.namespace = '/_';

        // upload successful
        server.put(`/registries/mdr8n/bulk_create/${filename}`, () => ({}), 204);
        await triggerFileUpload();
        await settled();
        assert.dom('#toast-container', document as unknown as Element).hasTextContaining(
            t('registries.moderation.settings.uploadSuccess'),
            'Toast message shows and contains success msg',
        );

        // invalid schema id
        server.put(`/registries/mdr8n/bulk_create/${filename}`, () => ({
            errors: [{ type: 'invalidSchemaId'}],
        }), 400);
        await triggerFileUpload();
        await settled();
        assert.dom('[data-test-error-modal-heading]').hasText(t('registries.moderation.settings.uploadError'));
        assert.dom('[data-test-error-modal-general-message]').
            hasText(stripHtmlTags(t('registries.moderation.settings.generalErrorMessage')));
        assert.dom('[data-test-error-modal-message-title]').exists({ count: 1 });
        assert.dom('[data-test-error-modal-message-title]')
            .hasText(t('registries.moderation.settings.invalidSchemaId.title'));
        assert.dom('[data-test-error-modal-message-detail]').exists({ count: 1 });
        assert.dom('[data-test-error-modal-message-detail]')
            .hasText(t('registries.moderation.settings.invalidSchemaId.detail'));
        await click('[data-test-close-dialog]');

        // invalid column id
        const invalidHeaders = ['q1', 'q2'];
        const missingHeaders = ['q3', 'q4'];
        server.put(`/registries/mdr8n/bulk_create/${filename}`, () => ({
            errors: [{ type: 'invalidColumnId', invalidHeaders, missingHeaders }],
        }), 400);
        await triggerFileUpload();
        await settled();
        assert.dom('[data-test-error-modal-message-title]').exists({ count: 1 });
        assert.dom('[data-test-error-modal-message-title]')
            .hasText(t('registries.moderation.settings.invalidColumnId.title'));
        assert.dom('[data-test-error-modal-message-detail]').exists({ count: 1 });
        assert.dom('[data-test-error-modal-message-detail]')
            .hasText(stripHtmlTags(t(
                'registries.moderation.settings.invalidColumnId.detail',
                {
                    invalidIds: invalidHeaders.join(', '),
                    missingIds: missingHeaders.join(', '),
                },
            )));
        await click('[data-test-close-dialog]');

        // size exceeds limit
        server.put(`/registries/mdr8n/bulk_create/${filename}`, () => ({
            errors: [{ type: 'sizeExceedsLimit'}],
        }), 400);
        await triggerFileUpload();
        await settled();
        assert.dom('[data-test-error-modal-message-title]').exists({ count: 1 });
        assert.dom('[data-test-error-modal-message-title]')
            .hasText(t('registries.moderation.settings.sizeExceedsLimit.title'));
        assert.dom('[data-test-error-modal-message-detail]').exists({ count: 1 });
        assert.dom('[data-test-error-modal-message-detail]')
            .hasText(stripHtmlTags(t('registries.moderation.settings.sizeExceedsLimit.detail')));
        await click('[data-test-close-dialog]');

        // bulk upload job exists
        server.put(`/registries/mdr8n/bulk_create/${filename}`, () => ({
            errors: [{ type: 'bulkUploadJobExists'}],
        }), 400);
        await triggerFileUpload();
        await settled();
        assert.dom('[data-test-error-modal-message-title]').exists({ count: 1 });
        assert.dom('[data-test-error-modal-message-title]')
            .hasText(t('registries.moderation.settings.bulkUploadJobExists.title'));
        assert.dom('[data-test-error-modal-message-detail]').exists({ count: 1 });
        assert.dom('[data-test-error-modal-message-detail]')
            .hasText(t('registries.moderation.settings.bulkUploadJobExists.detail'));
        await click('[data-test-close-dialog]');

        // invalid file type
        server.put(`/registries/mdr8n/bulk_create/${filename}`, () => ({
            errors: [{ type: 'invalidFileType'}],
        }), 400);
        await triggerFileUpload();
        await settled();
        assert.dom('[data-test-error-modal-message-title]').exists({ count: 1 });
        assert.dom('[data-test-error-modal-message-title]')
            .hasText(t('registries.moderation.settings.invalidFileType.title'));
        assert.dom('[data-test-error-modal-message-detail]').exists({ count: 1 });
        assert.dom('[data-test-error-modal-message-detail]')
            .hasText(stripHtmlTags(t('registries.moderation.settings.invalidFileType.detail')));
        await click('[data-test-close-dialog]');

        // invalid cells
        const errors = [
            { type: 'invalidProjectId', row_index: 52, column_index: 'B' },
            { type: 'invalidInstitutionName', row_index: 52, column_index: 'B' },
            { type: 'invalidLicenseName', row_index: 52, column_index: 'B' },
            { type: 'invalidSubjectName', row_index: 52, column_index: 'B' },
            { type: 'invalidCategoryName', row_index: 52, column_index: 'B' },
            { type: 'invalidResponse', row_index: 52, column_index: 'B' },
            { type: 'invalidContributors', row_index: 52, column_index: 'B' },
        ];
        server.put(`/registries/mdr8n/bulk_create/${filename}`, () => ({
            errors,
        }), 400);
        await triggerFileUpload();
        await settled();
        assert.dom('[data-test-error-modal-cell-identifier]').exists({ count: 7 });
        const cellIdElements = document.querySelectorAll('[data-test-error-modal-cell-identifier]');
        cellIdElements.forEach(element => assert.equal(element.textContent, 'Cell B52'));
        assert.dom('[data-test-error-modal-message-title]').exists({ count: 7 });
        const msgTitleElements = document.querySelectorAll('[data-test-error-modal-message-title]');
        msgTitleElements.forEach((element, index) => assert.equal(
            element.textContent, t(`registries.moderation.settings.${errors[index].type}.title`),
        ));
        assert.dom('[data-test-error-modal-message-detail]').exists({ count: 7 });
        const msgDetailElements = document.querySelectorAll('[data-test-error-modal-message-detail]');
        msgDetailElements.forEach((element, index) => assert.equal(
            element.textContent, stripHtmlTags(t(`registries.moderation.settings.${errors[index].type}.detail`)),
        ));
        await click('[data-test-copy-to-clipboard]');
        await settled();
        assert.dom('#toast-container', document as unknown as Element).hasTextContaining(
            t('registries.moderation.settings.copyToClipboardSuccess'),
            'Toast message shows and contains success msg',
        );
    });
});
