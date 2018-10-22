import OsfAdapter from './osf-adapter';

export default class NodeLink extends OsfAdapter {}

declare module 'ember-data/types/registries/adapter' {
    export default interface AdapterRegistry {
        'node-link': NodeLink;
    } // eslint-disable-line semi
}
