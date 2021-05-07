import DS from 'ember-data';
import OsfAdapter from './osf-adapter';

const requestTypes = ['createRecord', 'updateRecord', 'deleteRecord'];

export default class CollectionAdapter extends OsfAdapter {
    buildURL(
        modelName?: string | number,
        id?: string,
        snapshot?: DS.Snapshot | null,
        requestType?: string,
    ) {
        // Embed linked_nodes
        const base = super.buildURL(modelName, id, snapshot, requestType);

        if (requestType && requestTypes.includes(requestType)) {
            return base;
        }

        return `${base}?embed=linked_nodes`;
    }
}

declare module 'ember-data/types/registries/adapter' {
    export default interface AdapterRegistry {
        collection: CollectionAdapter;
    } // eslint-disable-line semi
}
