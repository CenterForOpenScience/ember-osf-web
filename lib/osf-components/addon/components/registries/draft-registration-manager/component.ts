import { tagName } from '@ember-decorators/component';
import { computed } from '@ember-decorators/object';
import { alias } from '@ember-decorators/object/computed';
import Component from '@ember/component';
import { assert } from '@ember/debug';
import { task, TaskInstance, timeout } from 'ember-concurrency';

import { layout } from 'ember-osf-web/decorators/component';
import DraftRegistration from 'ember-osf-web/models/draft-registration';
import RegistrationSchema from 'ember-osf-web/models/registration-schema';

import SchemaBlockModel from 'ember-osf-web/models/schema-block';
import { getPages, PageManager, RegistrationResponse } from 'ember-osf-web/packages/registration-schema';
import { getNextPageParam, getPrevPageParam } from 'ember-osf-web/utils/page-param';
import template from './template';

export interface DraftRegistrationManager {
    registrationResponsesisValid: boolean;
    currentPageManager: PageManager;
    pageManagers: PageManager[];
    currentPage: number;
    draftId: string;
    nextPageParam: string;
    prevPageParam: string;
    autoSaving: boolean;

    onInput(): void;
    submitDraftRegistration(): void;
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
        const blocks: SchemaBlockModel[] = yield registrationSchema.loadAll('schemaBlocks');
        const pages = getPages(blocks);
        const { registrationResponses } = this.draftRegistration;

        this.setProperties({
            lastPage: pages.length - 1,
            registrationResponses: registrationResponses || {},
        });

        const pageManagers = pages.map(
            pageSchemaBlocks => new PageManager(
                pageSchemaBlocks,
                this.registrationResponses || {},
            ),
        );

        if (this.currentPage <= this.lastPage) {
            if (this.updateRoute) {
                this.updateRoute(pageManagers[this.currentPage].pageHeadingText as string);
            }
        } else if (this.onPageNotFound) {
            this.onPageNotFound();
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
                        { [registrationResponseKey]: changeset.get(registrationResponseKey) },
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

    pageManagers: PageManager[] = [];

    @alias('onInput.isRunning') autoSaving!: boolean;

    @computed('currentPage', 'pageManagers.[]')
    get nextPageParam() {
        if (this.pageManagers.length && (this.currentPage < this.lastPage)) {
            const { pageHeadingText } = this.pageManagers[this.currentPage + 1];
            return getNextPageParam(this.currentPage, pageHeadingText);
        }
        return '';
    }

    @computed('currentPage', 'pageManagers.[]')
    get prevPageParam() {
        if (this.pageManagers.length && (this.currentPage > 0)) {
            const { pageHeadingText } = this.pageManagers[this.currentPage - 1];
            return getPrevPageParam(this.currentPage, pageHeadingText);
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
}
