import DS from 'ember-data';
import { pluralize } from 'ember-inflector';
import OsfSerializer from './osf-serializer';

export default class Institution extends OsfSerializer.extend({
    serializeIntoHash(
        hash: any,
        typeClass: {modelName: string},
        snapshot: DS.Snapshot,
        options: {forRelationship?: boolean},
    ): any {
        if (options.forRelationship) {
            return {
                ...hash,
                data: [{
                    id: snapshot.record.get('id'),
                    type: pluralize(typeClass.modelName),
                }],
            };
        }

        return this._super(hash, typeClass, snapshot, options);
    },
}) {}

declare module 'ember-data' {
    interface SerializerRegistry {
        'institution': Institution;
    }
}
