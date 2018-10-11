import OsfAdapter from './osf-adapter';

export default class UserEmailAdapter extends OsfAdapter {
    paarentRelationship = 'user';
}

declare module 'ember-data' {
    interface AdapterRegistry {
        'user-email': UserEmailAdapter;
    }
}
