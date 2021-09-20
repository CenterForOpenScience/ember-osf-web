import { association, Factory, Trait, trait } from 'ember-cli-mirage';
import faker from 'faker';

import SchemaResponseModel, { RevisionReviewStates } from 'ember-osf-web/models/schema-response';

export interface MirageSchemaResponseModel extends SchemaResponseModel {
    registrationId: string;
}
export interface SchemaResponseTraits {
    withRevisionActions: Trait;
}

export default Factory.extend<MirageSchemaResponseModel & SchemaResponseTraits>({
    dateCreated() {
        return faker.date.past(1, new Date(2015, 0, 0));
    },

    dateModified() {
        return faker.date.past(2, new Date(2018, 0, 0));
    },

    reviewState() {
        return RevisionReviewStates.RevisionInProgress;
    },

    isPendingCurrentUserApproval() {
        return false;
    },
    initiatedBy: association(),

    afterCreate(schemaResponse) {
        if (schemaResponse.registration) {
            schemaResponse.registrationSchema = schemaResponse.registration.registrationSchema;
            schemaResponse.save();
        }
    },

    withRevisionActions: trait<MirageSchemaResponseModel>({
        afterCreate(schemaResponse, server) {
            const revisionActions = server.createList('revision-action', 3, { target: schemaResponse });
            schemaResponse.update({ actions: revisionActions });
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
