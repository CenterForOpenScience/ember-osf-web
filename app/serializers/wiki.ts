import OsfSerializer from './osf-serializer';

export default class Wiki extends OsfSerializer {}

declare module 'ember-data' {
    interface SerializerRegistry {
        'wiki': Wiki;
    }
}
