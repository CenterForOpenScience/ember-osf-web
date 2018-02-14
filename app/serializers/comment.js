import OsfSerializer from './osf-serializer';

export default OsfSerializer.extend({
    serialize(snapshot) {
        // Add relationships field to identify comment target
        const serialized = this._super(...arguments);

        const targetID = snapshot.record.get('targetID');
        const targetType = snapshot.record.get('targetType');

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
});
