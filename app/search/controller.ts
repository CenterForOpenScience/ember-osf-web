import Controller from '@ember/controller';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { OnSearchParams, ResourceTypeFilterValue } from 'osf-components/components/search-page/component';

export default class SearchController extends Controller {
    @tracked cardSearchText?: string = '';
    @tracked sort?: string =  '-relevance';
    @tracked resourceType?: ResourceTypeFilterValue | null =  null;

    queryParams = ['cardSearchText', 'page', 'sort', 'resourceType'];

    @action
    onSearch(queryOptions: OnSearchParams) {
        this.cardSearchText = queryOptions.cardSearchText;
        this.sort = queryOptions.sort;
        this.resourceType = queryOptions.resourceType;
    }
}
