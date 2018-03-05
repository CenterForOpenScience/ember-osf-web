import DS from 'ember-data'; // eslint-disable-line no-unused-vars
import OsfAdapter from './osf-adapter';

export default class Node extends OsfAdapter.extend({
    buildURL(modelName: string, id: string, snapshot: DS.Adapter, requestType: string): string {
        if (requestType === 'createRecord') {
            const parent: any = snapshot.record.belongsTo('parent').belongsToRelationship.members.list[0];
            if (parent) {
                return this._buildRelationshipURL(
                    parent.createSnapshot(),
                    'children',
                );
            }
        }
        return this._super(...arguments);
    },

    _handleRelatedRequest(_: any, __: any, ___: any, relationship: string): any | void {
        if (relationship.includes('license')) {
            return;
        }
        return this._super(...arguments);
    },
}) {
}


declare module 'ember-data' {
    interface AdapterRegistry {
        'node': Node;
    }
}
