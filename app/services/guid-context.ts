import { alias } from '@ember-decorators/object/computed';
import { service } from '@ember-decorators/service';
import Service from '@ember/service';
import { task, TaskInstance } from 'ember-concurrency';
import DS from 'ember-data';

import Guid, { ReferentModel, ReferentModelName } from 'ember-osf-web/models/guid';

/**
 * Track the GUID-referred object (node, user, file, etc.) that is currently at the root of the app.
 *
 * In a service so it can easily be shared with engines.
 */
export default class GuidContextService extends Service {
    @service store!: DS.Store;

    id?: string;

    @alias('taskInstance.last.value')
    model?: ReferentModel;

    @alias('taskInstance.last.isRunning')
    loading?: boolean;

    taskInstance?: TaskInstance<ReferentModel>;

    loadModel = task(function *(
        this: GuidContextService,
        id: string,
        expectedType?: ReferentModelName,
    ) {
        if (expectedType) {
            return yield this.store.findRecord(expectedType, id);
        } else {
            const guid: Guid = yield this.store.findRecord('guid', id, { backgroundReload: false });
            return yield guid.resolve();
        }
    }).restartable();

    /**
     * Set the current root-level GUID.
     *
     * @param id The current GUID.
     * @param expectedType Optional name of the model referred to by the guid.
     */
    setContext(
        this: GuidContextService,
        id: string,
        expectedType?: ReferentModelName,
    ) {
        const taskInstance = this.get('loadModel').perform(id, expectedType);
        this.setProperties({ taskInstance, id });
        return taskInstance;
    }

    clearContext(this: GuidContextService) {
        this.get('loadModel').cancelAll();
        this.setProperties({
            taskInstance: undefined,
            id: undefined,
        });
    }
}
