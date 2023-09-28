import Store from '@ember-data/store';
import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import { waitFor } from '@ember/test-waiters';
import { Task, task, TaskInstance } from 'ember-concurrency';
import { taskFor } from 'ember-concurrency-ts';
import ModelRegistry from 'ember-data/types/registries/model';

import Ready from 'ember-osf-web/services/ready';

export interface GuidRouteModel<T> {
    guid: string;
    taskInstance: TaskInstance<T>;
    task: Task<T, []>;
}

// Note: this class is to provide a small amount of backwards compatibility.
// Don't use it if you're making something new.
export default abstract class GuidRoute extends Route {
    @service ready!: Ready;
    @service store!: Store;

    abstract modelName(): keyof ModelRegistry;

    @task
    @waitFor
    async getModel(guid: string) {
        try {
            const blocker = this.ready.getBlocker();
            const model = await this.store.findRecord(this.modelName(), guid, {
                include: this.include(),
                adapterOptions: this.adapterOptions(),
            });
            blocker.done();
            return model;
        } catch (e) {
            // To do custom error handling, add an error() action to the route that subclasses GuidRoute.
            this.send('error', e);
        }
    }

    adapterOptions(): {} {
        return {};
    }

    include(): string[] {
        return [];
    }

    model(params: { guid: string }) {
        const paramsGuid = params.guid;
        return {
            guid: paramsGuid,
            taskInstance: taskFor(this.getModel).perform(params.guid),
            task: this.getModel,
        };
    }

    buildRouteInfoMetadata() {
        return {
            osfMetrics: {
                itemGuid: this.controller.model.guid,
            },
        };
    }
}
