import OsfAdapter from './osf-adapter';

export default class UserEmailAdapter extends OsfAdapter {
    parentRelationship = 'user';
}

declare module 'ember-data/types/registries/adapter' {
    export default interface AdapterRegistry {
        'user-email': UserEmailAdapter;
    } // eslint-disable-line semi
}
