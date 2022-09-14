import { setOwner } from '@ember/application';
import { action, computed, set } from '@ember/object';
import { dependentKeyCompat } from '@ember/object/compat';
import { alias, filterBy, not, notEmpty, or } from '@ember/object/computed';
import RouterService from '@ember/routing/router-service';
import { inject as service } from '@ember/service';
import { waitFor } from '@ember/test-waiters';
import { isEmpty } from '@ember/utils';
import { restartableTask, task, TaskInstance, timeout } from 'ember-concurrency';
import { taskFor } from 'ember-concurrency-ts';
import Intl from 'ember-intl/services/intl';
import Toast from 'ember-toastr/services/toast';
import { BufferedChangeset } from 'validated-changeset';

import ProviderModel from 'ember-osf-web/models/provider';
import SchemaBlock from 'ember-osf-web/models/schema-block';
import captureException, { getApiErrorMessage } from 'ember-osf-web/utils/capture-exception';

import {
    buildSchemaResponseValidations,
    getPages,
    PageManager,
    RegistrationResponse,
} from 'ember-osf-web/packages/registration-schema';
import RegistrationModel from 'ember-osf-web/models/registration';
import SchemaResponseModel, { RevisionReviewStates } from 'ember-osf-web/models/schema-response';
import NodeModel from 'ember-osf-web/models/node';
import { Permission } from 'ember-osf-web/models/osf-model';
import buildChangeset from 'ember-osf-web/utils/build-changeset';
import { notFoundURL } from 'ember-osf-web/utils/clean-url';

export type LoadModelsTask = TaskInstance<{
    revision: SchemaResponseModel,
    registration: RegistrationModel,
    provider: ProviderModel,
}>;

export default class RevisionManager {
    // Required
    loadModelsTask!: LoadModelsTask;

    // Private
    @service intl!: Intl;
    @service toast!: Toast;
    @service router!: RouterService;

    currentPage!: number;
    revisionResponses!: RegistrationResponse;

    pageManagers: PageManager[] = [];
    revisionChangeset!: BufferedChangeset;
    schemaBlocks!: SchemaBlock[];

    @alias('registration.currentUserIsReadOnly') currentUserIsReadOnly!: boolean;
    @or('onPageInput.isRunning', 'onJustificationInput.isRunning') autoSaving!: boolean;
    @or('initializePageManagers.isRunning', 'initializeRevisionChangeset.isRunning') initializing!: boolean;
    @not('registrationResponsesIsValid') hasInvalidResponses!: boolean;
    @filterBy('pageManagers', 'isVisited', true) visitedPages!: PageManager[];
    @notEmpty('visitedPages') hasVisitedPages!: boolean;

    revision!: SchemaResponseModel;
    registration!: RegistrationModel;
    provider!: ProviderModel;
    node?: NodeModel;
    revisionId!: string;

    @computed('pageManagers.{[],@each.pageIsValid}', 'revisionIsValid')
    get registrationResponsesIsValid() {
        return this.pageManagers.every(pageManager => pageManager.pageIsValid)
            && this.revisionIsValid;
    }

    @dependentKeyCompat
    get revisionIsValid() {
        return this.revisionChangeset.isValid;
    }

    @computed('onPageInput.lastComplete', 'updateRevisionAndSave.lastComplete')
    get lastSaveFailed() {
        const onPageInputLastComplete = taskFor(this.onPageInput).lastComplete;
        const updateRevisionAndSaveLastComplete = taskFor(this.updateRevisionAndSave).lastComplete;
        const pageInputFailed = onPageInputLastComplete ? onPageInputLastComplete.isError : false;
        const updateRevisionAndSaveFailed = updateRevisionAndSaveLastComplete
            ? updateRevisionAndSaveLastComplete.isError : false;
        return pageInputFailed || updateRevisionAndSaveFailed;
    }

    @computed('revision.reviewsState')
    get isEditable() {
        return this.revision?.reviewsState === RevisionReviewStates.RevisionInProgress;
    }

    @computed('currentUserIsAdmin', 'isEditable')
    get showDeleteButton() {
        return this.currentUserIsAdmin && this.isEditable;
    }

    @computed('revision.reviewsState')
    get isPendingAdminApproval() {
        return this.revision.reviewsState === RevisionReviewStates.Unapproved;
    }

    @computed('revision.reviewsState')
    get isPendingModeration() {
        return this.revision.reviewsState === RevisionReviewStates.RevisionPendingModeration;
    }

    @computed('registration.currentUserPermissions')
    get currentUserIsAdmin() {
        return this.registration.currentUserPermissions.includes(Permission.Admin);
    }

    constructor(owner: any, loadModelsTask: LoadModelsTask, revisionId: string) {
        setOwner(this, owner);
        set(this, 'loadModelsTask', loadModelsTask);
        set(this, 'revisionId', revisionId);
        taskFor(this.initializePageManagers).perform();
        taskFor(this.initializeRevisionChangeset).perform();
    }

    @restartableTask
    @waitFor
    async saveAllVisitedPages() {
        if (this.pageManagers && this.pageManagers.length) {
            this.pageManagers
                .filter(pageManager => pageManager.isVisited)
                .forEach(this.updateRegistrationResponses.bind(this));

            const { revisionResponses } = this;

            this.revision.setProperties({
                revisionResponses,
            });

            try {
                await this.revision.save();
            } catch (e) {
                captureException(e);
                throw e;
            }
        }
    }

    @restartableTask
    @waitFor
    async onPageInput(currentPageManager: PageManager) {
        await timeout(3000); // debounce

        await taskFor(this.saveResponses).perform(currentPageManager);
    }

    @restartableTask
    @waitFor
    async saveResponses(currentPageManager: PageManager) {
        if (currentPageManager && currentPageManager.schemaBlockGroups) {
            this.updateRegistrationResponses(currentPageManager);

            this.revision.setProperties({
                revisionResponses: this.revisionResponses,
            });
            try {
                await this.revision.save();
            } catch (e) {
                const errorMessage = this.intl.t('registries.drafts.draft.form.failed_auto_save');
                captureException(e, { errorMessage });
                this.toast.error(getApiErrorMessage(e), errorMessage);
            }
        }
    }

    @task
    @waitFor
    async initializePageManagers() {
        const { revision, provider, registration } = await this.loadModelsTask;
        set(this, 'revision', revision);
        set(this, 'provider', provider);
        set(this, 'registration', registration);
        const registrationSchema = await this.revision.registrationSchema;
        const schemaBlocks = await registrationSchema.loadAll('schemaBlocks');
        set(this, 'schemaBlocks', schemaBlocks);
        const pages = getPages(schemaBlocks);
        const { revisionResponses } = this.revision;

        set(this, 'revisionResponses', revisionResponses || {});

        const pageManagers = pages.map(
            pageSchemaBlocks => new PageManager(
                pageSchemaBlocks,
                this.revisionResponses || {},
                this.registration,
            ),
        );

        set(this, 'pageManagers', pageManagers);
    }

    @task
    @waitFor
    async initializeRevisionChangeset() {
        const { revision } = await this.loadModelsTask;
        if (!revision) {
            return this.router.transitionTo('registries.page-not-found', notFoundURL(this.router.currentURL));
        }
        const revisionValidations = buildSchemaResponseValidations();
        const revisionChangeset = buildChangeset(revision, revisionValidations);
        set(this, 'revisionChangeset', revisionChangeset);
    }

    @restartableTask
    @waitFor
    async onJustificationInput() {
        await timeout(3000); // debounce
        await taskFor(this.updateRevisionAndSave).perform();
    }

    @restartableTask
    @waitFor
    async updateRevisionAndSave() {
        const { revisionChangeset, revision } = this;
        set(revision, 'revisionJustification', revisionChangeset.get('revisionJustification'));
        try {
            await this.revision.save();
        } catch (e) {
            const errorMessage = this.intl.t('registries.drafts.draft.metadata.failed_auto_save');
            captureException(e, { errorMessage });
            this.toast.error(getApiErrorMessage(e), errorMessage);
        }
    }

    @task
    @waitFor
    async deleteRevision() {
        try {
            await this.revision.destroyRecord();
            this.router.transitionTo('registries.overview.index', this.registration.id);
        } catch (e) {
            const errorMessage = this.intl.t('registries.edit_revision.delete_modal.delete_error');
            captureException(e, { errorMessage });
            this.toast.error(getApiErrorMessage(e), errorMessage);
        }
    }

    @restartableTask
    @waitFor
    async saveWithToast() {
        try {
            taskFor(this.onJustificationInput).cancelAll();
            taskFor(this.onPageInput).cancelAll();
            await taskFor(this.updateRevisionAndSave).perform();
            await taskFor(this.saveAllVisitedPages).perform();
            this.toast.success(this.intl.t('registries.edit_revision.save_success'));
        } catch (e) {
            const errorTitle = this.intl.t('registries.edit_revision.save_failed');
            this.toast.error(getApiErrorMessage(e), errorTitle);
        }
    }

    @action
    onPageChange(currentPage: number) {
        if (this.hasVisitedPages) {
            this.validateAllVisitedPages();
            taskFor(this.saveAllVisitedPages).perform();
        }
        this.markCurrentPageVisited(currentPage);
    }

    @action
    markAllPagesVisited() {
        this.pageManagers.forEach(pageManager => {
            pageManager.setPageIsVisited();
        });
    }

    @action
    markCurrentPageVisited(currentPage?: number) {
        const { pageManagers } = this;
        if (!isEmpty(pageManagers) && typeof currentPage !== 'undefined') {
            pageManagers[currentPage].setPageIsVisited();
        }
    }

    @action
    validateAllVisitedPages() {
        this.revisionChangeset.validate();
        this.visitedPages
            .forEach(pageManager => {
                pageManager.changeset!.validate();
            });
    }

    updateRegistrationResponses(pageManager: PageManager) {
        const { revisionResponses } = this;
        const { changeset } = pageManager;
        if (pageManager.schemaBlockGroups) {
            pageManager.schemaBlockGroups
                .mapBy('registrationResponseKey')
                .filter(Boolean)
                .forEach(registrationResponseKey => {
                    set(
                        revisionResponses,
                        registrationResponseKey,
                        changeset!.get(registrationResponseKey),
                    );
                });
        }
    }
}
