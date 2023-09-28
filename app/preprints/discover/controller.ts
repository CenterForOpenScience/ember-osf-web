
import Store from '@ember-data/store';
import Controller from '@ember/controller';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import config from 'ember-osf-web/config/environment';

import Theme from 'ember-osf-web/services/theme';
import pathJoin from 'ember-osf-web/utils/path-join';
import { Filter, OnSearchParams } from 'osf-components/components/search-page/component';

export default class PreprintDiscoverController extends Controller {
    @service store!: Store;
    @service theme!: Theme;

    @tracked q?: string = '';
    @tracked sort?: string = '-relevance';
    @tracked activeFilters?: Filter[] = [];

    queryParams = ['q', 'sort', 'activeFilters'];

    get defaultQueryOptions() {
        return {
            // TODO: get this from the API?
            publisher: pathJoin(config.OSF.url, 'preprints', this.theme.id),
        };
    }

    @action
    onSearch(queryOptions: OnSearchParams) {
        this.q = queryOptions.cardSearchText;
        this.sort = queryOptions.sort;
        this.activeFilters = queryOptions.activeFilters;
    }
}
