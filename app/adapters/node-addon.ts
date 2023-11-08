import OsfAdapter from './osf-adapter';

export default class NodeAddonAdapter extends OsfAdapter {
}

declare module 'ember-data/types/registries/adapter' {
    export default interface AdapterRegistry {
        'node-addon': NodeAddonAdapter;
    } // eslint-disable-line semi
}
