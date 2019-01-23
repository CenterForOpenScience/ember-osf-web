import OsfSerializer from './osf-serializer';

export default class DeveloperAppSerializer extends OsfSerializer {
    attrs: any = {
        // eslint-disable-next-line ember/no-attrs-in-components
        ...this.attrs, // from OsfSerializer

        clientSecret: {
            serialize: false,
        },
        clientId: {
            serialize: false,
        },
    };
}

declare module 'ember-data/types/registries/serializer' {
    export default interface SerializerRegistry {
        'developer-app': DeveloperAppSerializer;
    } // eslint-disable-line semi
}
