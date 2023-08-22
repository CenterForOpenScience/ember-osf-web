import Store from '@ember-data/store';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { waitFor } from '@ember/test-waiters';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { task, timeout } from 'ember-concurrency';
import { taskFor } from 'ember-concurrency-ts';
import IntlService from 'ember-intl/services/intl';
import RelatedPropertyPathModel from 'ember-osf-web/models/related-property-path';

import SearchResultModel from 'ember-osf-web/models/search-result';

import { Filter } from '../component';

interface FakeIndexCard {
    resourceId: string;
    indexCard: {
        label: string,
        resourceId: string,
    };
}


interface FilterFacetArgs {
    cardSearchText: string;
    cardSearchFilter: Filter[];
    property: RelatedPropertyPathModel;
    toggleFilter: (filter: Filter) => void;
}

const searchDebounceTime = 500;

export const booleanFilterProperties = [
    'hasAnalyticCodeResource', // registrations
    'hasMaterialsResource', // registrations
    'hasPapersResource', // registrations
    'hasSupplementalResource', // registrations
    'hasDataResource', // registrations and preprints
    'hasPreregisteredAnalysisPlan', // preprints
    'hasPreregisteredStudyDesign', // preprints
    'isSupplementedBy', // preprints
    'supplements', // projects
];

export default class FilterFacet extends Component<FilterFacetArgs> {
    @service store!: Store;
    @service intl!: IntlService;
    @service toast!: Toastr;

    @tracked page = '';
    @tracked sort = '-relevance';
    @tracked collapsed = true;
    @tracked filterableValues: SearchResultModel[] | FakeIndexCard[] = [];
    @tracked modalValueOptions: SearchResultModel[] = [];
    @tracked seeMoreModalShown = false;
    @tracked selectedProperty: SearchResultModel | null = null;
    @tracked showSeeMoreButton = false;
    @tracked filterString = '';
    @tracked hasMoreValueOptions = false;
    @tracked nextPageCursor = '';

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
        this.modalValueOptions = [...this.filterableValues] as SearchResultModel[];
    }

    @task
    @waitFor
    async applySelectedProperty() {
        if (this.selectedProperty) {
            const { toggleFilter, property } = this.args;
            const card = this.selectedProperty.indexCard;
            const filter = {
                propertyVisibleLabel: property.displayLabel,
                propertyShortFormLabel: property.shortFormLabel,
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
        const { cardSearchText, cardSearchFilter, property } = this.args;
        const { page, sort, filterString } = this;
        // If the property is a boolean filter (e.g. hasDataResource), we don't want to fetch IRI values
        // SHARE API filters on these properties using:
        // `share.osf.io/api/v3/index-card-search?cardSearchFilter[hasDataResource][is-present]`
        if (booleanFilterProperties.includes(property.shortFormLabel)) {
            this.filterableValues = [
                {
                    resourceId: 'is-present',
                    indexCard: {
                        label: this.intl.t('search.filter-facet.has-resource', { resource: property.displayLabel }),
                        resourceId: 'is-present',
                    },
                },
                {
                    resourceId: 'is-absent',
                    indexCard: {
                        label: this.intl.t('search.filter-facet.no-resource', { resource: property.displayLabel }),
                        resourceId: 'is-absent',
                    },
                },
            ];
            return;
        }
        const valueSearch = await this.store.queryRecord('index-value-search', {
            cardSearchText,
            cardSearchFilter,
            valueSearchPropertyPath: property.shortFormLabel,
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
