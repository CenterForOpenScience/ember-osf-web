import DS from 'ember-data';
import OsfSerializer from './osf-serializer';

export default class NodeLink extends OsfSerializer.extend({
    serialize(snapshot: DS.Snapshot, options: any): any {
        const serialized: any = this._super(snapshot, options);
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
    },
}) {}

declare module 'ember-data' {
    interface SerializerRegistry {
        'node-link': NodeLink;
    }
}
