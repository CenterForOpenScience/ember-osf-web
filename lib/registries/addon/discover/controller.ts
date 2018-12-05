import { action, computed } from '@ember-decorators/object';
import { service } from '@ember-decorators/service';
import { getOwner } from '@ember/application';
import EmberArray, { A } from '@ember/array';
import Controller from '@ember/controller';
import { task, timeout } from 'ember-concurrency';
import I18N from 'ember-i18n/services/i18n';
import Analytics from 'ember-osf-web/services/analytics';
import defaultTo from 'ember-osf-web/utils/default-to';
import scrollTo from 'ember-osf-web/utils/scroll-to';
import QueryParams from 'ember-parachute';
import { is, OrderedSet } from 'immutable';
import discoverStyles from 'registries/components/registries-discover-search/styles';
import config from 'registries/config/environment';
import { SearchFilter, SearchOptions, SearchOrder, SearchResults } from 'registries/services/search';
import ShareSearch, {
    ShareRegistration,
    ShareTermsAggregation,
    ShareTermsFilter,
} from 'registries/services/share-search';
import styles from './styles';

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
    sources: ShareTermsFilter[];
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
    sources: {
        as: 'provider',
        defaultValue: [] as ShareTermsFilter[],
        serialize(value: ShareTermsFilter[]) {
            return value.map(filter => filter.value).join('|');
        },
        deserialize(value: string) {
            return value.split(/OR|\|/).map(
                name => config.sourcesWhitelist.find(x => x.name === name),
            ).filter(Boolean).map(
                source => new ShareTermsFilter('sources', source!.name, source!.display || source!.name),
            );
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
            return value.split(/OR|\|/).map(
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
                option =>
                    !!option.key
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

    sortOptions = sortOptions;

    results: EmberArray<ShareRegistration> = A([]);
    searchable!: number;
    totalResults: number = 0;
    searchOptions!: SearchOptions;

    filterableSources: Array<{
        count: number;
        filter: SearchFilter;
    }> = defaultTo(this.filterableSources, []);

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

    doSearch = task(function *(this: Discover) {
        // Unless OSF is the only source, registration_type filters must be cleared
        if (!(this.sources.length === 1 && this.sources[0]!.value === 'OSF')) {
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
                ...this.sources,
                ...this.registrationTypes,
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
    }).restartable();

    setup(this: Discover) {
        this.get('doSearch').perform();
    }

    queryParamsDidChange(this: Discover) {
        this.get('doSearch').perform();
    }

    @action
    onSearchOptionsUpdated(this: Discover, options: SearchOptions) {
        const sources: ShareTermsFilter[] = [];
        const registrationTypes: ShareTermsFilter[] = [];
        for (const filter of options.filters.values()) {
            if (filter.key === 'sources') {
                sources.push(filter as ShareTermsFilter);
            }

            if (filter.key === 'registration_type') {
                registrationTypes.push(filter as ShareTermsFilter);
            }
        }

        const changes = {} as Pick<typeof this, keyof typeof this>;

        if (!isEqual(this.sources, sources)) {
            changes.page = 1;
            changes.sources = sources;
        }

        if (!isEqual(this.registrationTypes, registrationTypes)) {
            changes.page = 1;
            changes.registrationTypes = registrationTypes;
        }

        // If any filters are changed page is reset to 1
        this.setProperties(changes);
    }

    @action
    changePage(this: Discover, page: number) {
        this.set('page', page);

        // Get the application owner by using
        // passed down services as rootElement
        // isn't defined on engines' owners
        const element = document.querySelector(`.${discoverStyles.Discover__Body}`) as HTMLElement;
        if (!element) {
            return;
        }
        scrollTo(getOwner(this.i18n), element);
    }

    @action
    onSearch(this: Discover, value: string) {
        // Set page to 1 here to ensure page is always reset when updating a query
        this.setProperties({ page: 1, query: value });
        // If query or page don't actually change ember won't fire related events
        // So always kick off a doSearch task to allow forcing a "re-search"
        this.get('doSearch').perform();
    }

    @action
    setOrder(this: Discover, value: SearchOrder) {
        this.analytics.track('dropdown', 'select', `Discover - Sort By: ${this.i18n.t(value.display)}`);
        // Set page to 1 here to ensure page is always reset when changing the order/sorting of a search
        this.setProperties({ page: 1, sort: value });
    }
}
