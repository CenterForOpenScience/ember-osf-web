import { association, Factory } from 'ember-cli-mirage';
import faker from 'faker';
import { RevisionReviewStates } from 'ember-osf-web/models/schema-response';
import SchemaResponseActionModel, { SchemaResponseActionTrigger } from 'ember-osf-web/models/schema-response-action';

export default Factory.extend<SchemaResponseActionModel>({
    fromState: RevisionReviewStates.RevisionInProgress,
    toState: RevisionReviewStates.Unapproved,
    actionTrigger: faker.random.objectElement(Object.values(SchemaResponseActionTrigger)),

    comment() {
        return faker.lorem.sentence();
    },

    dateCreated() {
        return faker.date.past(3);
    },

    dateModified() {
        return faker.date.recent(5);
    },

    creator: association() as SchemaResponseActionModel['creator'],
});

declare module 'ember-cli-mirage/types/registries/model' {
    export default interface MirageModelRegistry {
        'schema-response-action': SchemaResponseActionModel;
    } // eslint-disable-line semi
}

declare module 'ember-cli-mirage/types/registries/schema' {
    export default interface MirageSchemaRegistry {
        schemaResponseActions: SchemaResponseActionModel;
    } // eslint-disable-line semi
}
