import OsfAdapter from './osf-adapter';

export default class License extends OsfAdapter {}

declare module 'ember-data/types/registries/adapter' {
    export default interface AdapterRegistry {
        license: License;
    } // eslint-disable-line semi
}
