import { computed, setProperties } from '@ember/object';
import { inject as service } from '@ember/service';
import { task } from 'ember-concurrency-decorators';
import DS from 'ember-data';

import { layout } from 'ember-osf-web/decorators/component';
import Collection from 'ember-osf-web/models/collection';
import CollectionProvider from 'ember-osf-web/models/collection-provider';
import Analytics from 'ember-osf-web/services/analytics';

import Base from '../base/component';
import styles from './styles';
import template from './template';

interface Item {
    key: string;
}

@layout(template, styles)
export default abstract class SearchFacetChecklist extends Base {
    @service analytics!: Analytics;
    @service store!: DS.Store;

    allItems: Item[] = [];

    abstract get modelAttribute(): keyof Collection;
    abstract get filterProperty(): string;

    @task
    initialize = task(function *(this: SearchFacetChecklist): IterableIterator<any> {
        const providers: CollectionProvider[] = this.theme.isProvider
            ? [this.theme.provider]
            : (yield this.store.findAll('collection-provider', {
                include: 'primary_collection',
            }));

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
    });

    @computed('allItems.[]', 'context.activeFilter.[]')
    get items() {
        const { activeFilter } = this.context;

        return this.allItems
            .map(item => ({
                ...item,
                checked: activeFilter.includes(item.key),
            }));
    }

    didInsertElement(this: SearchFacetChecklist) {
        super.didInsertElement();

        const { analytics, context, filterChanged, filterProperty, theme } = this;

        setProperties(context, {
            updateFilters(item?: string) {
                const { activeFilter, defaultQueryFilters } = context;

                if (item) {
                    const method = activeFilter.includes(item) ? 'removeObject' : 'pushObject';
                    activeFilter[method](item);
                    const filterAction = method === 'removeObject' ? 'remove' : 'add';
                    analytics.track(
                        'filter',
                        filterAction,
                        `${theme.id} Discover - Filter ${context.title} ${item}`,
                    );
                }

                setProperties(context, {
                    queryParam: activeFilter.join('OR'),
                    currentQueryFilters: !activeFilter.length
                        ? defaultQueryFilters
                        : {
                            [filterProperty]: activeFilter,
                        },
                });

                filterChanged();
            },
        });

        this.initialize.perform();
    }
}
