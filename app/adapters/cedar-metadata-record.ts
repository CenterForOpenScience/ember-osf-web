import Store from '@ember-data/store';
import DS from 'ember-data';
import RSVP from 'rsvp';

import OsfAdapter from './osf-adapter';

export default class CedarMetadataRecordAdapter extends OsfAdapter {
    updateRecord(
        store: Store,
        type: CedarMetadataRecordAdapter,
        snapshot: DS.Snapshot,
    ): RSVP.Promise<any> {
        const data: object = {};
        const modelName = 'cedar-metadata-record';
        const serializer = store.serializerFor(modelName);

        serializer.serializeIntoHash(data, type, snapshot, { includeId: true });

        const { id } = snapshot;
        const url = this.buildURL(modelName, id, snapshot, 'updateRecord');

        return this.ajax(url, 'PATCH', { data });
    }
}

declare module 'ember-data/types/registries/adapter' {
    export default interface AdapterRegistry {
        'cedar-metadata-record': CedarMetadataRecordAdapter;
    } // eslint-disable-line semi
}
