import OsfSerializer from './osf-serializer';

export default class DraftRegistration extends OsfSerializer {}

declare module 'ember-data' {
    interface SerializerRegistry {
        'draft-registration': DraftRegistration;
    }
}
