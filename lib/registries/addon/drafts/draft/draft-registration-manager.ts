import { action, computed, set } from '@ember/object';
import { alias, filterBy, not, notEmpty, or } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import { isEmpty } from '@ember/utils';
import { ChangesetDef } from 'ember-changeset/types';
import { TaskInstance, timeout } from 'ember-concurrency';
import { task } from 'ember-concurrency-decorators';
import Intl from 'ember-intl/services/intl';
import Toast from 'ember-toastr/services/toast';

import DraftRegistration, { DraftMetadataProperties } from 'ember-osf-web/models/draft-registration';
import NodeModel from 'ember-osf-web/models/node';
import ProviderModel from 'ember-osf-web/models/provider';
import SchemaBlock from 'ember-osf-web/models/schema-block';
import captureException, { getApiErrorMessage } from 'ember-osf-web/utils/capture-exception';

import { Permission } from 'ember-osf-web/models/osf-model';
import {
    buildMetadataValidations,
    getPages,
    PageManager,
    RegistrationResponse,
} from 'ember-osf-web/packages/registration-schema';
import buildChangeset from 'ember-osf-web/utils/build-changeset';

type LoadDraftModelTask = TaskInstance<{
    draftRegistration: DraftRegistration,
    node?: NodeModel,
    provider: ProviderModel,
}>;

export default class DraftRegistrationManager {
    // Required
    draftRegistrationAndNodeTask!: LoadDraftModelTask;

    // Private
    @service intl!: Intl;
    @service toast!: Toast;

    currentPage!: number;
    registrationResponses!: RegistrationResponse;

    pageManagers: PageManager[] = [];
    metadataChangeset!: ChangesetDef;
    schemaBlocks!: SchemaBlock[];

    @alias('draftRegistration.id') draftId!: string;
    @alias('draftRegistration.userIsReadOnly') readOnly!: boolean;
    @alias('provider.reviewsWorkflow') reviewsWorkflow?: string;
    @or('onPageInput.isRunning', 'onMetadataInput.isRunning') autoSaving!: boolean;
    @or('initializePageManagers.isRunning', 'initializeMetadataChangeset.isRunning') initializing!: boolean;
    @not('registrationResponsesIsValid') hasInvalidResponses!: boolean;
    @filterBy('pageManagers', 'isVisited', true) visitedPages!: PageManager[];
    @notEmpty('visitedPages') hasVisitedPages!: boolean;

    draftRegistration!: DraftRegistration;
    node?: NodeModel;
    provider!: ProviderModel;

    @computed('pageManagers.{[],@each.pageIsValid}')
    get registrationResponsesIsValid() {
        return this.pageManagers.every(pageManager => pageManager.pageIsValid) && this.metadataIsValid;
    }

    @computed('metadataChangeset.isValid')
    get metadataIsValid() {
        return this.metadataChangeset.get('isValid');
    }

    @computed('onInput.lastComplete')
    get lastSaveFailed() {
        const pageInputFailed = this.onPageInput.lastComplete ? this.onPageInput.lastComplete.isError : false;
        const metadataInputFailed = this.onMetadataInput.lastComplete
            ? this.onMetadataInput.lastComplete.isError : false;
        return pageInputFailed || metadataInputFailed;
    }

    get currentUserIsAdmin() {
        const { currentUserPermissions } = this.draftRegistration;
        if (currentUserPermissions) {
            return currentUserPermissions.includes(Permission.Admin);
        }
        return false;
    }

    @task({ withTestWaiter: true })
    initializePageManagers = task(function *(this: DraftRegistrationManager) {
        const { draftRegistration, node, provider } = yield this.draftRegistrationAndNodeTask;
        set(this, 'draftRegistration', draftRegistration);
        set(this, 'node', node);
        set(this, 'provider', provider);
        const registrationSchema = yield this.draftRegistration.registrationSchema;
        const schemaBlocks: SchemaBlock[] = yield registrationSchema.loadAll('schemaBlocks');
        set(this, 'schemaBlocks', schemaBlocks);
        const pages = getPages(schemaBlocks);
        const { registrationResponses } = this.draftRegistration;

        set(this, 'registrationResponses', registrationResponses || {});

        const pageManagers = pages.map(
            pageSchemaBlocks => new PageManager(
                pageSchemaBlocks,
                this.registrationResponses || {},
                this.node,
            ),
        );

        set(this, 'pageManagers', pageManagers);
    });

    @task({ withTestWaiter: true })
    initializeMetadataChangeset = task(function *(this: DraftRegistrationManager) {
        const { draftRegistration } = yield this.draftRegistrationAndNodeTask;
        const metadataValidations = buildMetadataValidations();
        const metadataChangeset = buildChangeset(draftRegistration, metadataValidations);
        set(this, 'metadataChangeset', metadataChangeset);
    });

    @task({ withTestWaiter: true, restartable: true })
    onMetadataInput = task(function *(this: DraftRegistrationManager) {
        yield timeout(5000); // debounce
        this.updateMetadataChangeset();
        try {
            yield this.draftRegistration.save();
        } catch (e) {
            const errorMessage = this.intl.t('registries.drafts.draft.metadata.failed_auto_save');
            captureException(e, { errorMessage });
            this.toast.error(getApiErrorMessage(e), errorMessage);
            throw e;
        }
    });

    @task({ withTestWaiter: true, restartable: true })
    onPageInput = task(function *(this: DraftRegistrationManager, currentPageManager: PageManager) {
        yield timeout(5000); // debounce

        if (currentPageManager && currentPageManager.schemaBlockGroups) {
            this.updateRegistrationResponses(currentPageManager);

            this.draftRegistration.setProperties({
                registrationResponses: this.registrationResponses,
            });
            try {
                yield this.draftRegistration.save();
            } catch (e) {
                const errorMessage = this.intl.t('registries.drafts.draft.form.failed_auto_save');
                captureException(e, { errorMessage });
                this.toast.error(getApiErrorMessage(e), errorMessage);
                throw e;
            }
        }
    });

    @task({ withTestWaiter: true, restartable: true })
    saveAllVisitedPages = task(function *(this: DraftRegistrationManager) {
        if (this.pageManagers && this.pageManagers.length) {
            this.pageManagers
                .filter(pageManager => pageManager.isVisited)
                .forEach(this.updateRegistrationResponses.bind(this));

            const { registrationResponses } = this;

            this.draftRegistration.setProperties({
                registrationResponses,
            });

            try {
                yield this.draftRegistration.save();
            } catch (e) {
                captureException(e);
                throw e;
            }
        }
    });

    constructor(draftRegistrationAndNodeTask: LoadDraftModelTask) {
        set(this, 'draftRegistrationAndNodeTask', draftRegistrationAndNodeTask);
        this.initializePageManagers.perform();
        this.initializeMetadataChangeset.perform();
    }

    @action
    onPageChange(currentPage: number) {
        if (this.hasVisitedPages) {
            this.validateAllVisitedPages();
            this.saveAllVisitedPages.perform();
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
        this.metadataChangeset.validate();
        this.visitedPages
            .forEach(pageManager => {
                pageManager.changeset!.validate();
            });
    }

    updateMetadataChangeset() {
        const { metadataChangeset, draftRegistration } = this;
        Object.values(DraftMetadataProperties).forEach(metadataKey => {
            set(
                draftRegistration,
                metadataKey,
                metadataChangeset!.get(metadataKey),
            );
        });
    }

    updateRegistrationResponses(pageManager: PageManager) {
        const { registrationResponses } = this;
        const { changeset } = pageManager;
        if (pageManager.schemaBlockGroups) {
            pageManager.schemaBlockGroups
                .mapBy('registrationResponseKey')
                .filter(Boolean)
                .forEach(registrationResponseKey => {
                    set(
                        registrationResponses,
                        registrationResponseKey,
                        changeset!.get(registrationResponseKey),
                    );
                });
        }
    }
}
