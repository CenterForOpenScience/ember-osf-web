import OsfAdapter from './osf-adapter';

export default class User extends OsfAdapter {
}

declare module 'ember-data' {
    interface AdapterRegistry {
        user: User;
    }
}
