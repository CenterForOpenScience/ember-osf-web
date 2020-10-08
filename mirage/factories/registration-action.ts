import { association, Factory } from 'ember-cli-mirage';
import faker from 'faker';

import RegistrationActionModel from 'ember-osf-web/models/registration-action';

export default Factory.extend<RegistrationActionModel>({
    auto: false,
    visible: true,
    fromState: 'initial',
    toState: 'pending',

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

    provider: association() as RegistrationActionModel['provider'],
    target: association() as RegistrationActionModel['target'],
    creator: association() as RegistrationActionModel['creator'],
});

declare module 'ember-cli-mirage/types/registries/model' {
    export default interface MirageModelRegistry {
        'registration-action': RegistrationActionModel;
    } // eslint-disable-line semi
}

declare module 'ember-cli-mirage/types/registries/schema' {
    export default interface MirageSchemaRegistry {
        registrationAction: RegistrationActionModel;
    } // eslint-disable-line semi
}
