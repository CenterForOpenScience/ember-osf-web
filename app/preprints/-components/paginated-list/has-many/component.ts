import { defineProperty } from '@ember/object';
import { reads } from '@ember/object/computed';
import { waitFor } from '@ember/test-waiters';
import { task } from 'ember-concurrency';
import { inject as service } from '@ember/service';
import Store from '@ember-data/store';
import { layout } from 'ember-osf-web/decorators/component';
import BaseDataComponent from '../base-data-component';
import template from './template';

@layout(template)
export default class PaginatedHasMany extends BaseDataComponent {
    // Services
    @service store!: Store;

    // Required arguments
    modelName!: string;

    // Optional arguments
    usePlaceholders = true;

    // Private properties
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

    init() {
        super.init();

        defineProperty(
            this,
            'totalCount',
            reads('items.length'),
        );
    }
}
