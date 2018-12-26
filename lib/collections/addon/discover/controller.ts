import { action, computed } from '@ember-decorators/object';
import { not } from '@ember-decorators/object/computed';
import { service } from '@ember-decorators/service';
import Controller from '@ember/controller';
import { underscore } from '@ember/string';
import config from 'collections/config/environment';
import DS from 'ember-data';
import I18N from 'ember-i18n/services/i18n';
import { choiceFields } from 'ember-osf-web/models/collected-metadatum';
import Theme from 'ember-osf-web/services/theme';

export default class Discover extends Controller {
    @service theme!: Theme;
    @service i18n!: I18N;
    @service store!: DS.Store;

    activeFilters = {
        providers: [],
        subjects: [],
    };

    model!: Array<{
        id: string;
        additionalProviders: string[];
    }>;

    // additionalProviders are using SHARE facets which do not work with Active Filters at this time
    @not('additionalProviders')
    showActiveFilters!: boolean;

    @computed('theme.provider')
    get additionalProviders() { // Do additionalProviders exist?
        // for now, using this property to alter many pieces of the landing/discover page
        // return (this.theme.provider!.additionalProviders || []).length > 1;
        return false;
    }

    consumingService = 'collections'; // Consuming service - preprints here
    detailRoute = 'content'; // Name of detail route for this application

    // @computed('additionalProviders')
    // get discoverHeader(): string { // Header for preprints discover page
    //     // If additionalProviders, use more generic Repository Search page title
    //     return this.additionalProviders ?
    //         'discover.search.heading_repository_search' :
    //         'collections.discover.search_heading';
    // }

    end = ''; // End query param. Must be passed to component, so can be reflected in the URL

    @computed('model', 'theme.defaultProvider')
    get externalProviders() {
        return this.model.filter(({ id }) => id !== this.theme.defaultProvider);
    }

    @computed('i18n.locale', 'additionalProviders')
    get facets() { // List of facets available for preprints
        return (
            this.additionalProviders ?
                // if additionalProviders exist, use subset of SHARE facets
                [
                    ['sources', 'source'],
                    ['date', 'daterange'],
                    ['type', 'worktype'],
                    ['tags', 'typeahead'],
                ] :
                // Regular preprints and branded preprints get provider and taxonomy facets
                [
                    ['sources', 'collection-provider', { hidden: true }],
                    ['subjects', 'taxonomy'],
                    ['type', 'collected-type'],
                    ['issue', 'issue'],
                    ['program-area', 'program-area'],
                    ['status', 'status'],
                    ['volume', 'volume'],
                ]
        ).map(([key, component, options = {}]: [string, string, any]) => ({
            key,
            title: this.i18n.t(`collections.discover.facet_titles.${underscore(component)}`),
            component,
            options,
        }));
    }

    // TODO: Add a conversion from shareSource to provider names here if desired
    filterReplace = { // Map filter names for front-end display
        'Open Science Framework': 'OSF',
        'Cognitive Sciences ePrint Archive': 'Cogprints',
        OSF: 'OSF Preprints',
        'Research Papers in Economics': 'RePEc',
    };

    page = 1; // Page query param. Must be passed to component, so can be reflected in URL
    provider = ''; // Provider query param. Must be passed to component, so can be reflected in URL
    subject = ''; // Subject query param.  Must be passed to component, so can be reflected in URL
    q = ''; // q query param.  Must be passed to component, so can be reflected in URL

    sources = ''; // Sources query param. Must be passed to component, so can be reflected in the URL
    start = ''; // Start query param. Must be passed to component, so can be reflected in the URL
    tags = ''; // Tags query param.  Must be passed to component, so can be reflected in URL

    collectedType = '';
    issue = '';
    programArea = '';
    status = '';
    volume = '';

    // Pass in the list of queryParams for this component
    queryParams = [
        'page',
        'q',
        'sources',
        'tags',
        'type',
        'start',
        'end',
        'subject',
        'provider',
        ...choiceFields,
    ];

    @computed('additionalProviders')
    get searchPlaceholder() { // Search bar placeholder
        return this.additionalProviders ?
            'discover.search.repository_placeholder' :
            'collections.discover.search_placeholder';
    }

    @computed('i18n.locale')
    get sortOptions() { // Sort options for preprints
        return [
            {
                display: 'relevance',
                sortBy: '',
            },
            {
                display: 'sort_oldest_newest',
                sortBy: 'modified',
            },
            {
                display: 'sort_newest_oldest',
                sortBy: '-modified',
            },
        ].map(({ display, sortBy }) => ({
            display: this.i18n.t(`discover.${display}`),
            sortBy,
        }));
    }

    type = ''; // Type query param. Must be passed to component, so can be reflected in URL
    whiteListedProviders = config.whiteListedProviders;

    @action
    query(params: any) {
        return this.store.query('collected-metadatum', params);
    }
}

declare module '@ember/controller' {
    interface Registry {
        'collections/discover': Discover;
    }
}
