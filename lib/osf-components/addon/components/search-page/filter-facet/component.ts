import Store from '@ember-data/store';
import { getOwner } from '@ember/application';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { waitFor } from '@ember/test-waiters';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { task, timeout } from 'ember-concurrency';
import { taskFor } from 'ember-concurrency-ts';
import IntlService from 'ember-intl/services/intl';
import GetLocalizedPropertyHelper from 'ember-osf-web/helpers/get-localized-property';

import SearchResultModel from 'ember-osf-web/models/search-result';

import { Filter } from '../component';

interface FilterFacetArgs {
    cardSearchText: string;
    cardSearchFilter: Filter[];
    property: SearchResultModel;
    toggleFilter: (filter: Filter) => void;
}

const searchDebounceTime = 500;

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
    @tracked showSeeMoreButton = false;

    getLocalizedString = new GetLocalizedPropertyHelper(getOwner(this));

    get propertyCard() {
        return this.args.property.get('indexCard');
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
            const { toggleFilter } = this.args;
            const card = this.selectedProperty.indexCard;
            const filter = {
                property: this.propertyCard.get('label'),
                label: card.label,
                value: card.resourceId,
            };
            toggleFilter(filter);
            this.selectedProperty = null;
        }
    }

    @task({ restartable: true })
    @waitFor
    async debouncedValueSearch(filterString: string) {
        await timeout(searchDebounceTime);
        await taskFor(this.fetchFacetValues).perform(filterString);
    }

    @task
    @waitFor
    async fetchFacetValues(filterString?: string) {
        const { cardSearchText, cardSearchFilter } = this.args;
        const { page, sort } = this;
        const valueSearch = await this.store.queryRecord('index-value-search', {
            cardSearchText,
            cardSearchFilter,
            valueSearchPropertyPath: this.propertyCard.get('label'),
            valueSearchText: filterString || '',
            page,
            sort,
        });
        const searchResultPage = valueSearch.get('searchResultPage');
        this.showSeeMoreButton = Boolean(searchResultPage.links.next);
        const results = searchResultPage.toArray();
        this.filterableValues = results;
    }
}
