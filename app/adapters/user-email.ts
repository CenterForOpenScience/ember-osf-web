import OsfAdapter from './osf-adapter';

export default class UserEmailAdapter extends OsfAdapter {
}

declare module 'ember-data' {
    interface AdapterRegistry {
        'user-email': UserEmailAdapter;
    }
}
