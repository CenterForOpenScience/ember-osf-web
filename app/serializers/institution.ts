import DS from 'ember-data';
import { pluralize } from 'ember-inflector';

import InstitutionModel from 'ember-osf-web/models/institution';

import OsfSerializer from './osf-serializer';

export default class InstitutionSerializer extends OsfSerializer {
    serializeIntoHash(
        hash: {},
        typeClass: InstitutionModel,
        snapshot: DS.Snapshot,
        options: { forRelationship?: boolean },
    ) {
        if (options.forRelationship) {
            return {
                ...hash,
                data: [{
                    id: snapshot.record.id,
                    type: pluralize(typeClass.modelName),
                }],
            };
        }

        return super.serializeIntoHash(hash, typeClass, snapshot, options);
    }
}

declare module 'ember-data/types/registries/serializer' {
    export default interface SerializerRegistry {
        institution: InstitutionSerializer;
    } // eslint-disable-line semi
}
