import { action, computed } from '@ember-decorators/object';
import { service } from '@ember-decorators/service';
import EmberArray, { A } from '@ember/array';
import Controller from '@ember/controller';
import { task, timeout } from 'ember-concurrency';
import I18N from 'ember-i18n/services/i18n';
import Analytics from 'ember-osf-web/services/analytics';
import defaultTo from 'ember-osf-web/utils/default-to';
import QueryParams, { ParachuteEvent } from 'ember-parachute';
import { OrderedSet } from 'immutable';
import $ from 'jquery';
import discoverStyles from 'registries/components/registries-discover-search/styles';
import config from 'registries/config/environment';
import { SearchFilter, SearchOptions, SearchOrder, SearchResults } from 'registries/services/search';
import ShareSearch, {
    ShareRegistration,
    ShareTermsAggregation,
    ShareTermsFilter,
} from 'registries/services/share-search';
import styles from './styles';

interface DoSearchOptions {
    scrollTop?: boolean;
    noPageReset?: boolean;
}

interface DiscoverQueryParams {
    page: number;
    query: string;
    registrationTypes: string[];
    size: number;
    sort: string;
    sources: string[];
}

const queryParams = {
    sources: {
        as: 'provider',
        defaultValue: [],
        // refresh: true,
        serialize(value: string[]) {
            return value.join('|');
        },
        deserialize(value: string) {
            if (value.trim().length < 1) {
                return [];
            }
            return value.split(/OR|\|/);
        },
    },
    registrationTypes: {
        as: 'type',
        refresh: true,
        defaultValue: [],
        serialize(value: string[]) {
            return value.join('|');
        },
        deserialize(value: string) {
            if (value.trim().length < 1) {
                return [];
            }
            return value.split(/OR|\|/);
        },
    },
    query: {
        as: 'q',
        defaultValue: '',
        // refresh: true,
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
        // refresh: true,
    },
    sort: {
        defaultValue: '',
        // refresh: true,
    },
    page: {
        defaultValue: 1,
        // refresh: true,
        serialize(value: number) {
            return value.toString();
        },
        deserialize(value: string) {
            return parseInt(value, 10) || this.defaultValue;
        },
    },
};

export const discoverQueryParams = new QueryParams<DiscoverQueryParams>(queryParams);

export default class Discover extends Controller.extend(discoverQueryParams.Mixin, {
    getCountsAndAggs: task(function *(this: Discover) {
        const results: SearchResults<any> = yield this.shareSearch.registrations(new SearchOptions({
            size: 0,
            modifiers: OrderedSet([
                new ShareTermsAggregation('sources', 'sources'),
            ]),
        }));

        const filterableSources: Array<{count: number, filter: SearchFilter}> = [];
        /* eslint-disable camelcase */
        const buckets = results.aggregations.sources.buckets as Array<{key: string, doc_count: number}>;
        // NOTE: sourcesWhitelist is iterated over here to match it's order.
        for (const source of config.sourcesWhitelist) {
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
    }).on('init'),
}) {
    @service i18n!: I18N;
    @service analytics!: Analytics;
    @service shareSearch!: ShareSearch;

    // List of keys that, when changed, reset the page to 1
    pageResetKeys = ['query', 'order', 'filter'];

    results: EmberArray<ShareRegistration> = A([]);
    searchable!: number;
    totalResults: number = 0;
    searchOptions!: SearchOptions;

    filterableSources: Array<{
        count: number;
        filter: SearchFilter;
    }> = defaultTo(this.filterableSources, []);

    sortOptions = [
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

    get filterStyles() {
        return {
            sources: styles['ActiveFilters--Sources'],
            registration_type: styles['ActiveFilters--RegistrationType'],
        };
    }

    @computed('searchOptions', 'totalResults')
    get maxPage() {
        const max = Math.ceil(this.totalResults / this.searchOptions.size);
        if (max > (10000 / this.searchOptions.size)) {
            return Math.ceil(10000 / this.searchOptions.size);
        }
        return max;
    }

    doSearch = task(function *(this: Discover, opts: SearchOptions, { scrollTop, noPageReset }: DoSearchOptions = {}) {
        let options = opts;

        // Unless OSF is the only source, registration_type filters must be cleared
        const sourceFilters = options.filters.filter(filter => filter.key === 'sources');
        if (!(sourceFilters.size === 1 && sourceFilters.first()!.value === 'OSF')) {
            options = options.set('filters', options.filters.filter(filter => filter.key !== 'registration_type'));
        }

        // If there is no query, no filters, and no sort, default to -date_modified rather
        // than relevance.
        if (!options.order.key && (!options.query || options.query === '') && options.filters.size === 0) {
            options = options.set('order', new SearchOrder({
                display: 'registries.discover.order.relevance',
                ascending: false,
                key: 'date_modified',
            }));
        }

        // Latter bit is just a janky array intersection
        // If any of the specified keys have changed, reset to the first page
        if ((this.searchOptions && !noPageReset) &&
            this.searchOptions.differingKeys(options).filter(k => this.pageResetKeys.includes(k)).length > 0) {
            options = options.set('page', 1);
        }

        this.set('searchOptions', options);
        this.setQueryParams(options);

        if (scrollTop) {
            $('html, body').scrollTop(
                $(`.${discoverStyles.Discover__Body}`).parent().position().top,
            );
        }

        yield timeout(250);

        const results: SearchResults<ShareRegistration> = yield this.shareSearch.registrations(options);

        this.set('results', A(results.results));
        this.set('totalResults', results.total);
    }).restartable();

    setup(this: Discover, event: ParachuteEvent<DiscoverQueryParams>) {
        this.rehydrateFromQueryParameters(event);
    }

    queryParamsDidChange(this: Discover, event: ParachuteEvent<DiscoverQueryParams>) {
        this.rehydrateFromQueryParameters(event);
    }

    rehydrateFromQueryParameters(this: Discover, event: ParachuteEvent<DiscoverQueryParams>) {
        const filters: SearchFilter[] = [];

        for (const name of event.queryParams.sources) {
            const source = config.sourcesWhitelist.find(x => x.name === name);
            if (!source) {
                continue;
            }
            filters.push(new ShareTermsFilter('sources', source.name, source.display || source.name));
        }

        for (const type of event.queryParams.registrationTypes) {
            filters.push(new ShareTermsFilter('registration_type', type, type));
        }

        const order = this.sortOptions.find(option =>
            !!option.key
            && event.queryParams.sort.endsWith(option.key)
            && option.ascending === !event.queryParams.sort.startsWith('-'));

        this.get('doSearch').perform(new SearchOptions({
            query: event.queryParams.query,
            size: event.queryParams.size,
            page: event.queryParams.page,
            order: order || this.sortOptions[0],
            filters: OrderedSet(filters),
        }), { noPageReset: true });
    }

    setQueryParams(this: Discover, options: SearchOptions) {
        this.set('page', options.page);
        this.set('size', options.size);
        this.set('query', options.query || '');

        // date_modified is a weird case, so don't save it in a query param.
        if (options.order.key !== 'date_modified') {
            this.set('sort', `${options.order.ascending ? '' : '-'}${options.order.key || ''}`);
        }

        const providers: string[] = [];
        const registrationTypes: string[] = [];
        for (const filter of options.filters.values()) {
            if (filter.key === 'sources') {
                providers.push(filter.value as string);
            }

            if (filter.key === 'registration_type') {
                registrationTypes.push(filter.value as string);
            }
        }

        this.set('sources', providers);
        this.set('registrationTypes', registrationTypes);
    }

    @action
    onSearchOptionsUpdated(this: Discover, options: SearchOptions) {
        this.get('doSearch').perform(options);
    }

    @action
    changePage(this: Discover, page: number) {
        this.get('doSearch').perform(
            this.searchOptions.set('page', page),
            { scrollTop: true },
        );
    }

    @action
    onSearch(this: Discover, value: string) {
        this.get('doSearch').perform(
            this.searchOptions.set('query', value),
        );
    }

    @action
    setOrder(this: Discover, value: SearchOrder) {
        this.analytics.track('dropdown', 'select', `Discover - Sort By: ${this.i18n.t(value.display)}`);

        this.get('doSearch').perform(
            this.searchOptions.set('order', value),
        );
    }
}
