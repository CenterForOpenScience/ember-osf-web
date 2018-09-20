import { association, Factory, faker } from 'ember-cli-mirage';

import UserEmail from 'ember-osf-web/models/user-email';

export default Factory.extend<UserEmail>({
    emailAddress() {
        return faker.internet.email();
    },
    confirmed: true,
    verified: true,
    primary: false,

    user: association(),
});
