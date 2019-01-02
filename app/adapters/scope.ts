import OsfAdapter from './osf-adapter';

export default class ScopeAdapter extends OsfAdapter {
}

declare module 'ember-data/types/registries/adapter' {
    export default interface AdapterRegistry {
        scope: ScopeAdapter;
    } // eslint-disable-line semi
}
