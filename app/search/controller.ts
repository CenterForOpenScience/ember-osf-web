import Controller from '@ember/controller';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { OnSearchParams, ResourceTypeFilterValue } from 'osf-components/components/search-page/component';

export default class SearchController extends Controller {
    @tracked q?: string = '';
    @tracked sort?: string =  '-relevance';
    @tracked resourceType?: ResourceTypeFilterValue | null = null;
    @tracked page?: string = '';

    queryParams = ['q', 'page', 'sort', 'resourceType'];

    @action
    onSearch(queryOptions: OnSearchParams) {
        this.q = queryOptions.cardSearchText;
        this.sort = queryOptions.sort;
        this.resourceType = queryOptions.resourceType;
        this.page = queryOptions.page;
    }
}
