import { service } from '@ember-decorators/service';
import { task } from 'ember-concurrency';
import DS, { ModelRegistry } from 'ember-data';

import BaseDataComponent from '../base-data-component';
import layout from './template';

export default class PaginatedAll extends BaseDataComponent {
    // Required arguments
    modelName!: keyof ModelRegistry;

    // Private properties
    @service store!: DS.Store;
    layout = layout;

    loadItemsTask = task(function *(this: PaginatedAll) {
        const items: any = yield this.store.query(this.modelName, {
            page: this.page,
            'page[size]': this.pageSize,
            ...this.query,
        });

        this.setProperties({
            items: items.toArray(),
            totalCount: items.meta.total,
            errorShown: false,
        });
    });
}
