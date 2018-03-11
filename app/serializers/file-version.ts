import OsfSerializer from './osf-serializer';

export default class FileVersion extends OsfSerializer {}

declare module 'ember-data' {
    interface SerializerRegistry {
        'file-version': FileVersion;
    }
}
