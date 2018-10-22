import OsfAdapter from './osf-adapter';

export default class Taxonomy extends OsfAdapter {}

declare module 'ember-data/types/registries/adapter' {
    export default interface AdapterRegistry {
        taxonomy: Taxonomy;
    } // eslint-disable-line semi
}
