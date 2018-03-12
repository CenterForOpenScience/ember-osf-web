import DS from 'ember-data';
import OsfSerializer from './osf-serializer';

export default class LinkedNode extends OsfSerializer.extend({
    serializeIntoHash(
        hash: object,
        typeClass: {modelName: string},
        snapshot: DS.Snapshot,
        options: {forRelationship?: boolean},
    ): any {
        if (options.forRelationship) {
            return {
                ...hash,
                data: [{
                    id: snapshot.record.get('id'),
                    type: typeClass.modelName === 'registration' ? 'linked_registrations' : 'linked_nodes',
                }],
            };
        }

        return this._super(hash, typeClass, snapshot, options);
    },
}) {}

declare module 'ember-data' {
    interface SerializerRegistry {
        'linked-node': LinkedNode;
    }
}
