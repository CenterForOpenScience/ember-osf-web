import { association, Factory } from 'ember-cli-mirage';
import faker from 'faker';

import { CollectionSubmissionReviewStates } from 'ember-osf-web/models/collection-submission';
import CollectionSubmissionAction,
{
    CollectionSubmissionActionTrigger,
} from 'ember-osf-web/models/collection-submission-action';

export default Factory.extend<CollectionSubmissionAction>({
    auto: false,
    visible: true,
    fromState: faker.random.objectElement(Object.values(CollectionSubmissionReviewStates)),
    toState: faker.random.objectElement(Object.values(CollectionSubmissionReviewStates)),
    actionTrigger: faker.random.objectElement(Object.values(CollectionSubmissionActionTrigger)),

    comment() {
        return faker.lorem.sentence();
    },

    dateCreated() {
        return faker.date.past(3);
    },

    dateModified() {
        return faker.date.recent(5);
    },

    creator: association() as CollectionSubmissionAction['creator'],
});

declare module 'ember-cli-mirage/types/registries/model' {
    export default interface MirageModelRegistry {
        'collection-submission-action': CollectionSubmissionAction;
    } // eslint-disable-line semi
}

declare module 'ember-cli-mirage/types/registries/schema' {
    export default interface MirageSchemaRegistry {
        collectionSubmissionActions: CollectionSubmissionAction;
    } // eslint-disable-line semi
}
