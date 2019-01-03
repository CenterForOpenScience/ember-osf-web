import { service } from '@ember-decorators/service';
import Route from '@ember/routing/route';
import { task, TaskInstance } from 'ember-concurrency';
import DS, { ModelRegistry } from 'ember-data';
import Ready from 'ember-osf-web/services/ready';

export interface GuidRouteModel<T> {
    taskInstance: TaskInstance<T>;
}

// Note: this class is to provide a small amount of backwards compatibility.
// Don't use it if you're making something new.
export default abstract class GuidRoute extends Route.extend({}) {
    @service ready!: Ready;
    @service store!: DS.Store;

    getModel = task(function *(this: GuidRoute, guid: string) {
        const blocker = this.ready.getBlocker();

        const model = yield this.store.findRecord(this.modelName(), guid, {
            adapterOptions: this.adapterOptions(),
        });

        blocker.done();

        return model;
    });

    abstract modelName(): keyof ModelRegistry;

    adapterOptions(): {} {
        return {};
    }

    model(params: { guid: string }) {
        return {
            [`${this.modelName()}Id`]: params.guid,
            taskInstance: this.get('getModel').perform(params.guid),
        };
    }
}
