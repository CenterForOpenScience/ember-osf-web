import { association, Factory } from 'ember-cli-mirage';
import faker from 'faker';

import ReviewActionModel from 'ember-osf-web/models/review-action';

export default Factory.extend<ReviewActionModel>({
    auto: false,
    visible: true,
    fromState: 'initial',
    toState: 'pending',

    afterCreate(reviewAction) {
        if (reviewAction.target) {
            reviewAction.update({
                provider: reviewAction.target.provider,
            });
        }
    },

    actionTrigger() {
        return 'Submit';
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

    provider: association() as ReviewActionModel['provider'],
    target: association() as ReviewActionModel['target'],
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
