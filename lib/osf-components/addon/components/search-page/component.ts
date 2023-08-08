import { tracked } from '@glimmer/tracking';
import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import IndexCardModel from 'ember-osf-web/models/index-card';
import { waitFor } from '@ember/test-waiters';
import { taskFor } from 'ember-concurrency-ts';
import { task, timeout } from 'ember-concurrency';
import Intl from 'ember-intl/services/intl';
import { A } from '@ember/array';
import Store from '@ember-data/store';
import { action } from '@ember/object';
import Media from 'ember-responsive';

import IndexPropertySearchModel from 'ember-osf-web/models/index-property-search';
import SearchResultModel from 'ember-osf-web/models/search-result';
import ProviderModel from 'ember-osf-web/models/provider';
import uniqueId from 'ember-osf-web/utils/unique-id';

interface ResourceTypeOption {
    display: string;
    value?: ResourceTypeFilterValue | null;
}

export enum ResourceTypeFilterValue {
    Registrations = 'Registration,RegistrationComponent',
    Projects = 'Project,ProjectComponent',
    Preprints = 'Preprint',
    Users = 'User',
    Files = 'File',
}

interface SortOption {
    display: string;
    value: string;
}

export interface Filter {
    property: string;
    value: string;
}

export interface OnSearchParams {
    cardSearchText?: string;
    page?: string;
    sort?: string;
    resourceType?: ResourceTypeFilterValue | null;
}

interface SearchArgs {
    onSearch?: (obj: OnSearchParams) => void;
    query?: string;
    cardSearchText: string;
    cardSearchFilters: Filter[];
    propertyCard: IndexCardModel;
    propertySearch: SearchResultModel;
    toggleFilter: (filter: Filter) => void;
    sort: string;
    resourceType?: ResourceTypeFilterValue;
    defaultQueryOptions: Record<string, string>;
    provider?: ProviderModel;
    showResourceTypeFilter: boolean;
}

const searchDebounceTime = 100;

export default class SearchPage extends Component<SearchArgs> {
    @service intl!: Intl;
    @service toast!: Toastr;
    @service store!: Store;
    @service media!: Media;

    @tracked searchText?: string;
    @tracked searchResults?: SearchResultModel[];
    @tracked propertySearch?: IndexPropertySearchModel;
    @tracked page?: number = 1;
    @tracked totalResultCount?: number;

    constructor( owner: unknown, args: SearchArgs) {
        super(owner, args);
        this.searchText = this.args.query;
        this.sort = this.args.sort;
        this.resourceType = this.args.resourceType;
        taskFor(this.search).perform();
    }

    showTooltip1?: boolean;
    showTooltip2?: boolean;
    showTooltip3?: boolean;

    leftPanelObjectDropdownId = uniqueId(['left-panel-object-dropdown']);
    firstTopbarObjectTypeLinkId = uniqueId(['first-topbar-object-type-link']);
    searchInputWrapperId = uniqueId(['search-input-wrapper']);
    leftPanelHeaderId = uniqueId(['left-panel-header']);
    firstFilterId = uniqueId(['first-filter']);

    get tooltipTarget1Id() {
        if (this.args.showResourceTypeFilter) {
            if (this.showSidePanelToggle) {
                return this.leftPanelObjectDropdownId;
            }
            return this.firstTopbarObjectTypeLinkId;
        }
        return this.searchInputWrapperId;
    }

    get tooltipTarget2Id() {
        return this.leftPanelHeaderId;
    }

    get tooltipTarget3Id() {
        if (this.propertySearch) {
            return this.firstFilterId;
        }
        return this.leftPanelHeaderId;
    }

    get showSidePanelToggle() {
        return this.media.isMobile || this.media.isTablet;
    }

    get filterableProperties() {
        if (!this.propertySearch) {
            return [];
        }
        return this.propertySearch.get('searchResultPage');
    }

    get selectedResourceTypeOption() {
        return this.resourceTypeOptions.find(option => option.value === this.resourceType);
    }

    get showResultCountMiddle() {
        const hasResults = this.totalResultCount && this.totalResultCount > 0;
        return hasResults && !this.args.showResourceTypeFilter && !this.showSidePanelToggle;
    }

    get showResultCountLeft() {
        const hasResults = this.totalResultCount && this.totalResultCount > 0;
        return hasResults && this.showSidePanelToggle;
    }

    get selectedSortOption() {
        return this.sortOptions.find(option => option.value === this.sort);// || this.sortOptions[0];
    }

    // Resource type
    resourceTypeOptions: ResourceTypeOption[] = [
        {
            display: this.intl.t('search.resource-type.all'),
            value: null,
        },
        {
            display: this.intl.t('search.resource-type.projects'),
            value: ResourceTypeFilterValue.Projects,
        },
        {
            display: this.intl.t('search.resource-type.registrations'),
            value: ResourceTypeFilterValue.Registrations,
        },
        {
            display: this.intl.t('search.resource-type.preprints'),
            value: ResourceTypeFilterValue.Preprints,
        },
        {
            display: this.intl.t('search.resource-type.files'),
            value: ResourceTypeFilterValue.Files,
        },
        {
            display: this.intl.t('search.resource-type.users'),
            value: ResourceTypeFilterValue.Users,
        },
    ];

    // Sort
    sortOptions: SortOption[] = [
        { display: this.intl.t('search.sort.relevance'), value: '-relevance' },
        { display: this.intl.t('search.sort.created-date-descending'), value: '-date_created' },
        { display: this.intl.t('search.sort.created-date-ascending'), value: 'date_created' },
        { display: this.intl.t('search.sort.modified-date-descending'), value: '-date_modified' },
        { display: this.intl.t('search.sort.modified-date-ascending'), value: 'date_modified' },
    ];

    @tracked resourceType?: ResourceTypeFilterValue | null;
    @tracked sort: string;
    @tracked activeFilters = A<Filter>([]);

    @task({ restartable: true })
    @waitFor
    async search() {
        try {
            const cardSearchText = this.searchText;
            const { page, sort, activeFilters, resourceType } = this;
            let filterQueryObject = activeFilters.reduce((acc, filter) => {
                acc[filter.property] = filter.value;
                return acc;
            }, {} as { [key: string]: string });
            if (resourceType) {
                filterQueryObject['resourceType'] = resourceType;
            }
            filterQueryObject = { ...filterQueryObject, ...this.args.defaultQueryOptions };
            const searchResult = await this.store.queryRecord('index-card-search', {
                cardSearchText,
                page,
                sort,
                cardSearchFilter: filterQueryObject,
            });
            this.propertySearch = await searchResult.relatedPropertySearch;
            this.searchResults = searchResult.searchResultPage.toArray();
            this.totalResultCount = searchResult.totalResultCount;
            if (this.args.onSearch) {
                this.args.onSearch({cardSearchText, sort, resourceType});
            }
        } catch (e) {
            this.toast.error(e);
        }
    }

    @task({ restartable: true })
    @waitFor
    async doDebounceSearch() {
        await timeout(searchDebounceTime);
        taskFor(this.search).perform();
    }

    @action
    toggleFilter(filter: Filter) {
        const filterIndex = this.activeFilters.findIndex(
            f => f.property === filter.property && f.value === filter.value,
        );
        if (filterIndex > -1) {
            this.activeFilters.removeAt(filterIndex);
        } else {
            this.activeFilters.pushObject(filter);
        }
        taskFor(this.search).perform();
    }

    @action
    updateSort(sortOption: SortOption) {
        this.sort = sortOption.value;
        taskFor(this.search).perform();
    }

    @action
    updateResourceType(resourceTypeOption: ResourceTypeOption) {
        this.resourceType = resourceTypeOption.value;
        taskFor(this.search).perform();
    }
}
