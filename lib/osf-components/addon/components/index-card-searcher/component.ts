import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';
import { waitFor } from '@ember/test-waiters';
import { restartableTask, timeout } from 'ember-concurrency';
import Store from '@ember-data/store';
import Toast from 'ember-toastr/services/toast';

import SearchResultModel from 'ember-osf-web/models/search-result';
import { taskFor } from 'ember-concurrency-ts';
import RelatedPropertyPathModel from 'ember-osf-web/models/related-property-path';

interface IndexCardSearcherArgs {
    queryOptions: Record<string, any>;
    debounceTime?: number;
}

export default class IndexCardSearcher extends Component<IndexCardSearcherArgs> {
    @service store!: Store;
    @service toast!: Toast;

    debounceTime = this.args.debounceTime || 1000;

    @tracked searchResults: SearchResultModel[] = [];
    @tracked totalResultCount = 0;

    @tracked relatedProperties?: RelatedPropertyPathModel[] = [];

    @tracked firstPageCursor?: string;
    @tracked nextPageCursor?: string;
    @tracked prevPageCursor?: string;

    get showFirstPageOption() {
        return this.hasPrevPage && this.prevPageCursor !== this.firstPageCursor;
    }

    get hasNextPage() {
        return Boolean(this.nextPageCursor);
    }

    get hasPrevPage() {
        return Boolean(this.prevPageCursor);
    }

    constructor(owner: unknown, args: IndexCardSearcherArgs) {
        super(owner, args);
        taskFor(this.searchObjectsTask).perform();
    }

    get isLoading() {
        return taskFor(this.searchObjectsTask).isRunning;
    }

    @restartableTask
    @waitFor
    async searchObjectsTask() {
        try {
            const searchResult = await this.store.queryRecord('index-card-search', this.args.queryOptions);

            this.relatedProperties = await searchResult.relatedProperties;
            this.firstPageCursor = searchResult.firstPageCursor;
            this.nextPageCursor = searchResult.nextPageCursor;
            this.prevPageCursor = searchResult.prevPageCursor;
            this.searchResults = searchResult.searchResultPage.toArray();
            this.totalResultCount = searchResult.totalResultCount;

            return searchResult;
        } catch (error) {
            this.toast.error(error);
        }
    }

    @restartableTask
    @waitFor
    async debouceSearchObjectsTask() {
        await timeout(this.debounceTime);
        return taskFor(this.searchObjectsTask).perform();
    }
}
