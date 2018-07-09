import DS from 'ember-data';
import OsfAdapter from './osf-adapter';

export default class Metaschema extends OsfAdapter.extend({
    buildURL(this: Metaschema, modelName: string, id: string, snapshot: DS.Snapshot, requestType: string): string {
        return `${this._super(modelName, id, snapshot, requestType)}registrations`;
    },
}) {}

declare module 'ember-data' {
    interface AdapterRegistry {
        'metaschema': Metaschema;
    }
}
