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

    @tracked page = '';
    @tracked sort = '-relevance';
    @tracked collapsed = true;
    @tracked filterableValues: SearchResultModel[] = [];
    @tracked modalValueOptions: SearchResultModel[] = [];
    @tracked seeMoreModalShown = false;
    @tracked selectedProperty: SearchResultModel | null = null;
    @tracked showSeeMoreButton = false;
    @tracked filterString = '';
    @tracked hasMoreValueOptions = false;
    @tracked nextPageCursor = '';

    getLocalizedString = new GetLocalizedPropertyHelper(getOwner(this));

    get propertyCard() {
        return this.args.property.get('indexCard');
    }

    get propertyShortFormLabel() {
        return this.getLocalizedString.compute([this.propertyCard.get('resourceMetadata'), 'shortFormLabel']);
    }

    get propertyVisibleLabel() {
        return this.propertyCard.get('label');
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

    @action
    openSeeMoreModal() {
        this.seeMoreModalShown = true;
        this.modalValueOptions = [...this.filterableValues];
    }

    @task
    @waitFor
    async applySelectedProperty() {
        if (this.selectedProperty) {
            const { toggleFilter } = this.args;
            const card = this.selectedProperty.indexCard;
            const filter = {
                propertyVisibleLabel: this.propertyVisibleLabel,
                propertyShortFormLabel: this.propertyShortFormLabel,
                label: card.get('label'),
                value: card.get('resourceId'),
            };
            toggleFilter(filter);
            this.selectedProperty = null;
        }
    }

    @task({ restartable: true })
    @waitFor
    async debouncedValueSearch(filterString: string) {
        await timeout(searchDebounceTime);
        this.filterString = filterString;
        this.page = '';
        this.modalValueOptions = [];
        await taskFor(this.fetchFacetValues).perform();
    }

    @task
    @waitFor
    async loadMoreValues() {
        this.page = this.nextPageCursor;
        await taskFor(this.fetchFacetValues).perform();
    }

    @task
    @waitFor
    async fetchFacetValues() {
        const { cardSearchText, cardSearchFilter } = this.args;
        const { page, sort, filterString } = this;
        const valueSearch = await this.store.queryRecord('index-value-search', {
            cardSearchText,
            cardSearchFilter,
            valueSearchPropertyPath: this.propertyShortFormLabel,
            valueSearchText: filterString || '',
            'page[cursor]': page,
            sort,
        });
        const searchResultPage = valueSearch.get('searchResultPage');
        const results = searchResultPage.toArray();
        if (!this.seeMoreModalShown) {
            this.filterableValues = results;
            this.showSeeMoreButton = Boolean(searchResultPage.links?.next);
        }
        this.modalValueOptions = [...this.modalValueOptions, ...results];
        this.hasMoreValueOptions = Boolean(searchResultPage.links?.next);
        if (searchResultPage.links?.next) {
            this.nextPageCursor = new URL(searchResultPage.links.next.href).searchParams.get('page[cursor]') || '';
        } else {
            this.nextPageCursor = '';
        }
    }
}
