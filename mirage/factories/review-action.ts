import { association, Factory } from 'ember-cli-mirage';
import faker from 'faker';

import ReviewActionModel, { ReviewActionTrigger } from 'ember-osf-web/models/review-action';

export default Factory.extend<ReviewActionModel>({
    auto: false,
    visible: true,
    fromState: 'initial',
    toState: 'pending',
    actionTrigger: faker.random.objectElement(Object.values(ReviewActionTrigger)),

    afterCreate(reviewAction) {
        if (reviewAction.target) {
            reviewAction.update({
                provider: reviewAction.target.provider,
            });
        }
    },

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
        reviewAction: ReviewActionModel;
    } // eslint-disable-line semi
}
