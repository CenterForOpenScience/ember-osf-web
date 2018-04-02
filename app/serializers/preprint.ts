import OsfSerializer from './osf-serializer';

export default class Preprint extends OsfSerializer {}

declare module 'ember-data' {
    interface SerializerRegistry {
        'preprint': Preprint;
    }
}
