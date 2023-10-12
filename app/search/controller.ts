import Controller from '@ember/controller';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { Filter, OnSearchParams, ResourceTypeFilterValue } from 'osf-components/components/search-page/component';

export default class SearchController extends Controller {
    @tracked q?: string = '';
    @tracked sort?: string =  '-relevance';
    @tracked resourceType?: ResourceTypeFilterValue | null = null;
    @tracked activeFilters?: Filter[] = [];

    queryParams = ['q', 'sort', 'resourceType', 'activeFilters'];

    @action
    onSearch(queryOptions: OnSearchParams) {
        this.q = queryOptions.cardSearchText;
        this.sort = queryOptions.sort;
        this.resourceType = queryOptions.resourceType;
        this.activeFilters = queryOptions.activeFilters;
    }
}
