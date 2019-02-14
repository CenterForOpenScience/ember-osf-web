import OsfAdapter from './osf-adapter';

export default class UserPasswordAdapter extends OsfAdapter {
}

declare module 'ember-data/types/registries/adapter' {
    export default interface AdapterRegistry {
        'user-password': UserPasswordAdapter;
    } // eslint-disable-line semi
}
