import { A } from '@ember/array';
import ArrayProxy from '@ember/array/proxy';
import Component from '@ember/component';
import { assert } from '@ember/debug';
import EmberObject, { action, computed, setProperties } from '@ember/object';
import { inject as service } from '@ember/service';
import { camelize } from '@ember/string';
import { timeout } from 'ember-concurrency';
import { task } from 'ember-concurrency-decorators';
import DS from 'ember-data';
import config from 'ember-get-config';

import { layout } from 'ember-osf-web/decorators/component';
import Analytics from 'ember-osf-web/services/analytics';
import CurrentUser from 'ember-osf-web/services/current-user';
import Theme from 'ember-osf-web/services/theme';
import defaultTo from 'ember-osf-web/utils/default-to';
import { encodeParams, getSplitParams, getUniqueList } from '../../utils/elastic-query';
import styles from './styles';
import template from './template';

const filterQueryParams = [
    'provider',
    'tags',
    'sources',
    'publishers',
    'funders',
    'institutions',
    'organizations',
    'language',
    'contributors',
    'type',
    'status',
    'collectedType',
];

export interface Filters extends EmberObject {
    providers: string[];
    types: string[];
}

interface Facet {
    base?: string;
    component: string;
    key: string;
    title: string;
    type?: string;
    options?: any;
}

export interface FacetContext extends EmberObject {
    component: string;
    title: string;
    key: string;
    didInit: boolean;
    activeFilter: any[];
    lockedActiveFilter: any;
    defaultQueryFilters: any;
    currentQueryFilters: any;
    queryParam: string;
    options?: any;
    updateFilters: (item?: string) => void;
}

export interface FacetContexts {
    [index: string]: FacetContext;
}

interface SortOption {
    display: string;
    sortBy: string;
}

interface ArrayMeta {
    meta: {
        total: number;
    };
}

type SearchQuery = ArrayProxy<any> & ArrayMeta;

function emptyResults(): SearchQuery {
    return ArrayProxy.create({ content: A([]), meta: { total: 0 } });
}

@layout(template, styles)
export default class DiscoverPage extends Component {
    @service analytics!: Analytics;
    @service currentUser!: CurrentUser;
    @service store!: DS.Store;
    @service theme!: Theme;

    query!: (params: any) => Promise<any>;
    searchResultComponent: string = this.searchResultComponent;

    firstLoad: boolean = true;
    results: SearchQuery = emptyResults();

    /**
     * Text header for top of discover page.
     * @property {String} discoverHeader
     */
    discoverHeader: string = defaultTo(this.discoverHeader, '');

    /**
     * Query params
     */
    contributors: string = defaultTo(this.contributors, '');
    end = '';
    funders: string = defaultTo(this.funders, '');
    institutions: string = defaultTo(this.institutions, '');
    language: string = defaultTo(this.language, '');
    organizations: string = defaultTo(this.organizations, '');
    page: number = defaultTo(+this.page, 1);
    provider: string = defaultTo(this.provider, '');
    publishers = '';
    q: string = defaultTo(this.q, '');
    size: number = defaultTo(this.size, 10);
    sort: string = defaultTo(this.sort, '');
    sources: string = defaultTo(this.sources, '');
    start: string = defaultTo(this.start, '');
    tags: string = defaultTo(this.tags, '');
    type: string = defaultTo(this.type, '');
    status: string = defaultTo(this.status, '');
    collectedType: string = defaultTo(this.collectedType, '');

    /**
     * A list of the components to be used for the search facets.
     */
    facets?: Facet[];

    facetContexts?: FacetContext[];

    @computed('facetContexts.@each.currentQueryFilters')
    get filters(): { [index: string]: any } {
        return this.facetContexts && this.facetContexts
            .reduce((acc, { currentQueryFilters }) => ({ ...acc, ...currentQueryFilters }), {});
    }

    @computed('q', 'page', 'sort', 'filters')
    get queryAttributes() {
        return {
            page: this.page,
            sort: this.sort,
            q: this.q || undefined,
            ...this.filters,
        };
    }

    /**
     * For PREPRINTS and REGISTRIES. A mapping of filter names for front-end display. Ex. {OSF: 'OSF Preprints'}.
     * @property {Object} filterReplace
     */
    filterReplace: object = defaultTo(this.filterReplace, {});

    loading: boolean = defaultTo(this.loading, true);

    /**
     * Locked portions of search query that user cannot change.  Example: {'sources': 'PubMed Central'} will make PMC a
     * locked source.
     */
    lockedParams: object = defaultTo(this.lockedParams, {});

    numberOfEvents = 0;
    numberOfResults = 0; // Number of search results returned
    numberOfSources = 0; // Number of sources

    /**
     * Declare on consuming application's controller for query params to be active in that route.
     * @property {Array} queryParams
     */
    queryParams = ['q', 'start', 'end', 'sort', 'page', ...filterQueryParams];

    /**
     * For PREPRINTS and REGISTRIES.  Displays activeFilters box above search facets.
     */
    showActiveFilters: boolean = defaultTo(this.showActiveFilters, false);
    showLuceneHelp: boolean = false; // Is Lucene Search help modal open?

    /**
     * Sort dropdown options - Array of dictionaries.  Each dictionary should have display and sortBy keys.
     * @property {Array} sortOptions
     */
    // TODO: intl-ize
    sortOptions: SortOption[] = defaultTo(this.sortOptions, [
        ['Relevance', ''],
        ['Date Updated (Desc)', '-date_updated'],
        ['Date Updated (Asc)', 'date_updated'],
        ['Ingest Date (Asc)', 'date_created'],
        ['Ingest Date (Desc)', '-date_created'],
    ].map(([display, sortBy]) => ({ display, sortBy })));

    @computed('sort', 'sortOptions')
    get sortDisplay(): string {
        const sortOption = this.sortOptions.find(({ sortBy }) => this.sort === sortBy);

        return sortOption ? sortOption.display : '';
    }

    took = 0;

    displayQueryBody: { query?: string } = {};
    queryBody: {} = {};
    aggregations: any;
    whiteListedProviders: string[] = defaultTo(this.whiteListedProviders, []);
    queryError: boolean = false;
    serverError: boolean = false;

    // ************************************************************
    // COMPUTED PROPERTIES and OBSERVERS
    // ************************************************************

    // TODO update this property if a solution is found for the elastic search limitation.
    // Ticket: SHARE-595
    @computed('totalPages', 'size')
    get clampedPages() {
        // Total pages of search results, unless total is greater than the max pages allowed.
        const maxPages = Math.ceil(10000 / this.size);
        return this.totalPages < maxPages ? this.totalPages : maxPages;
    }

    @computed('currentUser.sessionKey')
    get searchUrl() {
        // Pulls SHARE search url from config file.
        return `${config.OSF.shareSearchUrl}?preference=${this.currentUser.sessionKey}`;
    }

    // Total pages of search results
    @computed('numberOfResults', 'size')
    get totalPages(): number {
        return Math.ceil(this.numberOfResults / this.size);
    }

    @computed('facetContexts.@each.didInit')
    get hasInitializedFacets() {
        return this.facetContexts && this.facetContexts.every(({ didInit }) => didInit);
    }

    @task({ keepLatest: true })
    loadPage = task(function *(this: DiscoverPage) {
        this.set('loading', true);

        if (!this.firstLoad) {
            yield timeout(500);
        }

        try {
            const results = yield this.query(this.queryAttributes);

            this.setProperties({
                numberOfResults: results.meta.total,
                loading: false,
                firstLoad: false,
                results,
                queryError: false,
            });

            if (this.get('totalPages') && this.get('totalPages') < this.get('page')) {
                this.search();
            }
        } catch (errorResponse) {
            this.setProperties({
                loading: false,
                firstLoad: false,
                numberOfResults: 0,
                results: emptyResults(),
            });
            // If issue with search query, for example, invalid lucene search syntax
            if (errorResponse instanceof DS.ServerError
                || errorResponse instanceof DS.AbortError
                || errorResponse instanceof DS.TimeoutError) {
                this.set('serverError', true);
            } else {
                this.set('queryError', true);
            }

            // re-throw for error monitoring
            throw errorResponse;
        }
    });

    init() {
        super.init();
        this.set('facetContexts', this.facets && this.facets
            .map(({ component, options, key, title }) => {
                const queryParam: string = this[camelize(component) as keyof DiscoverPage];
                const activeFilter = !queryParam ? [] : queryParam.split('OR').filter(str => !!str);

                return EmberObject.create({
                    title,
                    key,
                    component,
                    didInit: false,
                    queryParam,
                    lockedActiveFilter: {},
                    activeFilter,
                    defaultQueryFilters: {},
                    currentQueryFilters: {},
                    options,
                    updateFilters: () => {
                        assert('You should set an `updateFilters` function');
                    },
                });
            }));
    }

    scrollToResults() {
        // Scrolls to top of search results
        this.$('html, body').scrollTop(this.$('.results-top').position().top);
    }

    search(): void {
        if (!this.firstLoad) {
            this.set('page', 1);
        }

        this.loadPage.perform();
    }

    trackDebouncedSearch() {
        // For use in tracking debounced search of registries in GA
        this.analytics.track('input', 'onkeyup', 'Discover - Search', this.q);
    }

    didInsertElement() {
        super.didInsertElement();
        this.set('firstLoad', true);
    }

    @action
    addFilter(type: keyof DiscoverPage, filterValue: string) {
        // Ember-SHARE action. Used to add filter from the search results.
        this.set(type, encodeParams(getUniqueList([
            filterValue,
            ...(getSplitParams(this.type) || []),
        ])));
    }

    @action
    clearFilters() {
        this.analytics.track('button', 'click', 'Discover - Clear Filters');

        if (this.facetContexts) {
            // Clear all of the activeFilters
            this.facetContexts
                .forEach(context => {
                    setProperties(context, {
                        activeFilter: [...context.lockedActiveFilter],
                        queryParam: '',
                        currentQueryFilters: context.defaultQueryFilters,
                    });
                });
        }

        this.setProperties({
            ...[
                'start',
                'end',
                'sort',
            ].reduce((acc, val) => ({ ...acc, [val]: '' }), {} as any),
        });

        this.filterChanged();
    }

    @action
    searchAction() {
        // Only want to track search here when button clicked. Keypress search tracking is debounced in trackSearch
        this.analytics.track('button', 'click', 'Discover - Search', this.q);
        this.search();
    }

    @action
    selectSortOption(option: string) {
        // Runs when sort option changed in dropdown
        this.set('sort', option);
        this.analytics.track('dropdown', 'select', `Sort by: ${option || 'relevance'}`);
        this.search();
    }

    @action
    setLoadPage(pageNumber: number, scrollUp: boolean = true) {
        // Adapted from PREPRINTS for pagination. When paginating, sets page and scrolls to top of results.
        this.set('page', pageNumber);

        if (scrollUp) {
            this.scrollToResults();
        }

        this.loadPage.perform();
    }

    @action
    toggleShowLuceneHelp() {
        // Toggles display of Lucene Search help modal
        this.toggleProperty('showLuceneHelp');
    }

    /**
     * Closure action to update and search when the filter changes. Each component manages its own filters.
     */
    @action
    filterChanged() {
        if (this.facetContexts) {
            this.setProperties({
                ...this.facetContexts.reduce((acc, { component, queryParam }) => ({
                    ...acc,
                    [camelize(component)]: queryParam,
                }), {}),
            });
        }

        if (!this.hasInitializedFacets) {
            return;
        }

        this.search();
    }
}
