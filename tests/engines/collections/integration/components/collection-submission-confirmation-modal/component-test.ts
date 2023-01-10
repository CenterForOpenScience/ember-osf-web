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
        // Given the component is rendered
        await render(
            hbs`<CollectionsSubmission::CollectionSubmissionConfirmationModal
                @resubmitToCollection={{ this.externalResubmitAction }}
                @openModal=true
                @addToCollection={{ this.externalSaveAction}}
                @cancel={{ this.externalCancelAction }}
            />`,
        );
        // Then I assert the modal header text
        assert.dom('[data-test-collection-submission-confirmation-modal-header]')
            .hasText('Submit project', 'The modal header is wrong');

        // And I assert the modal body text
        assert.dom('[data-test-collection-submission-confirmation-modal-body]')
            .hasText(
                // eslint-disable-next-line max-len
                'Once submitted to the collection, the project will be made public. It can later be made private again.',
                'The modal body test is wrong',
            );

        // And I assert the body moderated text does not appear
        assert.dom('[data-test-collection-submission-confirmation-modal-body]').doesNotHaveTextContaining(
            t('collections.collection_submission_confirmation_modal.body_moderated'),
        );

        // And I assert the cancel button text is correct
        assert.dom('[data-test-collection-submission-confirmation-modal-cancel-button]')
            .hasText('Cancel', 'The cancel button text is missing');

        // And I assert the add to collection button is correct
        assert.dom('[data-test-collection-submission-confirmation-modal-add-button]')
            .hasText('Add to collection', 'The add to collection button is not correct.');

        // And I assert he modal resubmit does not exist
        assert.dom('[data-test-collection-submission-confirmation-modal-resubmit]')
            .doesNotExist('The resubmit text is visible');

        // And The modal reason text does not exit
        assert.dom('[data-test-collection-submission-confirmation-modal-reason]')
            .doesNotExist('The collection submission confirmation modal reason does exists.');
    });

    test('it renders for moderated', async function(assert) {
        // Given the component is rendered
        await render(
            hbs`<CollectionsSubmission::CollectionSubmissionConfirmationModal
                @collectionIsModerated=true
                @resubmitToCollection={{ this.externalResubmitAction }}
                @openModal=true
                @addToCollection={{ this.externalSaveAction}}
                @cancel={{ this.externalCancelAction }}
            />`,
        );

        // And I assert the modal body text
        assert.dom('[data-test-collection-submission-confirmation-modal-body]')
            .hasText(
                // eslint-disable-next-line max-len
                'Once submitted to the collection, the project will be made public. It can later be made private again.',
                'The modal body test is wrong',
            );

        // And I assert the moderated body text
        assert.dom('[data-test-collection-submission-confirmation-modal-moderated-body]')
            .hasText('A moderator will review your submission before it is included in the collection.',
                'The moderated text is not correct');
    });

    test('Add to collection button calls addToCollection action', async function(assert) {
        // Given the component is rendered
        await render(
            hbs`<CollectionsSubmission::CollectionSubmissionConfirmationModal
                @openModal=true
                showResubmitModal=false
                @resubmitToCollection={{ this.externalResubmitAction }}
                @addToCollection={{ this.externalSaveAction}}
                @cancel={{ this.externalCancelAction }}
            />`,
        );

        // Then I assert the add to collection button is correct
        assert.dom('[data-test-collection-submission-confirmation-modal-add-button]')
            .hasText('Add to collection', 'The to collection button is wrong');

        // When I click on the add button
        await click('[ data-test-collection-submission-confirmation-modal-add-button]');

        // Then I verify the action was handled
        assert.true(externalSaveClicked);

    });

    test('Cancel button calls cancel action', async function(assert) {
        // Given the component is rendered
        await render(
            hbs`<CollectionsSubmission::CollectionSubmissionConfirmationModal
                @openModal=true
                @resubmitToCollection={{ this.externalResubmitAction }}
                @addToCollection={{ this.externalSaveAction}}
                @cancel={{ this.externalCancelAction}}
            />`,
        );

        // Then I assert the cancel button text is correct
        assert.dom('[data-test-collection-submission-confirmation-modal-cancel-button]')
            .hasText('Cancel', 'The cancel button is wrong');

        // When I click on the cancel button

        await click('[data-test-collection-submission-confirmation-modal-cancel-button]');

        // Then I verify the action was handled
        assert.true(externalCancelClicked);
    });

    test('Resubmit workflow', async function(assert) {
        // Given the component is rendered
        await render(
            hbs`<CollectionsSubmission::CollectionSubmissionConfirmationModal
                @resubmitToCollection={{ this.externalResubmitAction }}
                @openModal=true
                @addToCollection={{ this.externalSaveAction}}
                @showResubmitModal=true
                @cancel={{ this.externalCancelAction }}
            />`,
        );

        // Then I verify the modal resubmit text is correct
        assert.dom('[data-test-collection-submission-confirmation-modal-resubmit]').hasText(
            'This project was removed or rejected from this collection. Do you want to resubmit it?',
            'The text is valid',
        );

        // And I verify the modal reason text area exists
        assert.dom('[data-test-collection-submission-confirmation-modal-reason]')
            .exists('The collection submission confirmation modal reason does not exist.');

        // And I verify the standard modal submit body text does not exist
        assert.dom('[data-test-collection-submission-confirmation-modal-body]').doesNotExist();

        // And I verify the add button does not exist
        assert.dom('[data-test-collection-submission-confirmation-modal-add-button]').doesNotExist();

        // And I verify the resubmit button text is correct
        assert.dom('[data-test-collection-submission-confirmation-modal-resubmit-button]')
            .hasText('Resubmit', 'The resubmit button is wrong');

        // When I click on the resubmit button
        await click('[data-test-collection-submission-confirmation-modal-resubmit-button]');

        // Then I verify the action was handled
        assert.true(externalResubmitClicked);
    });
});
