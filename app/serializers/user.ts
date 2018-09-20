import OsfSerializer from './osf-serializer';

export default class User extends OsfSerializer {
    attrs: any = {
        // from OsfSerializer
        ...this.attrs, // eslint-disable-line ember/no-attrs-in-components

        unconfirmedEmails: {
            serialize: false,
        },
    };
}

declare module 'ember-data' {
    interface SerializerRegistry {
        'user': User;
    }
}
