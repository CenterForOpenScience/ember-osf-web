import Store from '@ember-data/store';
import { getOwner } from '@ember/application';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { waitFor } from '@ember/test-waiters';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { task } from 'ember-concurrency';
import { taskFor } from 'ember-concurrency-ts';
import IntlService from 'ember-intl/services/intl';
import GetLocalizedPropertyHelper from 'ember-osf-web/helpers/get-localized-property';

import IndexCardModel from 'ember-osf-web/models/index-card';
import SearchResultModel from 'ember-osf-web/models/search-result';

import { Filter } from '../component';

interface FilterFacetArgs {
    cardSearchText: string;
    cardSearchFilters: Filter[];
    propertyCard: IndexCardModel;
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
    @tracked filterableValues: SearchResultModel[] = [];
    @tracked seeMoreModalShown = false;
    @tracked selectedProperty: SearchResultModel | null = null;

    getLocalizedString = new GetLocalizedPropertyHelper(getOwner(this));

    get showSeeMoreButton() {
        // TODO: make this actually check if there are more
        return true;
    }

    @action
    toggleFacet() {
        if (this.filterableValues.length === 0 && !taskFor(this.fetchFacetValues).lastComplete) {
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
            const { toggleFilter, propertyCard } = this.args;
            const card = await this.selectedProperty.indexCard;
            const filter = {
                property: this.getLocalizedString.compute([propertyCard.get('resourceMetadata'), 'label']),
                value: this.getLocalizedString.compute([card.resourceMetadata, 'title']),
            };
            toggleFilter(filter);
            this.selectedProperty = null;
        }
    }

    @task
    @waitFor
    async fetchFacetValues() {
        const { cardSearchText, cardSearchFilters } = this.args;
        const { page, sort } = this;
        const valueSearch = await this.store.queryRecord('index-value-search', {
            cardSearchText,
            cardSearchFilters,
            page,
            sort,
        });
        const results = valueSearch.get('searchResultPage').toArray();
        this.filterableValues = results;
    }
}
