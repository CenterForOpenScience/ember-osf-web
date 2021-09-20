import { association, Factory } from 'ember-cli-mirage';
import faker from 'faker';
import { RevisionReviewStates } from 'ember-osf-web/models/schema-response';
import RevisionActionModel, { RevisionActionTrigger } from 'ember-osf-web/models/revision-action';

export default Factory.extend<RevisionActionModel>({
    fromState: RevisionReviewStates.RevisionInProgress,
    toState: RevisionReviewStates.RevisionPendingAdminApproval,
    actionTrigger: faker.random.objectElement(Object.values(RevisionActionTrigger)),

    comment() {
        return faker.lorem.sentence();
    },

    dateCreated() {
        return faker.date.past(3);
    },

    dateModified() {
        return faker.date.recent(5);
    },

    creator: association() as RevisionActionModel['creator'],
});

declare module 'ember-cli-mirage/types/registries/model' {
    export default interface MirageModelRegistry {
        'revision-action': RevisionActionModel;
    } // eslint-disable-line semi
}

declare module 'ember-cli-mirage/types/registries/schema' {
    export default interface MirageSchemaRegistry {
        revisionActions: RevisionActionModel;
    } // eslint-disable-line semi
}
