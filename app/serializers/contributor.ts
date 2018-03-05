import { merge } from '@ember/polyfills';
import DS from 'ember-data'; // eslint-disable-line no-unused-vars
import OsfSerializer from './osf-serializer';

export default class Contributor extends OsfSerializer.extend({
    serialize(snapshot: DS.Snapshot, options: object = {}): any {
        // Restore relationships to serialized data
        const serialized: any = this._super(snapshot, options);

        let opts: { includeUser?: boolean } = {};

        if (snapshot.record.get('isNew')) {
            opts = {
                includeUser: true,
            };
        }
        merge(opts, options);

        // APIv2 expects contributor information to be nested under relationships.
        if (opts.includeUser) {
            serialized.data.relationships = {
                users: {
                    data: {
                        id: snapshot.record.get('userId'),
                        type: 'users',
                    },
                },
            };
        }
        return serialized;
    },
}) {}


declare module 'ember-data' {
    interface SerializerRegistry {
        'contributor': Contributor;
    }
}
