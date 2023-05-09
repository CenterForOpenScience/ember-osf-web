import Store from '@ember-data/store';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { waitFor } from '@ember/test-waiters';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { task, timeout } from 'ember-concurrency';
import { taskFor } from 'ember-concurrency-ts';
import IntlService from 'ember-intl/services/intl';

import MetadataRecordModel from 'ember-osf-web/models/metadata-record';
import SearchResultModel from 'ember-osf-web/models/search-result';

import { Filter } from '../../controller';

interface FilterFacetArgs {
    recordSearchText: string;
    recordSearchFilters: Filter[];
    propertyRecord: MetadataRecordModel;
    propertySearch: SearchResultModel;
    toggleFilter: (filter: Filter) => void;
}

export default class FilterFacet extends Component<FilterFacetArgs> {
    @service store!: Store;
    @service intl!: IntlService;
    @service toast!: Toastr;

    @tracked page = 1;
    @tracked sort = '-relevance';
    @tracked collapsed = true;
    @tracked filterableProperties: SearchResultModel[] = [];
    @tracked seeMoreModalShown = false;
    @tracked selectedProperty?: SearchResultModel;

    get showSeeMoreButton() {
        // TODO: make this actually check if there are more
        return true;
    }

    @action
    toggleFacet() {
        if (this.filterableProperties.length === 0 && !taskFor(this.fetchFacetValues).lastComplete) {
            taskFor(this.fetchFacetValues).perform();
        }
        this.collapsed = !this.collapsed;
    }

    @action
    updateSelectedProperty(property: SearchResultModel) {
        this.selectedProperty = property;
    }

    @task
    @waitFor
    async applySelectedProperty() {
        if (this.selectedProperty) {
            const { toggleFilter, propertyRecord } = this.args;
            const record = await this.selectedProperty.metadataRecord;
            const filter = {
                property: propertyRecord.get('label'),
                value: record.title,
            };
            toggleFilter(filter);
            this.selectedProperty = undefined;
        }
    }

    @task
    @waitFor
    async fetchFacetValues() {
        await timeout(1000);
        const { recordSearchText, recordSearchFilters } = this.args;
        const { page, sort } = this;
        const valueSearch = await this.store.queryRecord('metadata-value-search', {
            recordSearchText,
            recordSearchFilters,
            page,
            sort,
        });
        const results = valueSearch.get('searchResultPage').toArray();
        this.filterableProperties = results;
    }
}
