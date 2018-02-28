import OsfSerializer from './osf-serializer';

export default OsfSerializer.extend({
    // Serialize license relationship
    relationshipTypes: {
        license: 'licenses',
    },
});
