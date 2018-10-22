import DS from 'ember-data';
import OsfSerializer from './osf-serializer';

export default class Comment extends OsfSerializer.extend({
    serialize(snapshot: DS.Snapshot, options?: object): any {
        // Add relationships field to identify comment target
        const serialized: any = this._super(snapshot, options);

        const targetID: string = snapshot.record.get('targetID');
        const targetType: string = snapshot.record.get('targetType');

        if (targetID && targetType) {
            serialized.data.relationships = {
                target: {
                    data: {
                        id: targetID,
                        type: targetType,
                    },
                },
            };
        }

        return serialized;
    },
}) {}

declare module 'ember-data/types/registries/serializer' {
    export default interface SerializerRegistry {
        comment: Comment;
    } // eslint-disable-line semi
}
