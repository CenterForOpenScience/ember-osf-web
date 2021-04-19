import OsfSerializer from './osf-serializer';

export default class ContributorSerializer extends OsfSerializer {
    serialize(snapshot: DS.Snapshot, options: {}) {
        const serialized = super.serialize(snapshot, options);
        delete serialized!.data!.relationships!.node;
        delete serialized!.data!.relationships!.draft_registration;

        return serialized;
    }
}

declare module 'ember-data/types/registries/serializer' {
    export default interface SerializerRegistry {
        contributor: ContributorSerializer;
    } // eslint-disable-line semi
}
