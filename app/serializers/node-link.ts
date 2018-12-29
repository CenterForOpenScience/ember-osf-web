import DS from 'ember-data';

import OsfSerializer from './osf-serializer';

export default class NodeLinkSerializer extends OsfSerializer {
    serialize(snapshot: DS.Snapshot, options: {}) {
        const serialized = super.serialize(snapshot, options);
        // APIv2 expects node link information to be nested under relationships.
        serialized.data.relationships = {
            nodes: {
                data: {
                    id: snapshot.record.target,
                    type: 'nodes',
                },
            },
        };
        return serialized;
    }
}

declare module 'ember-data/types/registries/serializer' {
    export default interface SerializerRegistry {
        'node-link': NodeLinkSerializer;
    } // eslint-disable-line semi
}
