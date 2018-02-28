import OsfSerializer from './osf-serializer';

export default OsfSerializer.extend({
    modelNameFromPayloadKey() {
        return 'file-provider';
    },
});
