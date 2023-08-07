import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import CurrentUser from 'ember-osf-web/services/current-user';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import pathJoin from 'ember-osf-web/utils/path-join';
import config from 'ember-get-config';
import { OnSearchParams, ResourceTypeFilterValue } from 'osf-components/components/search-page/component';

export default class InstitutionDiscoverController extends Controller {
    @service currentUser!: CurrentUser;

    @tracked cardSearchText?: string = '';
    @tracked sort?: string =  '-relevance';
    @tracked resourceType?: ResourceTypeFilterValue | null = null;

    queryParams = ['q', 'page', 'sort', 'resourceType'];

    get defaultQueryOptions() {
        return {
            publisher: pathJoin(config.OSF.url, 'institutions', this.model.id),
        };
    }

    @action
    onSearch(queryOptions: OnSearchParams) {
        this.cardSearchText = queryOptions.cardSearchText;
        this.sort = queryOptions.sort;
        this.resourceType = queryOptions.resourceType;
    }
}
