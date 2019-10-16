import { association, Factory, faker } from 'ember-cli-mirage';

import InstitutionalUser from 'ember-osf-web/models/institutional-user';

export default Factory.extend<InstitutionalUser>({
    institution: association() as InstitutionalUser['institution'],
    user: association() as InstitutionalUser['user'],
    department() {
        return faker.random.arrayElement(['Architecture', 'Biology', 'Psychology']);
    },
    publicProjectCount() {
        return faker.random.number({ min: 0, max: 99 });
    },
    privateProjectCount() {
        return faker.random.number({ min: 0, max: 99 });
    },
    afterCreate(institutionalUser, server) {
        if (!institutionalUser.userFullName && !institutionalUser.userGuid) {
            const user = server.create('user');
            institutionalUser.update({
                user,
                userFullName: user.fullName,
                userGuid: user.id,
            });
        }
    },
});

declare module 'ember-cli-mirage/types/registries/schema' {
    export default interface MirageSchemaRegistry {
        'institutional-user': InstitutionalUser;
    } // eslint-disable-line semi
}
