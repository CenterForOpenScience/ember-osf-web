import OsfAdapter from './osf-adapter';

export default class UserAddonAdapter extends OsfAdapter {
}

declare module 'ember-data/types/registries/adapter' {
    export default interface AdapterRegistry {
        userAddon: UserAddonAdapter;
    } // eslint-disable-line semi
}
