import OsfSerializer from './osf-serializer';

export default class IdentitySerializer extends OsfSerializer.extend({
    attrs: {
        name: 'id',
    },
}) {}

declare module 'ember-data' {
    interface SerializerRegistry {
        'identity': IdentitySerializer;
    }
}
