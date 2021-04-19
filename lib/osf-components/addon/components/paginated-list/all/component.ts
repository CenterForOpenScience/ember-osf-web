import Store from '@ember-data/store';
import { inject as service } from '@ember/service';
import { waitFor } from '@ember/test-waiters';
import { task } from 'ember-concurrency';
import ModelRegistry from 'ember-data/types/registries/model';

import { layout } from 'ember-osf-web/decorators/component';

import BaseDataComponent from '../base-data-component';
import template from './template';

@layout(template)
export default class PaginatedAll extends BaseDataComponent {
    // Required arguments
    modelName!: keyof ModelRegistry;

    // Private properties
    @service store!: Store;

    @task
    @waitFor
    async loadItemsTask() {
        const items = await this.store.query(this.modelName, {
            page: this.page,
            'page[size]': this.pageSize,
            ...this.query,
        });

        this.setProperties({
            items: items.toArray(),
            totalCount: items.meta.total,
            errorShown: false,
        });
    }
}
