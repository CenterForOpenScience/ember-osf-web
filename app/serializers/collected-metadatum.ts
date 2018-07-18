import Osf from './osf-serializer';

export default class CollectedMetadatum extends Osf {
}

declare module 'ember-data' {
    interface SerializerRegistry {
        'collected-metadatum': CollectedMetadatum;
    }
}
