import DS from 'ember-data';
import { Resource } from 'osf-api';
import OsfSerializer from './osf-serializer';

export default class ModeratorSerializer extends OsfSerializer {
    serialize(snapshot: DS.Snapshot, options: {}) {
        const serialized = super.serialize(snapshot, options);
        if (serialized.data.id) {
            serialized.data.attributes!.id = serialized.data.id;
            delete (serialized.data as Partial<Resource>).id;
        }
        delete serialized.data.relationships;
        return serialized;
    }
}

declare module 'ember-data/types/registries/serializer' {
    export default interface SerializerRegistry {
        moderator: ModeratorSerializer;
    } // eslint-disable-line semi
}
