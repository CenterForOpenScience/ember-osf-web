import { getOwner } from '@ember/application';
import EmberArray, { A } from '@ember/array';
import Controller from '@ember/controller';
import { action, computed } from '@ember/object';
import { inject as service } from '@ember/service';
import { timeout } from 'ember-concurrency';
import { task } from 'ember-concurrency-decorators';
import DS from 'ember-data';
import Intl from 'ember-intl/services/intl';
import QueryParams from 'ember-parachute';
import { is, OrderedSet } from 'immutable';

import config from 'ember-get-config';
import RegistrationProviderModel from 'ember-osf-web/models/registration-provider';
import Analytics from 'ember-osf-web/services/analytics';
import scrollTo from 'ember-osf-web/utils/scroll-to';
import discoverStyles from 'registries/components/registries-discover-search/styles';
import { SearchFilter, SearchOptions, SearchOrder, SearchResults } from 'registries/services/search';
import ShareSearch, {
    ShareRegistration,
    ShareTermsAggregation,
    ShareTermsFilter,
} from 'registries/services/share-search';

// Helper for Immutable.is as it doesn't like Native Arrays
function isEqual(obj1: any, obj2: any) {
    if (Array.isArray(obj1) && Array.isArray(obj2)) {
        if (obj1.length !== obj2.length) {
            return false;
        }

        for (let i = 0; i < obj1.length; i++) {
            if (!(isEqual(obj1[i], obj2[i]))) {
                return false;
            }
        }

        return true;
    }

    return is(obj1, obj2);
}

interface DiscoverQueryParams {
    page: number;
    query: string;
    size: number;
    sort: SearchOrder;
    registrationTypes: ShareTermsFilter[];
    sourceNames: string[];
    subjects: ShareTermsFilter[];
}

const sortOptions = [
    new SearchOrder({
        ascending: true,
        display: 'registries.discover.order.relevance',
        key: undefined,
    }),
    new SearchOrder({
        ascending: true,
        display: 'registries.discover.order.modified_ascending',
        key: 'date_updated',
    }),
    new SearchOrder({
        ascending: false,
        display: 'registries.discover.order.modified_descending',
        key: 'date_updated',
    }),
];

const queryParams = {
    sourceNames: {
        as: 'provider',
        defaultValue: [] as string[],
        serialize(value: string[]) {
            return value.join('|');
        },
        deserialize(value: string) {
            return value.split('|');
        },
    },
    registrationTypes: {
        as: 'type',
        refresh: true,
        defaultValue: [] as ShareTermsFilter[],
        serialize(value: ShareTermsFilter[]) {
            return value.map(filter => filter.value).join('|');
        },
        deserialize(value: string) {
            // Handle empty strings
            if (value.trim().length < 1) {
                return [];
            }
            return value.split('|').map(
                registrationType => new ShareTermsFilter('registration_type', registrationType, registrationType),
            );
        },
    },
    query: {
        as: 'q',
        defaultValue: '',
        replace: true,
    },
    size: {
        defaultValue: 10,
        serialize(value: number) {
            return value.toString();
        },
        deserialize(value: string) {
            return parseInt(value, 10) || this.defaultValue;
        },
    },
    sort: {
        defaultValue: sortOptions[0],
        serialize(value: SearchOrder) {
            if (value.key === 'date_modified') {
                return '';
            }

            return `${value.ascending ? '' : '-'}${value.key || ''}`;
        },
        deserialize(value: string) {
            return sortOptions.find(
                option => !!option.key
                    && value.endsWith(option.key)
                    && option.ascending === !value.startsWith('-'),
            ) || sortOptions[0];
        },
    },
    page: {
        defaultValue: 1,
        serialize(value: number) {
            return value.toString();
        },
        deserialize(value: string) {
            return parseInt(value, 10) || this.defaultValue;
        },
    },
    subjects: {
        defaultValue: [] as ShareTermsFilter[],
        serialize(value: ShareTermsFilter[]) {
            return value.map(filter => filter.value).join(',,');
        },
        deserialize(value: string) {
            return value.split(',,').map(
                subjectTerm => {
                    const subjectPieces = subjectTerm.split('|');
                    const display = subjectPieces[subjectPieces.length - 1];
                    return new ShareTermsFilter('subjects', subjectTerm, display);
                },
            );
        },
    },
};

export const discoverQueryParams = new QueryParams<DiscoverQueryParams>(queryParams);

export default class Discover extends Controller.extend(discoverQueryParams.Mixin) {
    @service intl!: Intl;
    @service analytics!: Analytics;
    @service store!: DS.Store;
    @service shareSearch!: ShareSearch;

    sortOptions = sortOptions;

    results: EmberArray<ShareRegistration> = A([]);
    searchable!: number;
    totalResults: number = 0;
    searchOptions!: SearchOptions;

    filterableSources: Array<{
        count: number;
        filter: SearchFilter;
    }> = [];

    // used to filter the counts/aggregations and all search results
    get additionalFilters(): ShareTermsFilter[] {
        return [];
    }

    @computed('sourceNames.[]', 'shareSearch.allRegistries.[]')
    get sourceFilters() {
        return this.sourceNames.map(
            name => this.shareSearch.allRegistries.find(r => r.name === name),
        ).filter(Boolean).map(
            source => new ShareTermsFilter('sources', source!.name, source!.display || source!.name),
        );
    }

    @computed('searchOptions', 'totalResults')
    get maxPage() {
        const max = Math.ceil(this.totalResults / this.searchOptions.size);
        if (max > (10000 / this.searchOptions.size)) {
            return Math.ceil(10000 / this.searchOptions.size);
        }
        return max;
    }

    @task({ withTestWaiter: true })
    getCountsAndAggs = task(function *(this: Discover) {
        const results: SearchResults<any> = yield this.shareSearch.registrations(new SearchOptions({
            size: 0,
            modifiers: OrderedSet([
                new ShareTermsAggregation('sources', 'sources'),
            ]),
            filters: OrderedSet([
                ...this.additionalFilters,
            ]),
        }));

        const osfProviders: RegistrationProviderModel[] = yield this.store.findAll('registration-provider', {
            adapterOptions: { queryParams: { 'page[size]': 100 } },
        });

        // Setting osfProviders on the share-search service
        const urlRegex = config.OSF.url.replace(/^https?/, '^https?');
        const filteredProviders = osfProviders.filter(provider => provider.shareSourceKey).map(provider => ({
            name: provider.shareSourceKey!, // `name` should match what SHARE calls it
            display: provider.name,
            https: true,
            urlRegex,
        }));
        this.shareSearch.set('osfProviders', filteredProviders);

        const filterableSources: Array<{count: number, filter: SearchFilter}> = [];
        /* eslint-disable camelcase */
        const buckets = results.aggregations.sources.buckets as Array<{key: string, doc_count: number}>;

        // NOTE: config.externalRegistries is iterated over here to match its order.
        for (const source of this.shareSearch.allRegistries) {
            const bucket = buckets.find(x => x.key === source.name);
            if (!bucket) {
                continue;
            }

            filterableSources.push({
                count: bucket.doc_count,
                filter: new ShareTermsFilter(
                    'sources',
                    bucket.key,
                    source.display || source.name,
                ),
            });
        }
        /* eslint-enable camelcase */

        this.set('searchable', results.total);
        this.set('filterableSources', filterableSources);
        this.doSearch.perform();
    });

    @task({ withTestWaiter: true, restartable: true })
    doSearch = task(function *(this: Discover) {
        // TODO-mob don't hard-code 'OSF'

        // Unless OSF is the only source, registration_type filters must be cleared
        if (!(this.sourceNames.length === 1 && this.sourceNames[0]! === 'OSF')) {
            this.set('registrationTypes', A([]));
        }

        // If query has changed but page has not changed reset page to 1.
        // The page check stops other tests from breaking
        if (this.searchOptions && this.searchOptions.query !== this.query && this.searchOptions.page === this.page) {
            this.set('page', 1);
        }

        let options = new SearchOptions({
            query: this.query,
            size: this.size,
            page: this.page,
            order: this.sort,
            filters: OrderedSet([
                ...this.sourceFilters,
                ...this.registrationTypes,
                ...this.subjects,
                ...this.additionalFilters,
            ]),
        });

        // If there is no query, no filters, and no sort, default to -date_modified rather
        // than relevance.
        if (!options.order.key && (!options.query || options.query === '') && options.filters.size === 0) {
            options = options.set('order', new SearchOrder({
                display: 'registries.discover.order.relevance',
                ascending: false,
                key: 'date_modified',
            }));
        }

        this.set('searchOptions', options);

        yield timeout(250);

        const results: SearchResults<ShareRegistration> = yield this.shareSearch.registrations(options);

        this.set('results', A(results.results));
        this.set('totalResults', results.total);
    });

    setup() {
        this.getCountsAndAggs.perform();
    }

    queryParamsDidChange() {
        this.doSearch.perform();
    }

    @action
    onSearchOptionsUpdated(options: SearchOptions) {
        const sources: ShareTermsFilter[] = [];
        const registrationTypes: ShareTermsFilter[] = [];
        const subjects: ShareTermsFilter[] = [];

        for (const filter of options.filters.values()) {
            if (filter.key === 'sources') {
                sources.push(filter as ShareTermsFilter);
            }

            if (filter.key === 'registration_type') {
                registrationTypes.push(filter as ShareTermsFilter);
            }

            if (filter.key === 'subjects') {
                subjects.push(filter as ShareTermsFilter);
            }
        }

        const changes = {} as Discover;

        if (!isEqual(this.sourceFilters, sources)) {
            changes.page = 1;
            changes.sourceNames = sources.map(filter => filter.value.toString());
        }

        if (!isEqual(this.registrationTypes, registrationTypes)) {
            changes.page = 1;
            changes.registrationTypes = registrationTypes;
        }

        if (!isEqual(this.subjects, subjects)) {
            changes.page = 1;
            changes.subjects = subjects;
        }

        // If any filters are changed page is reset to 1
        this.setProperties(changes);
    }

    @action
    changePage(page: number) {
        this.set('page', page);

        // Get the application owner by using
        // passed down services as rootElement
        // isn't defined on engines' owners
        const element = document.querySelector(`.${discoverStyles.Discover__Body}`) as HTMLElement;
        if (!element) {
            return;
        }
        scrollTo(getOwner(this.intl), element);
    }

    @action
    onSearch(value: string) {
        // Set page to 1 here to ensure page is always reset when updating a query
        this.setProperties({ page: 1, query: value });
        // If query or page don't actually change ember won't fire related events
        // So always kick off a doSearch task to allow forcing a "re-search"
        this.doSearch.perform();
    }

    @action
    setOrder(value: SearchOrder) {
        this.analytics.track('dropdown', 'select', `Discover - Sort By: ${this.intl.t(value.display)}`);
        // Set page to 1 here to ensure page is always reset when changing the order/sorting of a search
        this.setProperties({ page: 1, sort: value });
    }
}
