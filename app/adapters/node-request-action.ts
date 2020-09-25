import OsfAdapter from './osf-adapter';

export default class NodeRequestActionAdapter extends OsfAdapter {
    parentRelationship = 'provider';
}

declare module 'ember-data/types/registries/adapter' {
    export default interface AdapterRegistry {
        'node-request-action': NodeRequestActionAdapter;
    } // eslint-disable-line semi
}
