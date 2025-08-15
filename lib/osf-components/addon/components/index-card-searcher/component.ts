import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';
import { waitFor } from '@ember/test-waiters';
import { restartableTask, timeout } from 'ember-concurrency';
import Store from '@ember-data/store';
import Toast from 'ember-toastr/services/toast';

import SearchResultModel from 'ember-osf-web/models/search-result';
import { taskFor } from 'ember-concurrency-ts';
import RelatedPropertyPathModel, { SuggestedFilterOperators } from 'ember-osf-web/models/related-property-path';
import IndexCardSearchModel from 'ember-osf-web/models/index-card-search';

interface IndexCardSearcherArgs {
    queryOptions: Record<string, any>;
    debounceTime?: number;
}

export default class IndexCardSearcher extends Component<IndexCardSearcherArgs> {
    @service store!: Store;
    @service toast!: Toast;

    debounceTime = this.args.debounceTime || 1000;

    @tracked searchResults: SearchResultModel[] = [];
    @tracked totalResultCount: number | string = 0;

    @tracked relatedProperties?: RelatedPropertyPathModel[] = [];
    @tracked booleanFilters?: RelatedPropertyPathModel[] = [];

    @tracked latestIndexCardSearch?: IndexCardSearchModel;
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

            this.booleanFilters = searchResult.relatedProperties
                .filterBy('suggestedFilterOperator', SuggestedFilterOperators.IsPresent);
            this.relatedProperties = searchResult.relatedProperties.filter(
                (property: RelatedPropertyPathModel) =>
                    property.suggestedFilterOperator !== SuggestedFilterOperators.IsPresent, // AnyOf or AtDate
            );
            this.latestIndexCardSearch = searchResult;
            this.firstPageCursor = searchResult.firstPageCursor;
            this.nextPageCursor = searchResult.nextPageCursor;
            this.prevPageCursor = searchResult.prevPageCursor;
            this.searchResults = searchResult.searchResultPage.toArray();
            this.totalResultCount = searchResult.displayCount;

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
