import { action, computed, set } from '@ember/object';
import { alias, filterBy, not, notEmpty } from '@ember/object/computed';
import { isEmpty } from '@ember/utils';
import { TaskInstance, timeout } from 'ember-concurrency';
import { task } from 'ember-concurrency-decorators';

import DraftRegistration from 'ember-osf-web/models/draft-registration';
import NodeModel from 'ember-osf-web/models/node';
import SchemaBlock from 'ember-osf-web/models/schema-block';

import { getPages, PageManager, RegistrationResponse } from 'ember-osf-web/packages/registration-schema';
import { getNextPageParam, getPrevPageParam } from 'ember-osf-web/utils/page-param';

export type DraftRegistrationAndNode = TaskInstance<{draftRegistration: DraftRegistration, node: NodeModel} | undefined>;

export class DraftRegistrationManager {
    // Required
    draftRegistrationAndNodeTask!: DraftRegistrationAndNode;

    // Optional
    updateRoute?: (headingText: string) => void;
    // onPageNotFound?: () => void;

    // Private
    currentPage?: number;
    lastPage!: number;
    registrationResponses!: RegistrationResponse;
    inReview!: boolean;
    pageOutOfBounds: boolean = false;

    pageManagers: PageManager[] = [];

    @alias('onInput.isRunning') autoSaving!: boolean;
    @alias('initializePageManagers.isRunning') initializing!: boolean;
    @not('registrationResponsesIsValid') hasInvalidResponses!: boolean;
    @filterBy('pageManagers', 'isVisited', true) visitedPages!: PageManager[];
    @notEmpty('visitedPages') hasVisitedPages!: boolean;

    taskInstance?: DraftRegistrationAndNode;
    draftRegistration!: DraftRegistration;
    node!: NodeModel;

    @computed('currentPage')
    get currentPageOutOfBounds() {
        if (typeof this.currentPage === 'undefined') {
            return false;
        } else {
            if (this.currentPage > this.lastPage) {
                return true;
            }
        }
        return false;
    }

    @computed('currentPage', 'pageManagers.[]')
    get nextPageParam() {
        const { pageManagers, currentPage, lastPage } = this;

        if (typeof currentPage === 'undefined') {
            return '';
        }
        if (!isEmpty(pageManagers) && (currentPage < lastPage)) {
            const { pageHeadingText } = pageManagers[currentPage + 1];
            return getNextPageParam(currentPage, pageHeadingText!);
        }
        return '';
    }

    @computed('currentPage', 'pageManagers.[]', 'inReview')
    get prevPageParam() {
        const { pageManagers, inReview, lastPage, currentPage } = this;
        if (typeof currentPage === 'undefined') {
            return;
        }

        if (!isEmpty(pageManagers)) {
            const currentPageNumber = inReview ? lastPage + 1 : currentPage;

            if (currentPageNumber > 0) {
                const { pageHeadingText } = pageManagers[currentPageNumber - 1];
                return getPrevPageParam(currentPageNumber, pageHeadingText!);
            }
        }
        return '';
    }

    @computed('currentPage', 'pageManagers.[]')
    get currentPageManager() {
        const { currentPage, pageManagers } = this;
        if (typeof currentPage === 'undefined') {
            return;
        }
        if (!isEmpty(pageManagers)) {
            return pageManagers[currentPage];
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

    @task({ on: 'init' })
    initializePageManagers = task(function *(this: DraftRegistrationManager) {
        const { draftRegistration, node } = yield this.taskInstance as DraftRegistrationAndNode;
        set(this, 'draftRegistration', draftRegistration);
        set(this, 'node', node);
        const registrationSchema = yield this.draftRegistration.registrationSchema;
        const schemaBlocks: SchemaBlock[] = yield registrationSchema.loadAll('schemaBlocks');
        const pages = getPages(schemaBlocks);
        const { registrationResponses } = this.draftRegistration;

        set(this, 'lastPage', pages.length - 1);
        set(this, 'registrationResponses', registrationResponses || {});

        const pageManagers = pages.map(
            pageSchemaBlocks => new PageManager(
                pageSchemaBlocks,
                this.registrationResponses || {},
                this.node,
            ),
        );

        if (this.currentPage !== undefined) {
            if (this.currentPage <= this.lastPage) {
                set(this, 'currentPageManager', pageManagers[this.currentPage]);
                if (this.updateRoute) {
                    this.updateRoute(pageManagers[this.currentPage].pageHeadingText as string);
                }
            }
            // } else if (this.onPageNotFound) {
            //     set(this, 'pageOutOfBounds', true);
            //     // this.onPageNotFound();
            // }
        }

        set(this, 'pageManagers', pageManagers);
    });

    @task({ restartable: true })
    onInput = task(function *(this: DraftRegistrationManager) {
        yield timeout(5000); // debounce
        if (this.currentPageManager && this.currentPageManager.schemaBlockGroups) {
            this.updateRegistrationResponses(this.currentPageManager);

            this.draftRegistration.setProperties({
                registrationResponses: this.registrationResponses,
            });

            try {
                yield this.draftRegistration.save();
            } catch (error) {
                // this.toast.error('Save failed');
                throw error;
            }
        }
    });

    @task({ restartable: true })
    saveAllVisitedPages = task(function *(this: DraftRegistrationManager) {
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
    });

    constructor(taskInstance: DraftRegistrationAndNode) {
        set(this, 'taskInstance', taskInstance);
        this.initializePageManagers.perform();
    }

    @action
    onPageChange(_: HTMLElement, [currentPage, inReview]: [number, boolean]) {
        if (inReview) {
            this.markAllPagesVisited();
            this.validateAllVisitedPages();
            this.saveAllVisitedPages.perform();
        } else {
            if (this.hasVisitedPages) {
                this.validateAllVisitedPages();
                this.saveAllVisitedPages.perform();
            }
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
        const { pageManagers } = this;
        const isPageIndex = Number.isInteger(currentPage);

        if (!isEmpty(pageManagers) && isPageIndex) {
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
