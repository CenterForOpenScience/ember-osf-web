import { assert } from '@ember/debug';
import { defineProperty } from '@ember/object';
import { or, reads } from '@ember/object/computed';
import { TaskInstance } from 'ember-concurrency';
import { task } from 'ember-concurrency-decorators';

import { layout } from 'ember-osf-web/decorators/component';
import OsfModel from 'ember-osf-web/models/osf-model';
import defaultTo from 'ember-osf-web/utils/default-to';
import BaseDataComponent, { LoadItemsOptions } from '../base-data-component';
import template from './template';

@layout(template)
export default class PaginatedHasMany extends BaseDataComponent {
    // Required arguments
    relationshipName!: string;

    // Either model xor modelTaskInstance is required
    model?: OsfModel;
    modelTaskInstance?: TaskInstance<OsfModel>;

    // Optional arguments
    usePlaceholders: boolean = defaultTo(this.usePlaceholders, true);

    // Private properties
    @task({ withTestWaiter: true })
    loadItemsTask = task(function *(this: PaginatedHasMany, { reloading }: LoadItemsOptions) {
        const model = yield this.get('getModelTask').perform();
        if (this.usePlaceholders) {
            yield this.get('loadRelatedCountTask').perform(reloading);
            // Don't bother querying if we already know there's nothing there.
            if (this.totalCount === 0) {
                return;
            }
        }
        const items = yield model.queryHasMany(
            this.relationshipName,
            {
                page: this.page,
                'page[size]': this.pageSize,
                ...this.query,
            },
        );

        this.setProperties({
            items,
            totalCount: items.meta.total,
            errorShown: false,
        });
    });

    @task({ withTestWaiter: true })
    getModelTask = task(function *(this: PaginatedHasMany) {
        let model = this.modelInstance;
        if (!model && this.modelTaskInstance) {
            model = yield this.modelTaskInstance;
        }
        if (!model) {
            throw new Error('Error loading model');
        }
        return model;
    });

    @task({ withTestWaiter: true, restartable: true })
    loadRelatedCountTask = task(function *(this: PaginatedHasMany, reloading: boolean) {
        const model = yield this.get('getModelTask').perform();
        if (reloading || typeof this.totalCount === 'undefined') {
            yield model.loadRelatedCount(this.relationshipName);
        }
    });

    @or('model', 'modelTaskInstance.value')
    modelInstance?: OsfModel;

    init() {
        super.init();

        assert(
            'Must provide either `model` xor `modelTaskInstance` to {{paginated-list/has-many}}',
            Boolean(this.model) !== Boolean(this.modelTaskInstance),
        );

        defineProperty(
            this,
            'totalCount',
            reads(`modelInstance.relatedCounts.${this.relationshipName}`),
        );
    }
}
