import { service } from '@ember-decorators/service';
import Service from '@ember/service';
import { task, TaskInstance } from 'ember-concurrency';
import DS from 'ember-data';

import Guid, { ReferentModel, ReferentModelName } from 'ember-osf-web/models/guid';

export interface Query {
    related_counts?: string; // eslint-disable-line camelcase
}

interface AdapterOptions {
    query?: Query;
}

/**
 * Holds route information that might be needed by engines, e.g. the current guid
 * at the root of the route's path and the object it refers to.
 */
export default class RouteContextService extends Service {
    @service store!: DS.Store;

    guid?: string;
    modelName?: ReferentModelName;
    guidTaskInstance?: TaskInstance<ReferentModel>;

    loadModel = task(function *(
        this: RouteContextService,
        guid: string,
        expectedType?: ReferentModelName,
        query?: Query,
    ) {
        const adapterOptions: AdapterOptions = {};
        if (query) {
            adapterOptions.query = query;
        }
        if (expectedType) {
            this.set('modelName', expectedType);
            return yield this.store.findRecord(expectedType, guid, { adapterOptions });
        } else {
            const guidModel: Guid = yield this.store.findRecord(
                'guid',
                guid,
                { backgroundReload: false, adapterOptions },
            );
            this.set('modelName', guidModel.referentType);
            return yield guidModel.resolve();
        }
    }).restartable();

    /**
     * Set the current root-level GUID.
     *
     * @param guid The current GUID.
     * @param expectedType Optional name of the model referred to by the guid.
     */
    setGuid(
        this: RouteContextService,
        guid: string,
        expectedType?: ReferentModelName,
        query?: Query,
    ) {
        const guidTaskInstance = this.get('loadModel').perform(guid, expectedType, query);
        this.setProperties({ guidTaskInstance, guid });
        return guidTaskInstance;
    }

    /**
     * Clear the current root-level GUID.
     */
    clearGuid(this: RouteContextService) {
        this.get('loadModel').cancelAll();
        this.setProperties({
            guid: undefined,
            modelName: undefined,
            guidTaskInstance: undefined,
        });
    }
}
