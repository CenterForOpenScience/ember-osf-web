import OsfAdapter from './osf-adapter';

export default class TokenAdapter extends OsfAdapter {
}

declare module 'ember-data/types/registries/adapter' {
    export default interface AdapterRegistry {
        token: TokenAdapter;
    } // eslint-disable-line semi
}
