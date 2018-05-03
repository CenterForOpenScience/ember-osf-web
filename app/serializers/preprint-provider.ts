import OsfSerializer from './osf-serializer';

export default class PreprintProvider extends OsfSerializer {}

declare module 'ember-data' {
    interface SerializerRegistry {
        'preprint-provider': PreprintProvider;
    }
}
