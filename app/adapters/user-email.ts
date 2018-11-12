import OsfAdapter from './osf-adapter';

export default class UserEmailAdapter extends OsfAdapter {
    parentRelationship = 'user';
}

declare module 'ember-data' {
    interface AdapterRegistry {
        'user-email': UserEmailAdapter;
    }
}
