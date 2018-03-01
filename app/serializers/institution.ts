import DS from 'ember-data'; // eslint-disable-line no-unused-vars
import { pluralize } from 'ember-inflector';
import OsfSerializer from './osf-serializer';

export default class Institution extends OsfSerializer.extend({
    serializeIntoHash(hash_: any, typeClass: {modelName: string}, snapshot: DS.Snapshot, options: object): any {
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
}) {}

// DO NOT DELETE: this is how TypeScript knows how to look up your serializers.
declare module 'ember-data' {
    interface SerializerRegistry {
        'institution': Institution;
    }
}
