import OsfSerializer from './osf-serializer';

export default class MeetingSubmissionSerializer extends OsfSerializer {
}

declare module 'ember-data/types/registries/serializer' {
    export default interface SerializerRegistry {
        'meeting-submission': MeetingSubmissionSerializer;
    } // eslint-disable-line semi
}
