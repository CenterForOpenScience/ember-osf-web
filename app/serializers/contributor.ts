import OsfSerializer from './osf-serializer';

export default class Contributor extends OsfSerializer {
}

declare module 'ember-data' {
    interface SerializerRegistry {
        'contributor': Contributor;
    }
}
