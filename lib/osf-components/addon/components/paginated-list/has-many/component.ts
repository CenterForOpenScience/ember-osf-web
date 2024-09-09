import { assert } from '@ember/debug';
import { defineProperty } from '@ember/object';
import { or, reads } from '@ember/object/computed';
import { waitFor } from '@ember/test-waiters';
import { restartableTask, task, TaskInstance } from 'ember-concurrency';
import { taskFor } from 'ember-concurrency-ts';
import { RelationshipsFor } from 'ember-data';

import { layout } from 'ember-osf-web/decorators/component';
import OsfModel from 'ember-osf-web/models/osf-model';
import BaseDataComponent, { LoadItemsOptions } from '../base-data-component';
import template from './template';

@layout(template)
export default class PaginatedHasMany extends BaseDataComponent {
    // Required arguments
    relationshipName!: RelationshipsFor<OsfModel>;

    // Either model xor modelTaskInstance is required
    model?: OsfModel;
    modelTaskInstance?: TaskInstance<OsfModel>;

    @or('model', 'modelTaskInstance.value')
    modelInstance?: OsfModel;

    // Optional arguments
    usePlaceholders = true;

    // Private properties
    @task
    @waitFor
    async loadItemsTask({ reloading }: LoadItemsOptions) {
        const model = await taskFor(this.getModelTask).perform();
        if (this.usePlaceholders) {
            await taskFor(this.loadRelatedCountTask).perform(reloading);
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
    }

    @task
    @waitFor
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

    @restartableTask
    @waitFor
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
