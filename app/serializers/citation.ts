import OsfSerializer from './osf-serializer';

export default class Citation extends OsfSerializer {}

declare module 'ember-data' {
    interface SerializerRegistry {
        'citation': Citation;
    }
}
