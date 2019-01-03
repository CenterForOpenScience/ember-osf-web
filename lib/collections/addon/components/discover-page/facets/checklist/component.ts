import { computed } from '@ember-decorators/object';
import { service } from '@ember-decorators/service';
import { setProperties } from '@ember/object';
import { task } from 'ember-concurrency';
import DS from 'ember-data';

import { layout } from 'ember-osf-web/decorators/component';
import Collection from 'ember-osf-web/models/collection';
import CollectionProvider from 'ember-osf-web/models/collection-provider';

import Base from '../base/component';
import styles from './styles';
import template from './template';

interface Item {
    key: string;
}

@layout(template, styles)
export default abstract class SearchFacetChecklist extends Base.extend({
    didInsertElement(this: SearchFacetChecklist, ...args: any[]) {
        this._super(...args);

        const { context, filterChanged, filterProperty } = this;

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
                        {
                            [filterProperty]: activeFilter,
                        },
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
                (acc, val) => [...acc, ...(val[this.modelAttribute] as string[])],
                [],
            )
            .sort()
            .map(key => ({ key }));

        this.allItems.pushObjects(allItems);

        setProperties(this.context, {
            didInit: true,
            defaultQueryFilters: {},
            options: {
                ...this.context.options,
                hidden: !this.allItems.length,
            },
        });

        this.context.updateFilters();
    }),
}) {
    @service store!: DS.Store;

    allItems: Item[] = [];

    abstract get modelAttribute(): keyof Collection;
    abstract get filterProperty(): string;

    @computed('allItems.[]', 'context.activeFilter.[]')
    get items(this: SearchFacetChecklist) {
        const { activeFilter } = this.context;

        return this.allItems
            .map(item => ({
                ...item,
                checked: activeFilter.includes(item.key),
            }));
    }
}
