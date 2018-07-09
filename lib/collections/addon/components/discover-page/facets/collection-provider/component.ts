import { computed } from '@ember-decorators/object';
import { service } from '@ember-decorators/service';
import { setProperties } from '@ember/object';
import config from 'collections/config/environment';
import { task } from 'ember-concurrency';
import DS from 'ember-data';
import Provider from 'ember-osf-web/models/provider';
import Base from '../base/component';
import styles from './styles';
import layout from './template';

const {
    OSF: {
        url,
    },
} = config;

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

        const { context, filterChanged, theme } = this;

        setProperties(context, {
            lockedActiveFilter: this.theme.isProvider ? [] : [],
            updateFilters(item?: string) {
                const { activeFilter, defaultQueryFilters } = context;

                if (item) {
                    const method = activeFilter.includes(item) ? 'removeObject' : 'pushObject';
                    activeFilter[method](item);
                }

                const queryParam = theme.isProvider ? '' : activeFilter.join('OR');

                setProperties(context, {
                    queryParam,
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

        this.initialize.perform();
    },

    initialize: task(function *(this: SearchFacetProvider): IterableIterator<any> {
        if (this.theme.isProvider) {
            const key = this.theme.provider!.name;

            this.set('allProviders', [
                {
                    key,
                    doc_count: 0,
                },
            ]);

            this.context.lockedActiveFilter.pushObject(key);
            this.context.activeFilter.pushObject(key);
        } else {
            const providers: Provider[] = yield this.store.findAll('collection-provider');

            this.set('allProviders', providers.map(({ name }) => ({
                key: name,
                doc_count: 0,
            })));
        }

        setProperties(this.context, {
            didInit: true,
            defaultQueryFilters: [
                // {
                //     terms: {
                //         // if there are no providers checked, use all whitelisted providers in the query
                //         sources: this.otherProviders.mapBy('key'),
                //     },
                // },
            ],
        });

        this.context.updateFilters();

        this.filterChanged();
    }),
}) {
    layout = layout;
    styles = styles;

    @service store!: DS.Store;

    allProviders!: ShareProviderHit[];

    @computed('allProviders.[]')
    get checkedProviders() {
        return this.allProviders.filterBy('checked', true);
    }

    @computed('checkedProviders')
    get activeProviders() {
        return this.checkedProviders.mapBy('key');
    }

    @computed('osfUrl')
    get otherReposLink(): string {
        return `${url}collections/discover`;
    }

    @computed('theme.provider', 'allProviders', 'context.activeFilter.[]')
    get providers() {
        const { activeFilter } = this.context;

        return this.allProviders
            .map(provider => ({
                ...provider,
                checked: activeFilter.includes(provider.key),
            }));
    }
}
