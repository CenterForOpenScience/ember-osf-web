import DS from 'ember-data';

import OsfAdapter from './osf-adapter';

export default class NodeAdapter extends OsfAdapter {
    buildURL(modelName: string, id: string, snapshot: DS.Snapshot, requestType: string): string {
        if (requestType === 'createRecord') {
            const parent: any = snapshot.record.belongsTo('parent').belongsToRelationship.members.list[0];

            if (parent) {
                return this.buildRelationshipURL(parent.createSnapshot(), 'children');
            }
        }

        return super.buildURL(modelName, id, snapshot, requestType);
    }
}

declare module 'ember-data/types/registries/adapter' {
    export default interface AdapterRegistry {
        node: NodeAdapter;
    } // eslint-disable-line semi
}
