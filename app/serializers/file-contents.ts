import OsfSerializer from './osf-serializer';

export default class FileContents extends OsfSerializer {}


declare module 'ember-data' {
    interface SerializerRegistry {
        'file-contents': FileContents;
    }
}
