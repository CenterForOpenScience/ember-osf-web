import Store from '@ember-data/store';
import Component from '@ember/component';
import { action, computed } from '@ember/object';
import { bool } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import { underscore } from '@ember/string';
import { waitFor } from '@ember/test-waiters';
import { tracked } from '@glimmer/tracking';
import { dropTask, timeout } from 'ember-concurrency';
import { taskFor } from 'ember-concurrency-ts';
import Intl from 'ember-intl/services/intl';
import Toast from 'ember-toastr/services/toast';

import { layout, requiredAction } from 'ember-osf-web/decorators/component';
import CollectionSubmission, { CollectionSubmissionReviewStates } from 'ember-osf-web/models/collection-submission';
import Collection from 'ember-osf-web/models/collection';
import CollectionProvider from 'ember-osf-web/models/collection-provider';
import Node from 'ember-osf-web/models/node';
import Analytics from 'ember-osf-web/services/analytics';
import CurrentUser from 'ember-osf-web/services/current-user';
import Theme from 'ember-osf-web/services/theme';
import captureException, { getApiErrorMessage } from 'ember-osf-web/utils/capture-exception';
import getHref from 'ember-osf-web/utils/get-href';
import styles from './styles';
import template from './template';

enum Section {
    project = 0,
    projectMetadata = 1,
    projectContributors = 2,
    collectionMetadata = 3,
    submit = 4,
}

@layout(template, styles)
export default class Submit extends Component {
    @service analytics!: Analytics;
    @service currentUser!: CurrentUser;
    @service intl!: Intl;
    @service store!: Store;
    @service theme!: Theme;
    @service toast!: Toast;

    readonly edit = false;
    readonly provider!: CollectionProvider;
    readonly collection!: Collection;

    collectionSubmission!: CollectionSubmission;
    collectionItem: Node | null = null;
    isProjectSelectorValid = false;
    sections = Section;
    activeSection!: Section;
    savedSections!: Section[];
    showCancelDialog = false;
    intlKeyPrefix = 'collections.collections_submission.';
    showSubmitModal = false;
    @tracked showResubmitModal = false;

    @bool('provider.reviewsWorkflow') collectionIsModerated!: boolean;

    /**
     * Leaves the current route for the discover route (currently home for collections)
     */
    @requiredAction
    transition!: () => void;

    /**
     * Called when user advances to the next section
     */
    @requiredAction
    onNextSection!: () => void;

    /**
     * Called to reset isPageDirty
     */
    @requiredAction
    resetPageDirty!: () => void;

    @dropTask
    @waitFor
    async checkForExistingSubmission(collectionItem: Node) {
        const filter = {
            id: collectionItem.id,
            reviews_state: [CollectionSubmissionReviewStates.Rejected, CollectionSubmissionReviewStates.Removed].join(),
        };
        const existingSubmission = await this.collection.queryHasMany('collectionSubmissions', { filter });
        if (existingSubmission.length) {
            this.collectionSubmission.deleteRecord();
            this.set('collectionSubmission', existingSubmission[0]);
            this.set('showResubmitModal', true);
        } else {
            // No existing submission
            // Delete old unsaved submission
            this.store.peekAll('collection-submission').findBy('isNew', true)?.deleteRecord();
            this.set('collectionSubmission', this.store.createRecord('collection-submission', {
                collection: this.collection,
                creator: this.currentUser.user,
            }));
            this.set('showResubmitModal', false);
        }
    }

    @dropTask
    @waitFor
    async save() {
        if (!this.collectionItem) {
            return;
        }

        const validatedModels = await Promise.all([
            this.collectionItem!.validate(),
            this.collectionSubmission.validate(),
        ]);

        const invalid = validatedModels.some(({ validations: { isInvalid } }) => isInvalid);

        if (invalid) {
            return;
        }

        this.collectionSubmission.set('guid', this.collectionItem);

        const operation = this.edit ? 'update' : 'add';

        try {
            if (!this.collectionItem.public) {
                this.collectionItem.set('public', true);
                await this.collectionItem.save();
            }
            await this.collectionSubmission.save();

            this.collectionItem.set('collectable', false);

            this.toast.success(this.intl.t(`${this.intlKeyPrefix}${operation}_save_success`, {
                title: this.collectionItem.title,
            }));

            await timeout(1000);
            this.resetPageDirty();
            // TODO: external-link-to / waffle for project main page
            window.location.href = getHref(this.collectionItem.links.html!);
        } catch (e) {
            const errorMessage = this.intl.t(`${this.intlKeyPrefix}${operation}_save_error`, {
                title: this.collectionItem.title,
            });
            captureException(e, { errorMessage });
            this.toast.error(getApiErrorMessage(e), errorMessage);
        }
    }

    @dropTask
    @waitFor
    async resubmit() {
        if (!this.collectionItem) {
            return;
        }

        const validatedModels = await Promise.all([
            this.collectionItem!.validate(),
            this.collectionSubmission.validate(),
        ]);

        const invalid = validatedModels.some(({ validations: { isInvalid } }) => isInvalid);

        if (invalid) {
            return;
        }

        this.collectionSubmission.set('guid', this.collectionItem);

        const operation = this.edit ? 'update' : 'add';

        try {
            if (!this.collectionItem.public) {
                this.collectionItem.set('public', true);
                await this.collectionItem.save();
            }
            await this.collectionSubmission.save();

            this.collectionItem.set('collectable', false);

            this.toast.success(this.intl.t(`${this.intlKeyPrefix}${operation}_save_success`, {
                title: this.collectionItem.title,
            }));

            await timeout(1000);
            this.resetPageDirty();
            // TODO: external-link-to / waffle for project main page
            window.location.href = getHref(this.collectionItem.links.html!);
        } catch (e) {
            const errorMessage = this.intl.t(`${this.intlKeyPrefix}${operation}_save_error`, {
                title: this.collectionItem.title,
            });
            captureException(e, { errorMessage });
            this.toast.error(getApiErrorMessage(e), errorMessage);
        }
    }

    @dropTask
    @waitFor
    async removeSubmission() {
        if (!this.collectionItem) {
            return;
        }

        try {
            await this.collectionSubmission.destroyRecord();

            this.toast.success(this.intl.t(`${this.intlKeyPrefix}remove_success`, {
                title: this.collectionItem.title,
            }));

            this.resetPageDirty();
            // TODO: external-link-to / waffle for project main page
            window.location.href = getHref(this.collectionItem.links.html!);
        } catch (e) {
            const errorMessage = this.intl.t(`${this.intlKeyPrefix}remove_error`, {
                title: this.collectionItem.title,
            });
            captureException(e, { errorMessage });
            this.toast.error(getApiErrorMessage(e), errorMessage);
        }
    }

    @computed('collectionSubmission.{displayChoiceFields,collectedType,issue,volume,programArea,status}')
    get choiceFields(): Array<{ label: string, value: string | undefined }> {
        return this.collectionSubmission.displayChoiceFields
            .map(field => ({
                name: field,
                label: `collections.collection_metadata.${underscore(field)}_label`,
                value: this.collectionSubmission[field],
            }));
    }

    init() {
        super.init();
        this.set('activeSection', this.edit ? Section.projectMetadata : Section.project);
        this.set('savedSections', this.edit ? [
            Section.project,
            Section.projectMetadata,
            Section.projectContributors,
            Section.collectionMetadata,
        ] : []);
    }

    @action
    projectSelected(collectionItem: Node) {
        collectionItem.set('collectable', true);

        this.setProperties({
            collectionItem,
        });

        taskFor(this.checkForExistingSubmission).perform(collectionItem);

        this.nextSection();
    }

    /**
     * Cancel action for the entire form (bottom of the page). Navigates away if a project has not been selected.
     */
    @action
    cancel() {
        this.transition();
    }

    /**
     * Sets showSubmitModal, a property when set will cause the collection-submission-confirmation-modal to be shown
     */
    @action
    setShowSubmitModal() {
        this.set('showSubmitModal', true);
    }

    /**
     * Resets showSubmitModal
     */
    @action
    resetShowSubmitModal() {
        this.set('showSubmitModal', false);
    }

    @action
    noop() {
        // Nothing to see here
    }

    @action
    onAddContributor() {
        if (this.collectionItem) {
            this.collectionItem.hasMany('bibliographicContributors').reload();
        }
    }

    /**
     * Advances to the next section of the form
     */
    @action
    nextSection() {
        this.savedSections.pushObject(this.activeSection);
        this.incrementProperty('activeSection');
        this.onNextSection();
    }
}
