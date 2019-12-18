import { tagName } from '@ember-decorators/component';
import { action, computed } from '@ember-decorators/object';
import { alias, not } from '@ember-decorators/object/computed';
import { service } from '@ember-decorators/service';
import Component from '@ember/component';
import { assert } from '@ember/debug';
import { task, TaskInstance, timeout } from 'ember-concurrency';
import Toast from 'ember-toastr/services/toast';

import { layout } from 'ember-osf-web/decorators/component';
import DraftRegistration from 'ember-osf-web/models/draft-registration';
import NodeModel from 'ember-osf-web/models/node';
import SchemaBlock from 'ember-osf-web/models/schema-block';

import { getPages, PageManager, RegistrationResponse } from 'ember-osf-web/packages/registration-schema';
import { getNextPageParam, getPrevPageParam } from 'ember-osf-web/utils/page-param';
import template from './template';

export interface DraftRegistrationManager {
    registrationResponsesIsValid: boolean;
    hasInvalidResponses: boolean;
    registrationResponses: RegistrationResponse;
    schemaBlocks: SchemaBlock[];
    currentPageManager: PageManager;
    pageManagers: PageManager[];
    currentPage: number;
    draftId: string;
    nextPageParam: string;
    prevPageParam: string;
    autoSaving: boolean;
    lastPage: number;
    initializing: boolean;

    onInput(): void;
    onPageChange(): void;
}

@tagName('')
@layout(template)
export default class DraftRegistrationManagerComponent extends Component.extend({
    initializePageManagers: task(function *(this: DraftRegistrationManagerComponent) {
        assert(
            'TaskInstance<DraftRegistration> xor DraftRegistration is required!',
            Boolean(this.draftRegistration || this.modelTaskInstance),
        );

        const draftRegistration = this.draftRegistration || (yield this.modelTaskInstance);
        this.setProperties({ draftRegistration });

        const registrationSchema = yield this.draftRegistration.registrationSchema;
        const schemaBlocks: SchemaBlock[] = yield registrationSchema.loadAll('schemaBlocks');
        const pages = getPages(schemaBlocks);
        const { registrationResponses } = this.draftRegistration;

        this.setProperties({
            schemaBlocks,
            lastPage: pages.length - 1,
            registrationResponses: registrationResponses || {},
        });

        const pageManagers = pages.map(
            pageSchemaBlocks => new PageManager(
                pageSchemaBlocks,
                this.registrationResponses || {},
                this.node,
            ),
        );

        if (!this.inReview) {
            if (this.currentPage <= this.lastPage) {
                if (this.updateRoute) {
                    this.updateRoute(pageManagers[this.currentPage].pageHeadingText as string);
                }
            } else if (this.onPageNotFound) {
                this.onPageNotFound();
            }
        }

        this.setProperties({ pageManagers });
    }).on('init'),

    onInput: task(function *(this: DraftRegistrationManagerComponent) {
        yield timeout(5000); // debounce

        if (this.currentPageManager && this.currentPageManager.schemaBlockGroups) {
            this.updateRegistrationResponses(this.currentPageManager);

            this.draftRegistration.setProperties({
                registrationResponses: this.registrationResponses,
            });

            try {
                yield this.draftRegistration.save();
            } catch (error) {
                this.toast.error('Save failed');
                throw error;
            }
        }
    }).restartable(),

    saveAllVisitedPages: task(function *(this: DraftRegistrationManagerComponent) {
        if (this.pageManagers && this.pageManagers.length) {
            this.pageManagers
                .filter(pageManager => pageManager.isVisited)
                .forEach(this.updateRegistrationResponses.bind(this));

            const { registrationResponses } = this;

            this.draftRegistration.setProperties({
                registrationResponses,
            });

            yield this.draftRegistration.save();
        }
    }).restartable(),
}) {
    // Required
    modelTaskInstance!: TaskInstance<DraftRegistration>;
    draftRegistration!: DraftRegistration;
    node!: NodeModel;

    // Optional
    updateRoute?: (headingText: string) => void;
    onPageNotFound?: () => void;

    // Private
    currentPage!: number;
    lastPage!: number;
    registrationResponses!: RegistrationResponse;
    inReview!: boolean;

    pageManagers: PageManager[] = [];
    schemaBlocks?: SchemaBlock[];

    @service toast!: Toast;
    @alias('onInput.isRunning') autoSaving!: boolean;
    @alias('initializePageManagers.isRunning') initializing!: boolean;
    @not('registrationResponsesIsValid') hasInvalidResponses!: boolean;

    @computed('currentPage', 'pageManagers.[]')
    get nextPageParam() {
        if (this.pageManagers.length && (this.currentPage < this.lastPage)) {
            const { pageHeadingText } = this.pageManagers[this.currentPage + 1];
            return getNextPageParam(this.currentPage, pageHeadingText!);
        }
        return '';
    }

    @computed('currentPage', 'pageManagers.[]', 'inReview')
    get prevPageParam() {
        if (this.pageManagers.length) {
            const currentPage = this.inReview ? this.lastPage + 1 : this.currentPage;

            if (currentPage > 0) {
                const { pageHeadingText } = this.pageManagers[currentPage - 1];
                return getPrevPageParam(currentPage, pageHeadingText!);
            }
        }
        return '';
    }

    @computed('currentPage', 'pageManagers.[]')
    get currentPageManager() {
        if (this.pageManagers.length) {
            return this.pageManagers[this.currentPage];
        }
        return undefined;
    }

    @computed('pageManagers.{[],@each.pageIsValid}')
    get registrationResponsesIsValid() {
        return this.pageManagers.every(pageManager => pageManager.pageIsValid);
    }

    @computed('onInput.lastComplete')
    get lastSaveFailed() {
        return this.onInput.lastComplete ? this.onInput.lastComplete.isError : false;
    }

    @action
    onPageChange(currentPage: number, inReview: boolean) {
        if (inReview) {
            this.markAllPagesVisited();
            this.validateAllVisitedPages();
            this.saveAllVisitedPages.perform();
        } else {
            this.validateAllVisitedPages();
            this.saveAllVisitedPages.perform();
            this.markCurrentPageVisited(currentPage);
        }
    }

    @action
    markAllPagesVisited() {
        this.pageManagers.forEach(pageManager => {
            pageManager.setPageIsVisited();
        });
    }

    @action
    markCurrentPageVisited(currentPage: number) {
        const isPageIndex = Number.isInteger(currentPage);
        if (this.pageManagers.length && isPageIndex) {
            this.pageManagers[currentPage].setPageIsVisited();
        }
    }

    @action
    validateAllVisitedPages() {
        this.pageManagers
            .filter(pageManager => pageManager.isVisited)
            .forEach(pageManager => {
                pageManager.changeset!.validate();
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
                    Object.assign(
                        registrationResponses,
                        { [registrationResponseKey]: changeset!.get(registrationResponseKey) },
                    );
                });
        }
    }
}
