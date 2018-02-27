import OsfSerializer from './osf-serializer';

import { pluralize } from 'ember-inflector';

export default OsfSerializer.extend({
    serializeIntoHash(hash_, typeClass, snapshot, options) {
        const hash = hash_;
        if (options.forRelationship) {
            hash.data = [{
                id: snapshot.record.get('id'),
                type: pluralize(typeClass.modelName),
            }];
            return hash;
        }
        return this._super(hash, typeClass, snapshot, options);
    },
});
