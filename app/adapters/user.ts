import OsfAdapter from './osf-adapter';

export default class User extends OsfAdapter {
}

declare module 'ember-data/types/registries/adapter' {
    export default interface AdapterRegistry {
        user: User;
    } // eslint-disable-line semi
}
