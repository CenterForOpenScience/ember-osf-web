import OsfAdapter from './osf-adapter';

export default class UserAdapter extends OsfAdapter {
}

declare module 'ember-data/types/registries/adapter' {
    export default interface AdapterRegistry {
        user: UserAdapter;
    } // eslint-disable-line semi
}
