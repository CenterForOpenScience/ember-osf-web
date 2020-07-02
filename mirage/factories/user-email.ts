import { association, Factory } from 'ember-cli-mirage';
import faker from 'faker';

import UserEmail from 'ember-osf-web/models/user-email';

export default Factory.extend<UserEmail>({
    emailAddress() {
        return faker.internet.email();
    },
    isMerge() {
        return faker.random.boolean();
    },
    confirmed: true,
    verified: true,
    primary: false,

    user: association(),
});

declare module 'ember-cli-mirage/types/registries/schema' {
    export default interface MirageSchemaRegistry {
        userEmails: UserEmail;
    } // eslint-disable-line semi
}
