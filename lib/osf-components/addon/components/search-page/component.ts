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

import IndexPropertySearchModel from 'ember-osf-web/models/index-property-search';
import SearchResultModel from 'ember-osf-web/models/search-result';

interface ResourceTypeOption {
    display: string;
    value: string;
}

interface SortOption {
    display: string;
    value: string;
}

export interface Filter {
    property: string;
    value: string;
}

interface SearchArgs {
    onSearch?: (obj: object) => void;
    query?: string;
    cardSearchText: string;
    cardSearchFilters: Filter[];
    propertyCard: IndexCardModel;
    propertySearch: SearchResultModel;
    toggleFilter: (filter: Filter) => void;
    sort: string;
    resourceType: string;
}

const searchDebounceTime = 100;

export default class SearchPage extends Component<SearchArgs> {
    @service intl!: Intl;
    @service toast!: Toastr;
    @service store!: Store;

    @tracked searchText?: string;
    @tracked searchResults?: SearchResultModel[];
    @tracked propertySearch?: IndexPropertySearchModel;
    @tracked page?: number = 1;

    constructor( owner: unknown, args: SearchArgs) {
        super(owner, args);
        this.searchText = this.args.query;
        this.sort = this.args.sort;
        this.resourceType = this.args.resourceType;
        taskFor(this.search).perform();
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

    get selectedSortOption() {
        return this.sortOptions.find(option => option.value === this.sort);// || this.sortOptions[0];
    }

    // Resource type
    resourceTypeOptions: ResourceTypeOption[] = [
        { display: this.intl.t('search.resource-type.all'), value: 'All' },
        { display: this.intl.t('search.resource-type.projects'), value: 'Projects' },
        { display: this.intl.t('search.resource-type.registrations'), value: 'Registrations' },
        { display: this.intl.t('search.resource-type.preprints'), value: 'Preprints' },
        { display: this.intl.t('search.resource-type.files'), value: 'Files' },
        { display: this.intl.t('search.resource-type.users'), value: 'Users' },
    ];

    // Sort
    sortOptions: SortOption[] = [
        { display: this.intl.t('search.sort.relevance'), value: '-relevance' },
        { display: this.intl.t('search.sort.created-date-descending'), value: '-date_created' },
        { display: this.intl.t('search.sort.created-date-ascending'), value: 'date_created' },
        { display: this.intl.t('search.sort.modified-date-descending'), value: '-date_modified' },
        { display: this.intl.t('search.sort.modified-date-ascending'), value: 'date_modified' },
    ];

    @tracked resourceType: string;
    @tracked sort: string;
    @tracked activeFilters = A<Filter>([]);

    @task({ restartable: true })
    @waitFor
    async search() {
        try {
            const q = this.searchText;
            const { page, sort, activeFilters, resourceType } = this;
            const filterQueryObject = activeFilters.reduce((acc, filter) => {
                acc[filter.property] = filter.value;
                return acc;
            }, {} as { [key: string]: string });
            filterQueryObject['resourceType'] = resourceType;
            const searchResult = await this.store.queryRecord('index-card-search', {
                q,
                page,
                sort,
                filter: filterQueryObject,
            });
            this.propertySearch = await searchResult.relatedPropertySearch;
            this.searchResults =  searchResult.searchResultPage.toArray();
            if (this.args.onSearch) {
                this.args.onSearch({q, sort, resourceType});
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
