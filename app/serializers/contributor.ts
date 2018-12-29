import DS from 'ember-data';

import OsfSerializer from './osf-serializer';

export default class ContributorSerializer extends OsfSerializer {
    serialize(snapshot: DS.Snapshot, options = {}) {
        // Restore relationships to serialized data
        const serialized = super.serialize(snapshot, options);

        // APIv2 expects contributor information to be nested under relationships.
        if (snapshot.record.isNew) {
            serialized.data.relationships = {
                users: {
                    data: {
                        id: snapshot.record.userId,
                        type: 'users',
                    },
                },
            };
        }

        return serialized;
    }
}

declare module 'ember-data/types/registries/serializer' {
    export default interface SerializerRegistry {
        contributor: ContributorSerializer;
    } // eslint-disable-line semi
}
