import OsfAdapter from './osf-adapter';

export default class Collection extends OsfAdapter.extend({
    buildURL(_: any, __: any, ___: any, requestType: string): string {
        // Embed linked_nodes
        const base: string = this._super(...arguments);
        if (['createRecord', 'updateRecord', 'deleteRecord'].indexOf(requestType) === -1) {
            return `${base}?embed=linked_nodes`;
        } else {
            return base;
        }
    },
}) {
}

// DO NOT DELETE: this is how TypeScript knows how to look up your adapters.
declare module 'ember-data' {
    interface AdapterRegistry {
        'collection': Collection;
    }
}
