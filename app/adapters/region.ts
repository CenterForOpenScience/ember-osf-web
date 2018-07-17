import OsfAdapter from './osf-adapter';

export default class RegionSerializer extends OsfAdapter {}

declare module 'ember-data' {
    interface AdapterRegistry {
        'region': RegionSerializer;
    }
}
