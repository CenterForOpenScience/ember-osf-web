import Store from '@ember-data/store';
import { A } from '@ember/array';
import Controller from '@ember/controller';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { waitFor } from '@ember/test-waiters';
import { tracked } from '@glimmer/tracking';
import { task, timeout } from 'ember-concurrency';
import { taskFor } from 'ember-concurrency-ts';
import Intl from 'ember-intl/services/intl';
import Media from 'ember-responsive';

import IndexPropertySearchModel from 'ember-osf-web/models/index-property-search';
import SearchResultModel from 'ember-osf-web/models/search-result';
export interface Filter {
    property: string;
    value: string;
}

interface ResourceTypeOption {
    display: string;
    value: string;
}

interface SortOption {
    display: string;
    value: string;
}

const searchDebounceTime = 100;

export default class SearchController extends Controller {
    @service intl!: Intl;
    @service store!: Store;
    @service media!: Media;
    @service toast!: Toastr;

    queryParams = ['q', 'page', 'sort', 'resourceType'];
    @tracked q?: string = '';
    @tracked seachBoxText?: string = '';

    @tracked page?: number = 1;

    showTooltip1?: boolean;
    showTooltip2?: boolean;
    showTooltip3?: boolean;
    showTooltipMobile1?: boolean;
    showTooltipMobile2?: boolean;
    showTooltipMobile3?: boolean;

    // Resource type
    resourceTypeOptions: ResourceTypeOption[] = [
        { display: this.intl.t('search.resource-type.all'), value: 'All' },
        { display: this.intl.t('search.resource-type.projects'), value: 'Projects' },
        { display: this.intl.t('search.resource-type.registrations'), value: 'Registrations' },
        { display: this.intl.t('search.resource-type.preprints'), value: 'Preprints' },
        { display: this.intl.t('search.resource-type.files'), value: 'Files' },
        { display: this.intl.t('search.resource-type.users'), value: 'Users' },
    ];

    @tracked resourceType = this.resourceTypeOptions[0].value;

    get selectedResourceTypeOption() {
        return this.resourceTypeOptions.find(option => option.value === this.resourceType);
    }

    @action
    updateResourceType(resourceTypeOption: ResourceTypeOption) {
        this.resourceType = resourceTypeOption.value;
        taskFor(this.search).perform();
    }

    // Sort
    sortOptions: SortOption[] = [
        { display: this.intl.t('search.sort.relevance'), value: '-relevance' },
        { display: this.intl.t('search.sort.created-date-descending'), value: '-date_created' },
        { display: this.intl.t('search.sort.created-date-ascending'), value: 'date_created' },
        { display: this.intl.t('search.sort.modified-date-descending'), value: '-date_modified' },
        { display: this.intl.t('search.sort.modified-date-ascending'), value: 'date_modified' },
    ];

    @tracked sort: string = this.sortOptions[0].value;

    get selectedSortOption() {
        return this.sortOptions.find(option => option.value === this.sort);// || this.sortOptions[0];
    }

    @action
    updateSort(sortOption: SortOption) {
        this.sort = sortOption.value;
        taskFor(this.search).perform();
    }

    @tracked activeFilters = A<Filter>([]);

    @tracked searchResults?: SearchResultModel[];
    @tracked propertySearch?: IndexPropertySearchModel;

    get showSidePanelToggle() {
        return this.media.isMobile || this.media.isTablet;
    }

    get filterableProperties() {
        if (!this.propertySearch) {
            return [];
        }
        return this.propertySearch.get('searchResultPage');
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
    ingestQueryParams() {
        const { q } = this;
        if (q) {
            this.seachBoxText = q;
        }
    }

    @task({ restartable: true })
    @waitFor
    async doDebounceSearch() {
        await timeout(searchDebounceTime);
        this.q = this.seachBoxText;
        taskFor(this.search).perform();
    }

    @task({ restartable: true, on: 'init' })
    @waitFor
    async search() {
        try {
            const { q, page, sort, activeFilters, resourceType } = this;
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
        } catch (e) {
            this.toast.error(e);
        }
    }
}
