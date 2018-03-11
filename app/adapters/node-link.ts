import OsfAdapter from './osf-adapter';

export default class NodeLink extends OsfAdapter {}

declare module 'ember-data' {
    interface AdapterRegistry {
        'node-link': NodeLink;
    }
}
