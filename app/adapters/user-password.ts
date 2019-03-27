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
        let userID = '';
        if (this.currentUser && this.currentUser.user && this.currentUser.user.id) {
            userID = this.currentUser.user.id;
        } else {
            throw Error('Must provide valid user');
        }
        return `${host}/${namespace}/users/${userID}/settings/password/`;
    }
}

declare module 'ember-data/types/registries/adapter' {
    export default interface AdapterRegistry {
        'user-password': UserPasswordAdapter;
    } // eslint-disable-line semi
}
