import ArrayProxy from '@ember/array/proxy';
import { inject as service } from '@ember/service';
import { task } from 'ember-concurrency-decorators';
import DS from 'ember-data';
import ModelRegistry from 'ember-data/types/registries/model';

import { layout } from 'ember-osf-web/decorators/component';
import OsfModel from 'ember-osf-web/models/osf-model';
import { PaginatedMeta } from 'osf-api';

import BaseDataComponent from '../base-data-component';
import template from './template';

interface ArrayProxyWithMeta<T> extends ArrayProxy<T> {
    meta: PaginatedMeta;
}

@layout(template)
export default class PaginatedAll extends BaseDataComponent {
    // Required arguments
    modelName!: keyof ModelRegistry;

    // Private properties
    @service store!: DS.Store;

    @task({ withTestWaiter: true })
    async loadItemsTask() {
        const items = await this.store.query(this.modelName, {
            page: this.page,
            'page[size]': this.pageSize,
            ...this.query,
        }) as ArrayProxyWithMeta<OsfModel>;

        this.setProperties({
            items: items.toArray(),
            totalCount: items.meta.total,
            errorShown: false,
        });
    }
}
