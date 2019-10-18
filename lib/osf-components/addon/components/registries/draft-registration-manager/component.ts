import { tagName } from '@ember-decorators/component';
import { action, computed } from '@ember-decorators/object';
import { alias } from '@ember-decorators/object/computed';
import Component from '@ember/component';
import { assert } from '@ember/debug';
import { task, TaskInstance, timeout } from 'ember-concurrency';

import { layout } from 'ember-osf-web/decorators/component';
import DraftRegistration from 'ember-osf-web/models/draft-registration';
import RegistrationSchema from 'ember-osf-web/models/registration-schema';
import SchemaBlock from 'ember-osf-web/models/schema-block';

import { getPages, PageManager, RegistrationResponse } from 'ember-osf-web/packages/registration-schema';
import { getNextPageParam, getPrevPageParam } from 'ember-osf-web/utils/page-param';
import template from './template';

export interface DraftRegistrationManager {
    registrationResponsesisValid: boolean;
    registrationResponses: RegistrationResponse;
    currentPageManager: PageManager;
    pageManagers: PageManager[];
    currentPage: number;
    draftId: string;
    nextPageParam: string;
    prevPageParam: string;
    autoSaving: boolean;
    schemaBlocks: SchemaBlock[];
    lastPage: number;
    initializing: boolean;

    onInput(): void;
    submitDraftRegistration(): void;
    validateRegistrationResponses(): void;
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
        yield timeout(500); // debounce

        if (this.currentPageManager && this.currentPageManager.schemaBlockGroups) {
            const { changeset } = this.currentPageManager;
            const { registrationResponses } = this;

            this.currentPageManager.schemaBlockGroups
                .mapBy('registrationResponseKey')
                .filter(Boolean)
                .forEach(registrationResponseKey => {
                    Object.assign(
                        registrationResponses,
                        { [registrationResponseKey]: changeset!.get(registrationResponseKey) },
                    );
                });

            this.draftRegistration.setProperties({
                registrationResponses,
            });

            yield this.draftRegistration.save();
        }
    }).restartable(),

    submitDraftRegistration: task(function *(this: DraftRegistrationManagerComponent) {
        yield this.draftRegistration.save();
    }),

}) {
    // Required
    modelTaskInstance!: TaskInstance<DraftRegistration>;

    // Optional
    updateRoute?: (headingText: string) => void;
    onPageNotFound?: () => void;

    // Private
    registrationSchema!: RegistrationSchema;
    draftRegistration!: DraftRegistration;
    currentPage!: number;
    lastPage!: number;
    registrationResponses!: RegistrationResponse;
    schemaBlocks!: SchemaBlock[];
    inReview!: boolean;

    pageManagers: PageManager[] = [];

    @alias('onInput.isRunning') autoSaving!: boolean;
    @alias('initializePageManagers.isRunning') initializing!: boolean;

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

    @action
    validateRegistrationResponses() {
        this.pageManagers.forEach(pageManager => {
            pageManager.changeset!.validate();
        });
    }
}
