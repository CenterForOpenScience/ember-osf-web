import { assert } from '@ember/debug';
import { defineProperty } from '@ember/object';
import { or, reads } from '@ember/object/computed';
import { TaskInstance } from 'ember-concurrency';
import { restartableTask, task } from 'ember-concurrency-decorators';
import { taskFor } from 'ember-concurrency-ts';

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

    @or('model', 'modelTaskInstance.value')
    modelInstance?: OsfModel;

    // Private properties
    @task({ withTestWaiter: true })
    loadItemsTask = taskFor(async function(this: PaginatedHasMany, { reloading }: LoadItemsOptions) {
        const model = await taskFor(this.getModelTask).perform();
        if (this.usePlaceholders) {
            await taskFor(this.loadRelatedCountTask).perform(reloading);
            // Don't bother querying if we already know there's nothing there.
            if (this.totalCount === 0) {
                return;
            }
        }
        const items = await model.queryHasMany(
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
    async getModelTask() {
        let model = this.modelInstance;
        if (!model && this.modelTaskInstance) {
            model = await this.modelTaskInstance;
        }
        if (!model) {
            throw new Error('Error loading model');
        }
        return model;
    }

    @restartableTask({ withTestWaiter: true })
    async loadRelatedCountTask(reloading: boolean) {
        const model = await taskFor(this.getModelTask).perform();
        if (reloading || typeof this.totalCount === 'undefined') {
            await model.loadRelatedCount(this.relationshipName);
        }
    }

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
