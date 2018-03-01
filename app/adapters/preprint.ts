import DS from 'ember-data'; // eslint-disable-line no-unused-vars
import OsfAdapter from './osf-adapter';

export default class Preprint extends OsfAdapter {
    updateRecord = function(store: DS.Store, type: {modelName: string}, snapshot: DS.Snapshot): Promise<any> {
        const data: object = {};
        const serializer: DS.Serializer = store.serializerFor(type.modelName);

        serializer.serializeIntoHash(data, type, snapshot, { includeId: true });

        const { id } = snapshot;
        const url: string = this.buildURL(type.modelName, id, snapshot, 'updateRecord');

        return this.ajax(url, 'PATCH', { data });
    };
}

// DO NOT DELETE: this is how TypeScript knows how to look up your adapters.
declare module 'ember-data' {
    interface AdapterRegistry {
        'preprint': Preprint;
    }
}
