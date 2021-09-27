import { action, computed, set } from '@ember/object';
import { alias, filterBy, not, notEmpty } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import { waitFor } from '@ember/test-waiters';
import { isEmpty } from '@ember/utils';
import { restartableTask, task, TaskInstance, timeout } from 'ember-concurrency';
import { taskFor } from 'ember-concurrency-ts';
import Intl from 'ember-intl/services/intl';
import Toast from 'ember-toastr/services/toast';

import ProviderModel from 'ember-osf-web/models/provider';
import SchemaBlock from 'ember-osf-web/models/schema-block';
import captureException, { getApiErrorMessage } from 'ember-osf-web/utils/capture-exception';

import {
    getPages,
    PageManager,
    RegistrationResponse,
} from 'ember-osf-web/packages/registration-schema';
import RegistrationModel from 'ember-osf-web/models/registration';
import SchemaResponseModel, { RevisionReviewStates } from 'ember-osf-web/models/schema-response';
import NodeModel from 'ember-osf-web/models/node';
import { Permission } from 'ember-osf-web/models/osf-model';

type LoadModelsTask = TaskInstance<{
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

    currentPage!: number;
    revisionResponses!: RegistrationResponse;

    pageManagers: PageManager[] = [];
    schemaBlocks!: SchemaBlock[];

    @alias('registration.currentUserIsReadOnly') currentUserIsReadOnly!: boolean;
    @alias('provider.reviewsWorkflow') reviewsWorkflow?: string;
    @alias('onPageInput.isRunning') autoSaving!: boolean;
    @alias('initializePageManagers.isRunning') initializing!: boolean;
    @not('registrationResponsesIsValid') hasInvalidResponses!: boolean;
    @filterBy('pageManagers', 'isVisited', true) visitedPages!: PageManager[];
    @notEmpty('visitedPages') hasVisitedPages!: boolean;

    revision!: SchemaResponseModel;
    registration!: RegistrationModel;
    provider!: ProviderModel;
    node?: NodeModel;
    revisionId!: string;

    @computed('pageManagers.{[],@each.pageIsValid}')
    get registrationResponsesIsValid() {
        return this.pageManagers.every(pageManager => pageManager.pageIsValid);
    }

    @computed('onPageInput.lastComplete')
    get lastSaveFailed() {
        const onPageInputLastComplete = taskFor(this.onPageInput).lastComplete;
        const pageInputFailed = onPageInputLastComplete ? onPageInputLastComplete.isError : false;
        return pageInputFailed;
    }

    @computed('revision.reviewState')
    get isEditable() {
        return this.revision?.reviewState === RevisionReviewStates.RevisionInProgress;
    }

    @computed('revision.reviewState')
    get isPendingAdminApproval() {
        return this.revision.reviewState === RevisionReviewStates.RevisionPendingAdminApproval;
    }

    @computed('revision.reviewState')
    get isPendingModeration() {
        return this.revision.reviewState === RevisionReviewStates.RevisionPendingModeration;
    }

    @computed('registration.currentUserPermissions')
    get currentUserIsAdmin() {
        return this.registration.currentUserPermissions.includes(Permission.Admin);
    }

    constructor(loadModelsTask: LoadModelsTask, revisionId: string) {
        set(this, 'loadModelsTask', loadModelsTask);
        set(this, 'revisionId', revisionId);
        taskFor(this.initializePageManagers).perform();
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
        await timeout(5000); // debounce

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
                throw e;
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

    @restartableTask
    @waitFor
    async updateDraftRegistrationAndSave() {
        try {
            await this.revision.save();
        } catch (e) {
            const errorMessage = this.intl.t('registries.drafts.draft.metadata.failed_auto_save');
            captureException(e, { errorMessage });
            this.toast.error(getApiErrorMessage(e), errorMessage);
            throw e;
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
