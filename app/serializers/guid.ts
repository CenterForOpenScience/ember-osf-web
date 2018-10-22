import OsfSerializer from './osf-serializer';

export default class Guid extends OsfSerializer.extend({
}) {}

declare module 'ember-data/types/registries/serializer' {
    export default interface SerializerRegistry {
        guid: Guid;
    } // eslint-disable-line semi
}
