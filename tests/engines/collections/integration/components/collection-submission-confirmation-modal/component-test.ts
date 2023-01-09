import { click, render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import { t, TestContext } from 'ember-intl/test-support';
import { setupEngineRenderingTest } from 'ember-osf-web/tests/helpers/engines';
import { module, test } from 'qunit';

module('Integration | Component | collection-submission-confirmation-modal', hooks => {
    setupEngineRenderingTest(hooks, 'collections');

    hooks.beforeEach(async function(this: TestContext) {
        this.set('noop', () => {/* noop */});
        this.set('noop2', () => {/* noop */});
        this.set('noop3', () => {/* noop */});
    });

    test('it renders', async function(this: TestContext, assert) {
        await render(
            hbs`<CollectionsSubmission::CollectionSubmissionConfirmationModal
                @resubmitToCollection={{ action (action this.noop)}}
                @openModal=true
                @addToCollection={{ action this.noop2}}
                @cancel={{ action this.noop3}}
            />`,
        );
        assert.dom('[data-test-collection-submission-confirmation-modal-header]').hasText(
            t('collections.collection_submission_confirmation_modal.header').toString(),
        );
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
        this.set('noop', () => { /* noop */ });
        await render(hbs`
        {{collection-submission-confirmation-modal
            collectionIsModerated=true
            resubmitToCollection=(action this.noop)
            openModal=true addToCollection=(action this.noop)
            cancel=(action this.noop)
        }}`);
        assert.dom('[data-test-collection-submission-confirmation-modal-body]').containsText(
            t('collections.collection_submission_confirmation_modal.body'),
        );
        assert.dom('[data-test-collection-submission-confirmation-modal-moderated-body]').containsText(
            t('collections.collection_submission_confirmation_modal.body_moderated'),
        );
    });

    test('Add to collection button calls addToCollection action', async function(assert) {
        assert.expect(1);
        this.set('noop', () => { /* noop */ });
        this.set('externalSaveAction', () => {
            assert.ok(true);
        });
        await render(hbs`
        {{collection-submission-confirmation-modal
            resubmitToCollection=(action this.noop)
            showResubmitModal=false openModal=true
            addToCollection=(action this.externalSaveAction)
            cancel=(action this.noop)
        }}`);
        await click('[data-test-collection-submission-confirmation-modal-add-button]');
    });

    test('Cancel button calls cancel action', async function(assert) {
        assert.expect(1);
        this.set('noop', () => { /* noop */ });
        this.set('externalCancelAction', () => {
            assert.ok(true);
        });
        await render(hbs`
        {{collection-submission-confirmation-modal
            resubmitToCollection=(action this.noop)
            openModal=true
            addToCollection=(action this.noop)
            cancel=(action this.externalCancelAction)
        }}`);
        await click('[data-test-collection-submission-confirmation-modal-cancel-button]');
    });

    test('Resubmit workflow', async function(assert) {
        this.set('resubmit', () => assert.ok(true));
        await render(
            hbs`<CollectionsSubmission::CollectionSubmissionConfirmationModal
                @resubmitToCollection={{ action this.resubmit }}
                @openModal=true
                @addToCollection={{ action this.noop}}
                @showResubmitModal=true
                @cancel={{ action this.noop2}}
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
        await click('[data-test-collection-submission-confirmation-modal-resubmit-button]');
    });
});
