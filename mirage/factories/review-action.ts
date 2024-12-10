import { association, Factory } from 'ember-cli-mirage';
import faker from 'faker';

import ReviewActionModel, { ReviewActionTrigger } from 'ember-osf-web/models/review-action';

export interface TargetRelationship {
    id: string | number;
    type: 'registrations' | 'preprints';
}
export interface MirageReviewAction {
    creatorId: string;
    targetId: TargetRelationship;
}

export default Factory.extend<ReviewActionModel>({
    auto: false,
    visible: true,
    fromState: 'initial',
    toState: 'pending',
    actionTrigger: faker.random.objectElement(Object.values(ReviewActionTrigger)),

    comment() {
        return faker.lorem.sentence();
    },

    dateCreated() {
        return faker.date.past(3);
    },

    dateModified() {
        return faker.date.recent(5);
    },

    creator: association() as ReviewActionModel['creator'],
});

declare module 'ember-cli-mirage/types/registries/model' {
    export default interface MirageModelRegistry {
        'review-action': ReviewActionModel;
    } // eslint-disable-line semi
}

declare module 'ember-cli-mirage/types/registries/schema' {
    export default interface MirageSchemaRegistry {
        reviewActions: ReviewActionModel;
    } // eslint-disable-line semi
}
