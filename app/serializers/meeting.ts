import OsfSerializer from './osf-serializer';

export default class MeetingSerializer extends OsfSerializer {
}

declare module 'ember-data/types/registries/serializer' {
    export default interface SerializerRegistry {
        meeting: MeetingSerializer;
    } // eslint-disable-line semi
}
