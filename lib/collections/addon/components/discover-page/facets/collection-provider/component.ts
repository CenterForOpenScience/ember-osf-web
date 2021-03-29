import { computed, setProperties } from '@ember/object';
import { run } from '@ember/runloop';
import { inject as service } from '@ember/service';
import config from 'collections/config/environment';
import { task } from 'ember-concurrency';
import DS from 'ember-data';

import { layout } from 'ember-osf-web/decorators/component';
import Provider from 'ember-osf-web/models/provider';

import Base from '../base/component';
import styles from './styles';
import template from './template';

const {
    OSF: {
        url,
    },
} = config;

interface ProviderHit {
    key: string;
    id: string;
    doc_count: number; // eslint-disable-line camelcase
}

@layout(template, styles)
export default class SearchFacetProvider extends Base {
    @service store!: DS.Store;

    allProviders!: ProviderHit[];

    @task({ withTestWaiter: true })
    initialize = task(function *(this: SearchFacetProvider): IterableIterator<any> {
        if (this.theme.isProvider) {
            const { name: key, id } = this.theme.provider!;

            const provider = {
                key,
                id,
                doc_count: 0,
            };

            this.set('allProviders', [provider]);

            this.context.lockedActiveFilter.pushObject(provider);
            run.schedule('actions', () => this.context.activeFilter.pushObject(provider));
        } else {
            const providers: Provider[] = yield this.store.findAll('collection-provider');

            this.set('allProviders', providers.map(({ name, id }) => ({
                key: name,
                id,
                doc_count: 0,
            })));
        }

        setProperties(this.context, {
            didInit: true,
            defaultQueryFilters: this.theme.isProvider ? { provider: [this.theme.id] } : {},
        });

        this.context.updateFilters();

        this.filterChanged();
    });

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
                checked: activeFilter.includes(provider),
            }));
    }

    didReceiveAttrs() {
        super.didReceiveAttrs();

        const { context, filterChanged, theme } = this;

        setProperties(context, {
            lockedActiveFilter: [],
            updateFilters(item?: string) {
                const { activeFilter, defaultQueryFilters } = context;

                if (item) {
                    const method = activeFilter.includes(item) ? 'removeObject' : 'pushObject';
                    activeFilter[method](item);
                }

                const queryParam = theme.isProvider ? '' : activeFilter.join('OR');

                setProperties(context, {
                    queryParam,
                    currentQueryFilters: !activeFilter.length || theme.isProvider
                        ? defaultQueryFilters
                        : {
                            provider: activeFilter.mapBy('id'),
                        },
                });

                filterChanged();
            },
        });

        this.initialize.perform();
    }
}
