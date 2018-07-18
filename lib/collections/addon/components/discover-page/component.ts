import { action, computed } from '@ember-decorators/object';
import { service } from '@ember-decorators/service';
import ArrayProxy from '@ember/array/proxy';
import Component from '@ember/component';
import { assert } from '@ember/debug';
import EmberObject, { setProperties } from '@ember/object';
import { debounce } from '@ember/runloop';
import { camelize } from '@ember/string';
import DS from 'ember-data';
import config from 'ember-get-config';
import I18N from 'ember-i18n/services/i18n';
import Analytics from 'ember-osf-web/services/analytics';
import CurrentUser from 'ember-osf-web/services/current-user';
import Theme from 'ember-osf-web/services/theme';
import defaultTo from 'ember-osf-web/utils/default-to';
import { encodeParams, getSplitParams, getUniqueList } from '../../utils/elastic-query';
import styles from './styles';
import layout from './template';

/**
 * Discover-page component. Builds a search interface utilizing SHARE.
 * See retraction-watch, registries, and preprints discover pages for working examples.
 *
 * Majority adapted from Ember-SHARE https://github.com/CenterForOpenScience/ember-share, with additions from PREPRINTS
 * and REGISTRIES discover pages. Original Ember-SHARE facets and PREPRINTS/REGISTRIES facets behave differently at this
 * time. You can build a discover-page that uses Ember-SHARE type facets -OR- PREPRINTS/REGISTRIES type facets.
 * Would not recommend mixing until code is combined.
 *
 * How to Use:
 * Pass in custom text like searchPlaceholder.  The facets property will enable you to customize the filters
 * on the left-hand side of the discover page. Sort options are the sort dropdown options.  The lockedParams are the
 * query parameters that are always locked in your application. Each query parameter must be passed in individually,
 * so they are reflected in the URL.  Logo and custom colors must be placed in the consuming application's stylesheet.
 * Individual components can additionally be overridden in your application.
 */

const filterQueryParams = [
    'taxonomy',
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
    subjects: string[];
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
    didInit: boolean;
    activeFilter: any[];
    lockedActiveFilter: any[];
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
    return ArrayProxy.create({ content: [], meta: { total: 0 } });
}

export default class DiscoverPage extends Component.extend({
    didInsertElement(this: DiscoverPage, ...args: any[]) {
        // TODO Sort initial results on date_modified
        // Runs on initial render.
        this._super(...args);
        this.set('firstLoad', true);
    },
}) {
    layout = layout;
    styles = styles;

    @service analytics!: Analytics;
    @service currentUser!: CurrentUser;
    @service store!: DS.Store;
    @service theme!: Theme;
    @service i18n!: I18N;

    firstLoad: boolean = true;
    results: SearchQuery = emptyResults();

    /**
     * Contributors query parameter.  If 'contributors' is one of your query params, it must be passed to the component
     * so it can be reflected in the URL.
     * @property {String} contributors
     * @default ''
     */
    contributors: string = defaultTo(this.contributors, '');

    /**
     * Name of detail route for consuming application, like 'content' or 'detail'. Override if search result title
     * should link to detail route.
     * @property {String} detailRoute
     */
    detailRoute: string = defaultTo(this.detailRoute, '');

    /**
     * Text header for top of discover page.
     * @property {String} discoverHeader
     */
    discoverHeader: string = defaultTo(this.discoverHeader, '');

    /**
     * End query parameter.  If 'end' is one of your query params, it must be passed to the component so it can be
     * reflected in the URL.
     * @property {String} end
     * @default ''
     */
    end = '';

    /**
     * A list of the components to be used for the search facets.  Each list item should be a dictionary including the
     * key (SHARE filter), title (search-facet heading in UI), and component (name of component).
     * @property {Array} facets
     * @default [
     *       { key: 'sources', title: 'Source', component: 'search-facet-source' },
     *       { key: 'date', title: 'Date', component: 'search-facet-daterange' },
     *       { key: 'type', title: 'Type', component: 'search-facet-worktype', data: this.get('processedTypes') },
     *       { key: 'tags', title: 'Tag', component: 'search-facet-typeahead' },
     *       { key: 'publishers', title: 'Publisher', component: 'search-facet-typeahead', base: 'agents',
     *          type: 'publisher' },
     *       { key: 'funders', title: 'Funder', component: 'search-facet-typeahead', base: 'agents', type: 'funder' },
     *       { key: 'language', title: 'Language', component: 'search-facet-language' },
     *       { key: 'contributors', title: 'People', component: 'search-facet-typeahead', base: 'agents',
     *          type: 'person' }
     *   ]
     */
    facets: Facet[] = this.facets;

    facetContexts: FacetContexts = this.facets
        .reduce((acc, { component, options }) => {
            const queryParam: string = this[camelize(component) as keyof DiscoverPage];
            const activeFilter = !queryParam ? [] : queryParam.split('OR').filter(str => !!str);

            return {
                ...acc,
                [component]: {
                    didInit: false,
                    queryParam,
                    lockedActiveFilter: {},
                    activeFilter,
                    defaultQueryFilters: {},
                    currentQueryFilters: {},
                    options,
                    updateFilters() {
                        assert('You should set an `updateFilters` function');
                    },
                },
            };
        }, {});

    // TODO: Use dynamic computed property based on this.facets
    @computed('facetContexts.{provider,taxonomy,collected-type,status}.currentQueryFilters')
    get filters(): { [index: string]: any } {
        return Object.values(this.facetContexts)
            .reduce((acc, { currentQueryFilters }) => ({ ...acc, ...currentQueryFilters }), {});
    }

    @computed('sort')
    get sortQuery() {
        return this.sort ?
            {
                sort: {
                    [this.sort.replace(/^-/, '')]: this.sort[0] === '-' ? 'desc' : 'asc',
                },
            } :
            {};
    }

    @computed('q', 'page', 'filters', 'sortQuery')
    get queryAttributes() {
        return {
            // from: (this.page - 1) * 10,
            // ...this.sortQuery,
            q: this.q || undefined,
            ...this.filters,
        };
    }

    /**
     * For PREPRINTS and REGISTRIES. A mapping of filter names for front-end display. Ex. {OSF: 'OSF Preprints'}.
     * @property {Object} filterReplace
     */
    filterReplace: object = defaultTo(this.filterReplace, {});

    /**
     * Funders query parameter. If 'funders' is one of your query params, it must be passed to the component so it can
     * be reflected in the URL.
     * @property {String} funders
     * @default ''
     */
    funders: string = defaultTo(this.funders, '');

    /**
     * Institutions query parameter. If 'institutions' is one of your query params, it must be passed to the component
     * so it can be reflected in the URL.
     * @property {String} institutions
     * @default ''
     */
    institutions: string = defaultTo(this.institutions, '');

    /**
     * Language query parameter. If 'language' is one of your query params, it must be passed to the component so it
     * can be reflected in the URL.
     * @property {String} language
     * @default ''
     */
    language: string = defaultTo(this.language, '');

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
     * Organizations query parameter.  If 'organizations' is one of your query params, it must be passed to the
     * component so it can be reflected in the URL.
     * @property {String} organizations
     * @default ''
     */
    organizations: string = defaultTo(this.organizations, '');

    /**
     * Page query parameter.  If 'page' is one of your query params, it must be passed to the component so it can be
     * reflected in the URL.
     * @property {Integer} page
     * @default 1
     */
    page: number = defaultTo(this.page, 1);

    /**
     * Provider query parameter.  If 'provider' is one of your query params, it must be passed to the component so it
     * can be reflected in the URL.
     * @property {String} provider
     * @default ''
     */
    provider: string = defaultTo(this.provider, '');

    /**
     * Publishers query parameter.  If 'publishers' is one of your query params, it must be passed to the component so
     * it can be reflected in the URL.
     * @property {String} publishers
     * @default ''
     */
    publishers = '';

    /**
     * q query parameter.  If 'q' is one of your query params, it must be passed to the component so it can be
     * reflected in the URL.
     * @property {String} q
     * @default ''
     */
    q: string = defaultTo(this.q, '');

    status: string = defaultTo(this.status, ''); // eslint-disable-line no-restricted-globals
    collectedType: string = defaultTo(this.collectedType, '');

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
     * Size query parameter.  If 'size' is one of your query params, it must be passed to the component so it can be
     * reflected in the URL.
     */
    size: number = defaultTo(this.size, 10);

    /**
     * Sort query parameter.  If 'sort' is one of your query params, it must be passed to the component so it can be
     * reflected in the URL.
     */
    sort: string = defaultTo(this.sort, '');

    /**
     * Sort dropdown options - Array of dictionaries.  Each dictionary should have display and sortBy keys.
     * @property {Array} sortOptions
     */
    // TODO: i18n-ize
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

    /**
     * Sources query parameter.  If 'sources' is one of your query params, it must be passed to the component so it can
     * be reflected in the URL.
     * @property {String} sources
     * @default ''
     */
    sources: string = defaultTo(this.sources, '');

    /**
     * Start query parameter.  If 'start' is one of your query params, it must be passed to the component so it can be
     * reflected in the URL.
     * @property {String} start
     * @default ''
     */
    start: string = defaultTo(this.start, '');

    /**
     * Subject query parameter.  If 'subject' is one of your query params, it must be passed to the component so it can
     * be reflected in the URL.
     * @property {String} subject
     * @default ''
     */
    taxonomy: string = defaultTo(this.taxonomy, '');

    /**
     * Tags query parameter.  If 'tags' is one of your query params, it must be passed to the component so it can be
     * reflected in the URL.
     * @property {String} tags
     * @default ''
     */
    tags: string = defaultTo(this.tags, '');

    took = 0;

    /**
     * type query parameter.  If 'type' is one of your query params, it must be passed to the component so it can be
     * reflected in the URL.
     * @property {String} type
     * @default ''
     */
    type: string = defaultTo(this.type, '');

    displayQueryBody: { query?: string } = {};
    queryBody: {} = {};
    aggregations: any;
    whiteListedProviders: string[] = defaultTo(this.whiteListedProviders, []);
    queryError: boolean = false;
    shareDown: boolean = false;

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

    async loadPage(this: DiscoverPage) {
        // const data = JSON.stringify(this.getQueryBody());

        this.set('loading', true);

        try {
            const collectedMetadata = (await this.store
                .query('collected-metadatum', this.queryAttributes) as SearchQuery);

            this.setProperties({
                numberOfResults: collectedMetadata.meta.total,
                loading: false,
                firstLoad: false,
                results: collectedMetadata,
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
            this.set(errorResponse.status === 400 ? 'queryError' : 'shareDown', true);
        }
    }

    scrollToResults() {
        // Scrolls to top of search results
        this.$('html, body').scrollTop(this.$('.results-top').position().top);
    }

    search(this: DiscoverPage): void {
        if (!this.firstLoad) {
            this.set('page', 1);
        }

        this.setProperties({
            loading: true,
            results: emptyResults(),
        });

        debounce(this, this.loadPage, 500);
    }

    trackDebouncedSearch() {
        // For use in tracking debounced search of registries in Keen and GA
        this.analytics.track('input', 'onkeyup', 'Discover - Search', this.q);
    }

    @action
    addFilter(this: DiscoverPage, type: keyof DiscoverPage, filterValue: string) {
        // Ember-SHARE action. Used to add filter from the search results.
        this.set(type, encodeParams(getUniqueList([
            filterValue,
            ...(getSplitParams(this.type) || []),
        ])));
    }

    @action
    clearFilters(this: DiscoverPage) {
        this.analytics.track('button', 'click', 'Discover - Clear Filters');

        // Clear all of the activeFilters
        Object.values(this.facetContexts)
            .forEach(context => {
                setProperties(context, {
                    activeFilter: [...context.lockedActiveFilter],
                    queryParam: '',
                    currentQueryFilters: context.defaultQueryFilters,
                });
            });

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
    selectSortOption(this: DiscoverPage, option: string) {
        // Runs when sort option changed in dropdown
        this.set('sort', option);
        this.analytics.track('dropdown', 'select', `Sort by: ${option || 'relevance'}`);
        this.search();
    }

    @action
    setLoadPage(this: DiscoverPage, pageNumber: number, scrollUp: boolean = true) {
        // Adapted from PREPRINTS for pagination. When paginating, sets page and scrolls to top of results.
        this.set('page', pageNumber);

        if (scrollUp) {
            this.scrollToResults();
        }

        this.loadPage();
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
    filterChanged(this: DiscoverPage) {
        const contexts = Object.entries(this.facetContexts);

        this.setProperties({
            page: 1,
            ...contexts.reduce((acc, [key, { queryParam }]) => ({
                ...acc, [camelize(key)]: queryParam,
            }), {}),
        });

        const hasInitializedFacets = contexts.every(([, { didInit }]) => didInit);

        if (!hasInitializedFacets) {
            return;
        }

        this.search();
    }
}
