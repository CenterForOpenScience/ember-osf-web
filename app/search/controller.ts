import Store from '@ember-data/store';
import Controller from '@ember/controller';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { waitFor } from '@ember/test-waiters';
import { task } from 'ember-concurrency';
import { taskFor } from 'ember-concurrency-ts';
import { tracked } from '@glimmer/tracking';
import Media from 'ember-responsive';

import MetadataPropertySearchModel from 'ember-osf-web/models/metadata-property-search';

export default class SearchController extends Controller {
    @service store!: Store;
    @service media!: Media;

    queryParams = ['q', 'page', 'sort'];
    @tracked q?: string;
    @tracked page?: number;
    @tracked sort?: string;

    @tracked propertySearch?: MetadataPropertySearchModel;

    get showSidenavToggle() {
        return this.media.isMobile || this.media.isTablet;
    }

    @action
    onKeyPress(event: KeyboardEvent) {
        if (event.key === 'Enter') {
            taskFor(this.doSearch).perform();
        }
    }

    @task
    @waitFor
    async doSearch() {
        const { q, page, sort } = this;
        const searchResult = await this.store.queryRecord('metadata-record-search', {
            q,
            page,
            sort,
        });
        this.propertySearch = searchResult.relatedPropertySearch;
    }
}
