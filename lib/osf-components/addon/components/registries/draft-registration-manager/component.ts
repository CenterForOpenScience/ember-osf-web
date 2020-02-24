import { tagName } from '@ember-decorators/component';
import Component from '@ember/component';
import { assert } from '@ember/debug';
import { action, computed, set } from '@ember/object';
import { alias, filterBy, not, notEmpty } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import { isEmpty } from '@ember/utils';
import { timeout } from 'ember-concurrency';
import { task } from 'ember-concurrency-decorators';
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
    draftRegistration: DraftRegistration;
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
export default class DraftRegistrationManagerComponent extends Component {
    // Required
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
    @filterBy('pageManagers', 'isVisited', true) visitedPages!: PageManager[];
    @notEmpty('visitedPages') hasVisitedPages!: boolean;

    @computed('currentPage', 'pageManagers.[]')
    get nextPageParam() {
        const { pageManagers, currentPage, lastPage } = this;

        if (!isEmpty(pageManagers) && (currentPage < lastPage)) {
            const { pageHeadingText } = pageManagers[currentPage + 1];
            return getNextPageParam(currentPage, pageHeadingText!);
        }
        return '';
    }

    @computed('currentPage', 'pageManagers.[]', 'inReview')
    get prevPageParam() {
        const { pageManagers, inReview, lastPage, currentPage } = this;

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
    initializePageManagers = task(function *(this: DraftRegistrationManagerComponent) {
        assert(
            'registries::draft-registration-manager requires @draftRegistration!',
            Boolean(this.draftRegistration),
        );
        assert(
            'registries::draft-registration-manager requires @node!',
            Boolean(this.node),
        );

        const {
            draftRegistration,
            draftRegistration: { registrationResponses = {} },
            inReview, currentPage, node,
        } = this;

        const registrationSchema = yield draftRegistration.registrationSchema;
        const schemaBlocks: SchemaBlock[] = yield registrationSchema.loadAll('schemaBlocks');
        const pages = getPages(schemaBlocks);

        this.setProperties({
            schemaBlocks,
            lastPage: pages.length - 1,
            registrationResponses,
        });

        const pageManagers = pages.map(
            pageSchemaBlocks => new PageManager(
                pageSchemaBlocks,
                registrationResponses,
                node,
            ),
        );

        if (!inReview) {
            if (currentPage <= this.lastPage) {
                if (this.updateRoute) {
                    this.updateRoute(pageManagers[currentPage].pageHeadingText as string);
                }
            } else if (this.onPageNotFound) {
                this.onPageNotFound();
            }
        }

        this.setProperties({ pageManagers });
    });

    @task({ restartable: true })
    onInput = task(function *(this: DraftRegistrationManagerComponent) {
        yield timeout(5000); // debounce

        const {
            currentPageManager,
            draftRegistration,
            registrationResponses,
        } = this;

        if (currentPageManager && currentPageManager.schemaBlockGroups) {
            this.updateRegistrationResponses(currentPageManager);

            draftRegistration.setProperties({ registrationResponses });

            try {
                yield draftRegistration.save();
            } catch (error) {
                this.toast.error('Save failed');
                throw error;
            }
        }
    });

    @task({ restartable: true })
    saveAllVisitedPages = task(function *(this: DraftRegistrationManagerComponent) {
        const {
            pageManagers,
            draftRegistration, visitedPages,
            registrationResponses,
        } = this;

        if (!isEmpty(pageManagers)) {
            visitedPages.forEach(this.updateRegistrationResponses.bind(this));
            draftRegistration.setProperties({ registrationResponses });

            yield draftRegistration.save();
        }
    });

    @action
    onPageChange(_: HTMLElement, [currentPage, inReview, onLoad]: [number, boolean, boolean]) {
        if (inReview) {
            this.markAllPagesVisited();
            this.saveAllVisitedPages.perform();
            if (!onLoad) {
                this.validateAllVisitedPages();
            }
        } else {
            if (this.hasVisitedPages) {
                this.saveAllVisitedPages.perform();
                if (!onLoad) {
                    this.validateAllVisitedPages();
                }
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
