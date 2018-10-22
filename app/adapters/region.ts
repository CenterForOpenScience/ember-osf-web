import OsfAdapter from './osf-adapter';

export default class RegionSerializer extends OsfAdapter {}

declare module 'ember-data/types/registries/adapter' {
    export default interface AdapterRegistry {
        region: RegionSerializer;
    } // eslint-disable-line semi
}
