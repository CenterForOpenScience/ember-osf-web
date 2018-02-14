import OsfSerializer from './osf-serializer';

export default OsfSerializer.extend({
    // Because `trigger` is a private method on DS.Model
    attrs: {
        actionTrigger: 'trigger',
    },
    // Serialize `target` relationship
    relationshipTypes: {
        target: 'preprints',
    },
});
