import OsfSerializer from './osf-serializer';

export default class Contributor extends OsfSerializer {
    attrs = {
        ...this.attrs, // from OsfSerializer
        user: 'users',
    };
}

declare module 'ember-data' {
    interface SerializerRegistry {
        'contributor': Contributor;
    }
}
