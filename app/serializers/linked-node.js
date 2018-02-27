import OsfSerializer from './osf-serializer';

// TODO Dawn - a linked-node serializer is actually using the node model - Ember doesn't like this.
// Need to figure out a better place to create the request.
export default OsfSerializer.extend({
    serializeIntoHash(hash_, typeClass, snapshot, options) {
        const hash = hash_;
        if (options.forRelationship) {
            hash.data = [{
                id: snapshot.record.get('id'),
                type: typeClass.modelName === 'registration' ? 'linked_registrations' : 'linked_nodes',
            }];
            return hash;
        }
        return this._super(hash, typeClass, snapshot, options);
    },
});
