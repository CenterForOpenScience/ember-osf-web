import DS from 'ember-data';
import OsfAdapter from './osf-adapter';

export default class Node extends OsfAdapter.extend({
    buildURL(this: Node, modelName: string, id: string, snapshot: DS.Snapshot, requestType: string): string {
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

    _handleRelatedRequest(this: Node, _: any, __: any, ___: any, relationship: string): any | void {
        if (!relationship.includes('license')) {
            return this._super(...arguments);
        }
    },
}) {
}

declare module 'ember-data' {
    interface AdapterRegistry {
        'node': Node;
    }
}
