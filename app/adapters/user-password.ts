import config from 'ember-get-config';

import OsfAdapter from './osf-adapter';

const {
    OSF: {
        apiUrl: host,
        apiNamespace: namespace,
    },
} = config;

export default class UserPasswordAdapter extends OsfAdapter {
    urlForCreateRecord(): string {
        if (this.currentUser && this.currentUser.user && this.currentUser.user.id) {
            return `${host}/${namespace}/users/${this.currentUser.user.id}/settings/password/`;
        }
        throw Error('Must provide valid user');
    }
}

declare module 'ember-data/types/registries/adapter' {
    export default interface AdapterRegistry {
        'user-password': UserPasswordAdapter;
    } // eslint-disable-line semi
}
