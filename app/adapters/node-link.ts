import OsfAdapter from './osf-adapter';

export default class NodeLinkAdapter extends OsfAdapter {
}

declare module 'ember-data/types/registries/adapter' {
    export default interface AdapterRegistry {
        'node-link': NodeLinkAdapter;
    } // eslint-disable-line semi
}
