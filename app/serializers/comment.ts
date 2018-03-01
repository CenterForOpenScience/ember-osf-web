import DS from 'ember-data'; // eslint-disable-line no-unused-vars
import OsfSerializer from './osf-serializer';

export default class Comment extends OsfSerializer.extend({
    serialize(snapshot: DS.Snapshot): any {
        // Add relationships field to identify comment target
        const serialized: any = this._super(...arguments);

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

// DO NOT DELETE: this is how TypeScript knows how to look up your serializers.
declare module 'ember-data' {
    interface SerializerRegistry {
        'comment': Comment;
    }
}
