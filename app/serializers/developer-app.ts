import OsfSerializer from './osf-serializer';

export default class DeveloperAppSerializer extends OsfSerializer {
    attrs: any = {
        ...this.attrs, // from OsfSerializer
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
