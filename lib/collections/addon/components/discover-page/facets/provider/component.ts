import { computed } from '@ember-decorators/object';
import { service } from '@ember-decorators/service';
import { setProperties } from '@ember/object';
import config from 'collections/config/environment';
import DS from 'ember-data';
import $ from 'jquery';
import Base from '../base/component';
import styles from './styles';
import layout from './template';

const {
    OSF: {
        shareSearchUrl,
        url,
    },
    whiteListedProviders,
} = config;

const getProvidersPayload = JSON.stringify({
    from: 0,
    query: {
        bool: {
            must: {
                query_string: {
                    query: '*',
                },
            },
            filter: [
                {
                    bool: {
                        should: [
                            {
                                terms:
                                {
                                    types: [
                                        'preprint',
                                    ],
                                },
                            },
                            {
                                terms: {
                                    sources: [
                                        'Thesis Commons',
                                    ],
                                },
                            },
                        ],
                    },
                },
            ],
        },
    },
    aggregations: {
        sources: {
            terms: {
                field: 'sources',
                size: 200,
            },
        },
    },
});

interface ShareProviderHit {
    key: string;
    doc_count: number; // eslint-disable-line camelcase
}

/**
 * Builds preprint provider facets for discover page.
 * To be used with discover-page component and faceted-search component.
 *
 * Sample usage:
 * ```handlebars
 * {{search-facet-provider
 *      updateFilters=(action 'updateFilters')
 *      activeFilters=activeFilters
 *      options=facet
 *      filterReplace=filterReplace
 *      key=key
 * }}
 * ```
 * @class search-facet-provider
 */
export default class SearchFacetProvider extends Base.extend({
    didReceiveAttrs(this: SearchFacetProvider, ...args: any[]) {
        this._super(...args);

        const { context, filterChanged } = this;

        setProperties(context, {
            updateFilters(item?: string) {
                const { activeFilter, defaultQueryFilters } = context;

                if (item) {
                    const method = activeFilter.includes(item) ? 'removeObject' : 'pushObject';
                    activeFilter[method](item);
                }

                setProperties(context, {
                    queryParam: activeFilter.join('OR'),
                    currentQueryFilters: !activeFilter.length ?
                        defaultQueryFilters :
                        [
                            {
                                terms: {
                                    sources: activeFilter,
                                },
                            },
                        ],
                });

                filterChanged();
            },
        });

        this.initialize();
    },
}) {
    layout = layout;
    styles = styles;

    @service store!: DS.Store;

    osfProviders: string[] = [];
    otherProviders: ShareProviderHit[] = [];
    // allProviders
    whiteListedProviders = whiteListedProviders.map(item => item.toLowerCase());
    osfUrl = url;

    @computed('otherProviders.[]')
    get checkedProviders() {
        return this.otherProviders.filterBy('checked', true);
    }

    @computed('checkedProviders')
    get activeProviders() {
        return this.checkedProviders.mapBy('key');
    }

    @computed('otherProviders.[]', 'checkedProviders')
    get filters() {
        return [
            this.checkedProviders,
            this.otherProviders,
        ].map(item => ({
            terms: {
                sources: item.mapBy('key'),
            },
        }));
    }

    /**
     * The providers list from the API
     */
    async getProviderNames(this: SearchFacetProvider): Promise<string[]> {
        const providers = await this.store.findAll('preprint-provider');

        const providerNames = providers
            .filter(provider => provider.id !== 'livedata')
            .map(({ shareSource, name }) => {
                const n = shareSource || name;
                // TODO Change this in populate_preprint_providers script to just OSF
                return n === 'Open Science Framework' ? 'OSF' : n;
            });

        this.set('osfProviders', providerNames);

        return providerNames;
    }

    async getShareProviders(): Promise<ShareProviderHit[]> {
        const {
            aggregations: {
                sources: {
                    buckets,
                },
            },
        } = await $.ajax({
            type: 'POST',
            url: shareSearchUrl,
            data: getProvidersPayload,
            contentType: 'application/json',
            crossDomain: true,
        });

        return buckets;
    }

    async initialize(this: SearchFacetProvider) {
        const [osfProviders, hits] = await Promise.all([
            this.getProviderNames(),
            this.getShareProviders(),
        ]);

        // Get the whitelist and add the OSF Providers to it
        const whiteList = [
            ...this.whiteListedProviders,
            ...osfProviders.map(osfProvider => osfProvider.toLowerCase()),
        ];

        // Filter out providers that are not on the whitelist
        const providers = hits.filter(({ key }) => whiteList.includes(key.toLowerCase()));

        // Add the OSF Providers that are not in SHARE
        providers.push(
            ...osfProviders
                .filter(osfProvider => !providers
                    .find(({ key }) => key.toLowerCase() === osfProvider.toLowerCase()))
                .map(key => ({
                    key,
                    doc_count: 0,
                })),
        );

        // Sort the providers list add add OSF to the top
        providers
            .sort((a, b) => (a.key.toLowerCase() < b.key.toLowerCase() ? -1 : 1))
            .unshift(
                ...providers.splice(
                    providers.findIndex(({ key }) => (/^osf/i).test(key)),
                    1,
                ),
            );

        if (!this.theme.isProvider) {
            this.set('otherProviders', providers);
        } else {
            const filtered = providers
                .filter(({ key }) => key === this.theme.provider!.name);

            this.set('otherProviders', filtered);
            this.context.activeFilter.pushObject(filtered[0].key);
        }

        setProperties(this.context, {
            didInit: true,
            defaultQueryFilters: [
                {
                    terms: {
                        // if there are no providers checked, use all whitelisted providers in the query
                        sources: this.otherProviders.mapBy('key'),
                    },
                },
            ],
        });

        this.context.updateFilters();

        this.filterChanged();
    }

    @computed('otherProviders.[]', 'context.activeFilter.[]')
    get providers() {
        return this.otherProviders
            .map(provider => ({
                ...provider,
                checked: this.context.activeFilter.includes(provider.key),
            }));
    }
}
