import { association, Factory } from 'ember-cli-mirage';
import faker from 'faker';

import InstitutionUser from 'ember-osf-web/models/institution-user';

export default Factory.extend<InstitutionUser>({
    user: association() as InstitutionUser['user'],
    department() {
        return faker.random.arrayElement(['Architecture', 'Biology', 'Psychology']);
    },
    publicProjects() {
        return faker.random.number({ min: 0, max: 99 });
    },
    privateProjects() {
        return faker.random.number({ min: 0, max: 99 });
    },
    afterCreate(institutionUser, server) {
        if (!institutionUser.userName && !institutionUser.userGuid) {
            const user = server.create('user');
            institutionUser.update({
                user,
                userName: user.fullName,
                userGuid: user.id,
            });
        }
    },
});

declare module 'ember-cli-mirage/types/registries/schema' {
    export default interface MirageSchemaRegistry {
        'institution-user': InstitutionUser;
    } // eslint-disable-line semi
}
