import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import Features from 'ember-feature-flags/services/features';

import IndexCardSearchModel from 'ember-osf-web/models/index-card-search';
import InstitutionModel from 'ember-osf-web/models/institution';
import { SuggestedFilterOperators } from 'ember-osf-web/models/related-property-path';
import SearchResultModel from 'ember-osf-web/models/search-result';
import { Filter } from 'osf-components/components/search-page/component';
import { waitFor } from '@ember/test-waiters';
import { task } from 'ember-concurrency';
import Toast from 'ember-toastr/services/toast';
import Intl from 'ember-intl/services/intl';
import Store from '@ember-data/store';
import CurrentUser from 'ember-osf-web/services/current-user';
import {MessageTypeChoices} from 'ember-osf-web/models/user-message';
import {RequestTypeChoices} from 'ember-osf-web/models/node-request';

import config from 'ember-osf-web/config/environment';

const shareDownloadFlag = config.featureFlagNames.shareDownload;

interface Column {
    name: string;
    isSortable?: boolean;
    sortParam?: string;
    propertyPathKey?: string;
}
interface ValueColumn extends Column {
    getValue(searchResult: SearchResultModel): string;
}

interface LinkColumn extends Column {
    getHref(searchResult: SearchResultModel): string;
    getLinkText(searchResult: SearchResultModel): string;
    type: 'link';
}

interface ComponentColumn extends Column {
    type: 'doi' | 'contributors';
}

export type ObjectListColumn = ValueColumn | LinkColumn | ComponentColumn;

interface InstitutionalObjectListArgs {
    institution: InstitutionModel;
    defaultQueryOptions: Record<'cardSearchFilter', Record<string, string[] | any>>;
    columns: ObjectListColumn[];
    objectType: string;
}

export default class InstitutionalObjectList extends Component<InstitutionalObjectListArgs> {
    @service features!: Features;
    @tracked activeFilters: Filter[] = [];
    @tracked page = '';
    @tracked sort = '-dateModified';
    @tracked sortParam?: string;
    @tracked visibleColumns = this.args.columns.map(column => column.name);
    @tracked dirtyVisibleColumns = [...this.visibleColumns]; // track changes to visible columns before they are saved
    @tracked selectedPermission = 'write';
    @tracked projectRequestModalShown = false;
    @tracked activeTab = 'request-access'; // Default tab
    @tracked messageText = '';
    @tracked bccSender = false;
    @tracked replyTo = false;
    @tracked selectedUserId = '';
    @tracked selectedNodeId = '';
    @tracked showSendMessagePrompt = false;
    @service toast!: Toast;
    @service intl!: Intl;
    @service store!: Store;
    @service currentUser!: CurrentUser;


    get queryOptions() {
        const options = {
            cardSearchFilter: {
                ...this.args.defaultQueryOptions.cardSearchFilter,
            },
            'page[cursor]': this.page,
            'page[size]': 10,
            // sort can look like `sort=dateFieldName` or `sort[integer-value]=fieldName` if sortParam is provided
            sort: this.sortParam ? { [this.sortParam]: this.sort } : this.sort,
        };
        const fullQueryOptions = this.activeFilters.reduce((acc, filter: Filter) => {
            if (filter.suggestedFilterOperator === SuggestedFilterOperators.IsPresent) {
                acc.cardSearchFilter[filter.propertyPathKey] = {};
                acc.cardSearchFilter[filter.propertyPathKey][filter.value] = true;
                return acc;
            }
            const currentValue = acc.cardSearchFilter[filter.propertyPathKey];
            acc.cardSearchFilter[filter.propertyPathKey] =
                currentValue ? currentValue.concat(filter.value) : [filter.value];
            return acc;
        }, options);
        return fullQueryOptions;
    }

    get valueSearchQueryOptions() {
        return {
            ...this.queryOptions.cardSearchFilter,
        };
    }

    get showDownloadButtons() {
        return this.features.isEnabled(shareDownloadFlag);
    }

    downloadUrl(cardSearch: IndexCardSearchModel, format: string) {
        if (!cardSearch.links.self) {
            return '';
        }
        const cardSearchUrl = new URL((cardSearch.links.self as string));
        cardSearchUrl.searchParams.set('page[size]', '10000');
        cardSearchUrl.searchParams.set('acceptMediatype', format);
        cardSearchUrl.searchParams.set('withFileName', `${this.args.objectType}-search-results`);

        const columnDownloadKeys = this.args.columns.map(column => {
            if (column.propertyPathKey && this.visibleColumns.includes(column.name)) {
                return column.propertyPathKey;
            }
            return null;
        });
        const { resourceType } = this.args.defaultQueryOptions.cardSearchFilter;

        cardSearchUrl.searchParams.set(`fields[${resourceType}]`, columnDownloadKeys.filter(Boolean).join(','));
        return cardSearchUrl.toString();
    }

    downloadCsvUrl(cardSearch: IndexCardSearchModel) {
        return this.downloadUrl(cardSearch, 'text/csv');
    }

    downloadTsvUrl(cardSearch: IndexCardSearchModel) {
        return this.downloadUrl(cardSearch, 'text/tab-separated-values');
    }

    downloadJsonUrl(cardSearch: IndexCardSearchModel) {
        return this.downloadUrl(cardSearch, 'application/json');
    }

    @action
    updateVisibleColumns() {
        this.visibleColumns = [...this.dirtyVisibleColumns];
    }

    @action
    resetColumns() {
        this.dirtyVisibleColumns = [...this.visibleColumns];
    }

    @action
    toggleColumnVisibility(columnName: string) {
        if (this.dirtyVisibleColumns.includes(columnName)) {
            this.dirtyVisibleColumns.removeObject(columnName);
        } else {
            this.dirtyVisibleColumns.pushObject(columnName);
        }
    }

    @action
    openProjectRequestModal(contributor: any) {
        this.selectedUserId = contributor.userId;
        this.selectedNodeId = contributor.nodeId;
        this.projectRequestModalShown = true;
    }

    @action
    handleBackToSendMessage() {
        this.activeTab = 'send-message';
        this.showSendMessagePrompt = false;
        setTimeout(() => {
            this.projectRequestModalShown = true; // Reopen the main modal
        }, 200);

    }

    @action
    closeSendMessagePrompt() {
        this.showSendMessagePrompt = false; // Hide confirmation modal without reopening
    }

    @action
    toggleProjectRequestModal() {
        this.projectRequestModalShown = !this.projectRequestModalShown;
    }


    @action
    toggleFilter(property: Filter) {
        this.page = '';
        if (this.activeFilters.includes(property)) {
            this.activeFilters.removeObject(property);
        } else {
            this.activeFilters.pushObject(property);
        }
    }

    @action
    updateSortKey(newSortKey: string, newSortParam?: string) {
        this.sortParam = newSortParam;
        this.page = '';
        if (this.sort === newSortKey) {
            this.sort = '-' + newSortKey;
        } else {
            this.sort = newSortKey;
        }
    }

    @action
    updatePage(newPage: string) {
        this.page = newPage;
    }

    @action
    updateSelectedPermission(permission: string) {
        this.selectedPermission = permission;
    }

    @action
    setActiveTab(tabName: string) {
        this.activeTab = tabName;
    }


    @action
    resetFields() {
        this.selectedPermission = 'write';
        this.bccSender = false;
        this.replyTo = false;
    }

    @task
    @waitFor
    async handleSend() {
        try {
            if (this.activeTab === 'send-message') {
                await this._sendUserMessage();
            } else if (this.activeTab === 'request-access') {
                await this._sendNodeRequest();
            }

            this.toast.success(
                this.intl.t('institutions.dashboard.object-list.request-project-message-modal.message_sent_success'),
            );
            this.resetFields();
        } catch (error) {
            const errorDetail = error?.errors?.[0]?.detail.user || error?.errors?.[0]?.detail || '';
            const errorCode = parseInt(error?.errors?.[0]?.status, 10);

            if (errorCode === 400 && errorDetail.includes('does not have Access Requests enabled')) {
                setTimeout(() => {
                    this.showSendMessagePrompt = true; // Timeout to allow the modal to exit
                }, 200);
            } else if ([409, 400, 403].includes(errorCode)) {
                // Handle specific errors
                this.toast.error(errorDetail);
            } else if (errorDetail.includes('Request was throttled')) {
                this.toast.error(errorDetail);
            } else if (errorDetail === 'You cannot request access to a node you contribute to.') {
                this.toast.error(errorDetail);
            } else {
                this.toast.error(
                    this.intl.t('institutions.dashboard.object-list.request-project-message-modal.message_sent_failed'),
                );
            }
        } finally {
            this.projectRequestModalShown = false; // Close the main modal
        }
    }

    async _sendUserMessage() {
        const userMessage = this.store.createRecord('user-message', {
            messageText: this.messageText.trim(),
            messageType: MessageTypeChoices.InstitutionalRequest,
            bccSender: this.bccSender,
            replyTo: this.replyTo,
            institution: this.args.institution,
            messageRecipient: this.selectedUserOsfGuid,
        });
        await userMessage.save();
    }

    async _sendNodeRequest() {
        const nodeRequest = this.store.createRecord('node-request', {
            comment: this.messageText.trim(),
            requestType: RequestTypeChoices.InstitutionalRequest,
            requestedPermission: this.selectedPermission,
            bccSender: this.bccSender,
            replyTo: this.replyTo,
            institution: this.args.institution,
            messageRecipient: this.selectedUserOsfGuid,
            target: this.selectedNodeId,
        });
        await nodeRequest.save();
    }

    get selectedUserOsfGuid() {
        const url = new URL(this.selectedUserId);
        const pathSegments = url.pathname.split('/').filter(Boolean);
        return pathSegments[pathSegments.length - 1] || ''; // Last non-empty segment
    }

}
