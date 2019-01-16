import DS from 'ember-data';
import RSVP from 'rsvp';

import PreprintModel from 'ember-osf-web/models/preprint';

import OsfAdapter from './osf-adapter';

export default class PreprintAdapter extends OsfAdapter {
    updateRecord(
        store: DS.Store,
        type: PreprintModel,
        snapshot: DS.Snapshot,
    ): RSVP.Promise<any> {
        const data: object = {};
        const modelName = 'preprint';
        const serializer = store.serializerFor(modelName);

        serializer.serializeIntoHash(data, type, snapshot, { includeId: true });

        const { id } = snapshot;
        const url = this.buildURL(modelName, id, snapshot, 'updateRecord');

        return this.ajax(url, 'PATCH', { data });
    }
}

declare module 'ember-data/types/registries/adapter' {
    export default interface AdapterRegistry {
        preprint: PreprintAdapter;
    } // eslint-disable-line semi
}
