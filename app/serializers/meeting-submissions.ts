import OsfSerializer from './osf-serializer';

export default class MeetingSubmissionsSerializer extends OsfSerializer {
}

declare module 'ember-data/types/registries/serializer' {
    export default interface SerializerRegistry {
        'meeting-submissions': MeetingSubmissionsSerializer;
    } // eslint-disable-line semi
}
