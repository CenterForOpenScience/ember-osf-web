import Store from '@ember-data/store';
import { A } from '@ember/array';
import Controller from '@ember/controller';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { waitFor } from '@ember/test-waiters';
import { tracked } from '@glimmer/tracking';
import { task, timeout } from 'ember-concurrency';
import { taskFor } from 'ember-concurrency-ts';
import Media from 'ember-responsive';

import MetadataPropertySearchModel from 'ember-osf-web/models/metadata-property-search';
export interface Filter {
    property: string;
    value: string;
}

const searchDebounceTime = 100;

export default class SearchController extends Controller {
    @service store!: Store;
    @service media!: Media;
    @service toast!: Toastr;

    queryParams = ['q', 'page', 'sort'];
    @tracked q?: string = '';
    @tracked page?: number = 1;
    @tracked sort?: string = '-relevance';
    @tracked activeFilters = A<Filter>([]);

    @tracked propertySearch?: MetadataPropertySearchModel;

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
    doSearch() {
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
        this.doSearch();
    }

    @task({ restartable: true, on: 'init' })
    @waitFor
    async search() {
        // debounce
        await timeout(searchDebounceTime);
        try {
            const { q, page, sort, activeFilters } = this;
            const filterQueryObject = activeFilters.reduce((acc, filter) => {
                acc[filter.property] = filter.value;
                return acc;
            }, {} as { [key: string]: string });
            const searchResult = await this.store.queryRecord('metadata-record-search', {
                q,
                page,
                sort,
                filter: filterQueryObject,
            });

            this.propertySearch = searchResult.relatedPropertySearch;
        } catch (e) {
            this.toast.error(e);
        }
    }
}
