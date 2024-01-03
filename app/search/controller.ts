import Controller from '@ember/controller';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import {
    Filter, OnQueryParamChangeParams, ResourceTypeFilterValue,
} from 'osf-components/components/search-page/component';

export default class SearchController extends Controller {
    @tracked cardSearchText?: string = '';
    @tracked sort?: string =  '-relevance';
    @tracked resourceType?: ResourceTypeFilterValue | null = null;
    @tracked activeFilters?: Filter[] = [];

    queryParams = ['q', 'sort', 'resourceType', 'activeFilters'];

    @action
    onQueryParamChange(queryOptions: OnQueryParamChangeParams) {
        this.q = queryOptions.cardSearchText;
        this.sort = queryOptions.sort;
        this.resourceType = queryOptions.resourceType;
        this.activeFilters = queryOptions.activeFilters;
    }
}
