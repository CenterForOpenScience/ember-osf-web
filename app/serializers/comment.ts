import DS from 'ember-data';

import OsfSerializer from './osf-serializer';

export default class CommentSerializer extends OsfSerializer {
    serialize(snapshot: DS.Snapshot, options: {}) {
        // Add relationships field to identify comment target
        const serialized = super.serialize(snapshot, options);

        const { targetID, targetType } = snapshot.record;

        if (targetID && targetType && serialized.data.relationships) {
            serialized.data.relationships.target = {
                data: {
                    id: targetID,
                    type: targetType,
                },
            };
        }

        return serialized;
    }
}

declare module 'ember-data/types/registries/serializer' {
    export default interface SerializerRegistry {
        comment: CommentSerializer;
    } // eslint-disable-line semi
}
