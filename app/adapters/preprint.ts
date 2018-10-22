import DS from 'ember-data';
import PreprintModel from 'ember-osf-web/models/preprint';
import PreprintSerializer from 'ember-osf-web/serializers/preprint';
import RSVP from 'rsvp';
import OsfAdapter from './osf-adapter';

export default class Preprint extends OsfAdapter {
    updateRecord(
        store: DS.Store,
        type: PreprintModel,
        snapshot: DS.Snapshot,
    ): RSVP.Promise<any> {
        const data: object = {};
        const modelName = 'preprint';
        const serializer: PreprintSerializer = store.serializerFor(modelName);

        serializer.serializeIntoHash(data, type, snapshot, { includeId: true });

        const { id } = snapshot;
        const url: string = this.buildURL(modelName, id, snapshot, 'updateRecord');

        return this.ajax(url, 'PATCH', { data });
    }
}

declare module 'ember-data/types/registries/adapter' {
    export default interface AdapterRegistry {
        preprint: Preprint;
    } // eslint-disable-line semi
}
