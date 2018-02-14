import Ember from 'ember';
import OsfSerializer from './osf-serializer';

export default OsfSerializer.extend({
    serialize(snapshot, options = {}) {
        // Restore relationships to serialized data
        const serialized = this._super(snapshot, options);

        let opts = {};

        if (snapshot.record.get('isNew')) {
            opts = {
                includeUser: true,
            };
        }
        Ember.merge(opts, options);

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
});
