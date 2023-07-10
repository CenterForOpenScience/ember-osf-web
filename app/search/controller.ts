import Controller from '@ember/controller';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

export default class SearchController extends Controller {
    @tracked q?: string = '';
    @tracked sort?: string =  '-relevance';
    @tracked resourceType?: string =  'All';

    queryParams = ['q', 'page', 'sort', 'resourceType'];

    @action
    onSearch(queryOptions: Record<string, string>) {
        this.q = queryOptions.q;
        this.sort = queryOptions.sort;
        this.resourceType = queryOptions.resourceType;
    }
}
