import DS from 'ember-data';
import OsfAdapter from './osf-adapter';

const requestTypes = ['createRecord', 'updateRecord', 'deleteRecord'];

export default class Collection extends OsfAdapter.extend({
    buildURL(
        this: Collection,
        modelName: 'collection',
        id: string,
        snapshot: DS.Snapshot,
        requestType: string,
    ): string {
        // Embed linked_nodes
        const base: string = this._super(modelName, id, snapshot, requestType);

        if (requestTypes.includes(requestType)) {
            return base;
        }

        return `${base}?embed=linked_nodes`;
    },
}) {
}

declare module 'ember-data' {
    interface AdapterRegistry {
        'collection': Collection;
    }
}
