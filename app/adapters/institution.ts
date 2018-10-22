import OsfAdapter from './osf-adapter';

export default class Institution extends OsfAdapter {}

declare module 'ember-data/types/registries/adapter' {
    export default interface AdapterRegistry {
        institution: Institution;
    } // eslint-disable-line semi
}
