import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import { TaskInstance } from 'ember-concurrency';
import { task } from 'ember-concurrency-decorators';
import DS from 'ember-data';
import ModelRegistry from 'ember-data/types/registries/model';

import Ready from 'ember-osf-web/services/ready';

export interface GuidRouteModel<T> {
    guid: string;
    taskInstance: TaskInstance<T>;
}

// Note: this class is to provide a small amount of backwards compatibility.
// Don't use it if you're making something new.
export default abstract class GuidRoute extends Route {
    @service ready!: Ready;

    @service store!: DS.Store;

    @task
    getModel = task(function *(this: GuidRoute, guid: string) {
        const blocker = this.ready.getBlocker();

        let model;
        try {
            model = yield this.store.findRecord(this.modelName(), guid, {
                include: this.include(),
                adapterOptions: this.adapterOptions(),
            });
        } catch (e) {
            // To do custom error handling, add an error() action to the route that subclasses GuidRoute.
            this.send('error', e);
        }

        blocker.done();

        return model;
    });

    abstract modelName(): keyof ModelRegistry;

    adapterOptions(): {} {
        return {};
    }

    include(): string[] {
        return [];
    }

    model(params: { guid: string }) {
        return {
            guid: params.guid,
            taskInstance: this.getModel.perform(params.guid),
        };
    }
}
