import OsfAdapter from './osf-adapter';

export default class ProviderAdapter extends OsfAdapter {
}

declare module 'ember-data/types/registries/adapter' {
    export default interface AdapterRegistry {
        provider: ProviderAdapter;
    } // eslint-disable-line semi
}
