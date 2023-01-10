import { click, render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import { t, TestContext } from 'ember-intl/test-support';
import { setupEngineRenderingTest } from 'ember-osf-web/tests/helpers/engines';
import { module, test } from 'qunit';

module('Integration | Component | collection-submission-confirmation-modal', hooks => {
    setupEngineRenderingTest(hooks, 'collections');
    let externalSaveClicked = false;
    let externalCancelClicked = false;
    let externalResubmitClicked = false;

    hooks.beforeEach(async function(this: TestContext) {
        externalSaveClicked = false;
        externalCancelClicked = false;
        externalResubmitClicked = false;

        this.set('externalResubmitAction', () => {
            externalResubmitClicked = true;
        });
        this.set('externalSaveAction', () => {
            externalSaveClicked = true;
        });
        this.set('externalCancelAction', () => {
            externalCancelClicked = true;
        });
    });

    test('it renders', async function(this: TestContext, assert) {
        await render(
            hbs`<CollectionsSubmission::CollectionSubmissionConfirmationModal
                @resubmitToCollection={{ this.externalResubmitAction }}
                @openModal=true
                @addToCollection={{ this.externalSaveAction}}
                @cancel={{ this.externalCancelAction }}
            />`,
        );
        assert.dom('[data-test-collection-submission-confirmation-modal-header]')
            .hasText('a', 'The modal header is wrong');

        assert.dom('[data-test-collection-submission-confirmation-modal-body]').hasText(
            t('collections.collection_submission_confirmation_modal.body').toString(),
        );
        assert.dom('[data-test-collection-submission-confirmation-modal-body]').doesNotHaveTextContaining(
            t('collections.collection_submission_confirmation_modal.body_moderated'),
        );

        assert.dom('[data-test-collection-submission-confirmation-modal-cancel-button]').hasText(
            t('general.cancel').toString(),
        );
        assert.dom('[data-test-collection-submission-confirmation-modal-add-button]').hasText(
            t('collections.collection_submission_confirmation_modal.add_button').toString(),
        );

        assert.dom('[data-test-collection-submission-confirmation-modal-resubmit]')
            .doesNotExist('The resubmit text is visible');
        assert.dom('[data-test-collection-submission-confirmation-modal-reason]')
            .doesNotExist('The collection submission confirmation modal reason does exists.');
    });

    test('it renders for moderated', async function(assert) {
        await render(
            hbs`<CollectionsSubmission::CollectionSubmissionConfirmationModal
                @collectionIsModerated=true
                @resubmitToCollection={{ this.externalResubmitAction }}
                @openModal=true
                @addToCollection={{ this.externalSaveAction}}
                @cancel={{ this.externalCancelAction }}
            />`,
        );
        assert.dom('[data-test-collection-submission-confirmation-modal-body]').containsText(
            t('collections.collection_submission_confirmation_modal.body'),
        );
        assert.dom('[data-test-collection-submission-confirmation-modal-moderated-body]').containsText(
            t('collections.collection_submission_confirmation_modal.body_moderated'),
        );
    });

    test('Add to collection button calls addToCollection action', async function(assert) {
        await render(
            hbs`<CollectionsSubmission::CollectionSubmissionConfirmationModal
                @openModal=true
                showResubmitModal=false
                @resubmitToCollection={{ this.externalResubmitAction }}
                @addToCollection={{ this.externalSaveAction}}
                @cancel={{ this.externalCancelAction }}
            />`,
        );
        assert.dom('[data-test-collection-submission-confirmation-modal-add-button]')
            .hasText('Add to collection', 'The to collection button is wrong');
        await click('[ data-test-collection-submission-confirmation-modal-add-button]');
        assert.true(externalSaveClicked);

    });

    test('Cancel button calls cancel action', async function(assert) {
        await render(
            hbs`<CollectionsSubmission::CollectionSubmissionConfirmationModal
                @openModal=true
                @resubmitToCollection={{ this.externalResubmitAction }}
                @addToCollection={{ this.externalSaveAction}}
                @cancel={{ this.externalCancelAction}}
            />`,
        );
        assert.dom('[data-test-collection-submission-confirmation-modal-cancel-button]')
            .hasText('Cancel', 'The cancel button is wrong');
        await click('[data-test-collection-submission-confirmation-modal-cancel-button]');
        assert.true(externalCancelClicked);
    });

    test('Resubmit workflow', async function(assert) {
        await render(
            hbs`<CollectionsSubmission::CollectionSubmissionConfirmationModal
                @resubmitToCollection={{ this.externalResubmitAction }}
                @openModal=true
                @addToCollection={{ this.externalSaveAction}}
                @showResubmitModal=true
                @cancel={{ this.externalCancelAction }}
            />`,
        );
        assert.dom('[data-test-collection-submission-confirmation-modal-resubmit]').hasText(
            'This project was removed or rejected from this collection. Do you want to resubmit it?',
            'The text is valid',
        );
        assert.dom('[data-test-collection-submission-confirmation-modal-reason]')
            .exists('The collection submission confirmation modal reason does not exist.');
        assert.dom('[data-test-collection-submission-confirmation-modal-body]').doesNotExist();
        assert.dom('[data-test-collection-submission-confirmation-modal-add-button]').doesNotExist();

        assert.dom('[data-test-collection-submission-confirmation-modal-resubmit-button]')
            .hasText('Resubmit', 'The resubmit button is wrong');

        await click('[data-test-collection-submission-confirmation-modal-resubmit-button]');
        assert.true(externalResubmitClicked);
    });
});
