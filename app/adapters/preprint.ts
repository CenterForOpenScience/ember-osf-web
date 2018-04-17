import DS from 'ember-data';
import OsfAdapter from './osf-adapter';

export default class Preprint extends OsfAdapter {
    updateRecord(
        this: Preprint,
        store: DS.Store,
        type: {modelName: 'preprint' | 'node'},
        snapshot: DS.Snapshot,
    ): Promise<any> {
        const data: object = {};
        const serializer: DS.JSONAPISerializer = store.serializerFor(type.modelName);

        serializer.serializeIntoHash(data, type, snapshot, { includeId: true });

        const { id } = snapshot;
        const url: string = this.buildURL(type.modelName, id, snapshot, 'updateRecord');

        return this.ajax(url, 'PATCH', { data });
    }
}

declare module 'ember-data' {
    interface AdapterRegistry {
        'preprint': Preprint;
    }
}
