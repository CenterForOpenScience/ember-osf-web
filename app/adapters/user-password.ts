// import DS from 'ember-data';
import config from 'ember-get-config';

import OsfAdapter from './osf-adapter';

const {
    OSF: {
        apiUrl: host,
        apiNamespace: namespace,
    },
} = config;

export default class UserPasswordAdapter extends OsfAdapter {
    host = host;
    namespace = namespace;

    urlForCreateRecord(): string {
        // modelName = modelName;
        // snapshot = snapshot;
        return 'hello';
        // const userID = snapshot.user.id;
        // return `${host}/${namespace}/users/${userID}/settings/password/`;
    }
}

declare module 'ember-data/types/registries/adapter' {
    export default interface AdapterRegistry {
        'user-password': UserPasswordAdapter;
    } // eslint-disable-line semi
}
