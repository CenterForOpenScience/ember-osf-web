import { computed } from '@ember-decorators/object';
import { service } from '@ember-decorators/service';
import { setProperties } from '@ember/object';
import { task } from 'ember-concurrency';
import DS from 'ember-data';
import Collection from 'ember-osf-web/models/collection';
import CollectionProvider from 'ember-osf-web/models/collection-provider';
import Base from '../base/component';
import styles from './styles';
import layout from './template';

interface Item {
    key: string;
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
export default abstract class SearchFacetChecklist extends Base.extend({
    didReceiveAttrs(this: SearchFacetChecklist, ...args: any[]) {
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

        this.initialize.perform();
    },

    initialize: task(function *(this: SearchFacetChecklist): IterableIterator<any> {
        const providers: CollectionProvider[] = this.theme.isProvider ?
            [this.theme.provider] :
            yield this.store.findAll('collection-provider', {
                include: 'primary_collection',
            });

        const primaryCollections: Collection[] = yield Promise.all(
            providers.map(({ primaryCollection }) => primaryCollection),
        );

        const allItems = primaryCollections
            .reduce(
                (acc, val) => [...acc, ...(val[this.attribute] as string[])],
                [],
            )
            .map(key => ({ key }));

        this.setProperties({
            allItems,
        });

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
    }),
}) {
    layout = layout;
    styles = styles;

    @service store!: DS.Store;

    allItems: Item[] = [];

    abstract attribute: keyof Collection;

    @computed('allItems', 'context.activeFilter.[]')
    get items(this: SearchFacetChecklist) {
        const { activeFilter } = this.context;

        return this.allItems
            .map(item => ({
                ...item,
                checked: activeFilter.includes(item.key),
            }));
    }
}
