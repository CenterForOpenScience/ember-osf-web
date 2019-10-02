import { association, Factory, faker } from 'ember-cli-mirage';

import InstitutionalUser from 'ember-osf-web/models/institutional-user';

export default Factory.extend<InstitutionalUser>({
    institution: association() as InstitutionalUser['institution'],
    user: association() as InstitutionalUser['user'],
    userFullName() {
        return `${faker.name.firstName()} ${faker.name.lastName()}`;
    },
    department() {
        return faker.name.jobTitle();
    },
    publicProjectCount() {
        return faker.random.number();
    },
    privateProjectCount() {
        return faker.random.number();
    },
});

declare module 'ember-cli-mirage/types/registries/schema' {
    export default interface MirageSchemaRegistry {
        'institutional-user': InstitutionalUser;
    } // eslint-disable-line semi
}
