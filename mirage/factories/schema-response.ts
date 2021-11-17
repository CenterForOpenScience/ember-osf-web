import { association, Factory, Trait, trait } from 'ember-cli-mirage';
import faker from 'faker';

import SchemaResponseModel, { RevisionReviewStates } from 'ember-osf-web/models/schema-response';

export interface MirageSchemaResponseModel extends SchemaResponseModel {
    registrationId: string;
}
export interface SchemaResponseTraits {
    withSchemaResponseActions: Trait;
}

export default Factory.extend<MirageSchemaResponseModel & SchemaResponseTraits>({
    dateCreated() {
        return faker.date.past(1, new Date(2015, 0, 0));
    },

    dateModified() {
        return faker.date.past(2, new Date(2018, 0, 0));
    },

    reviewsState() {
        return RevisionReviewStates.RevisionInProgress;
    },

    isPendingCurrentUserApproval() {
        return false;
    },

    isOriginalResponse: false,

    initiatedBy: association(),

    afterCreate(schemaResponse) {
        if (schemaResponse.registration) {
            schemaResponse.registrationSchema = schemaResponse.registration.registrationSchema;
            if (!schemaResponse.revisionResponses) {
                schemaResponse.revisionResponses = schemaResponse.registration.registrationResponses;
            }
            schemaResponse.save();
        }
    },

    withSchemaResponseActions: trait<MirageSchemaResponseModel>({
        afterCreate(schemaResponse, server) {
            const schemaResponseActions = server.createList('schema-response-action', 3, { target: schemaResponse });
            schemaResponse.update({ actions: schemaResponseActions });
        },
    }),
});

declare module 'ember-cli-mirage/types/registries/model' {
    export default interface MirageModelRegistry {
        'schema-response': MirageSchemaResponseModel;
    } // eslint-disable-line semi
}

declare module 'ember-cli-mirage/types/registries/schema' {
    export default interface MirageSchemaRegistry {
        schemaResponses: MirageSchemaResponseModel;
    } // eslint-disable-line semi
}
