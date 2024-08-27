import { association, Factory } from 'ember-cli-mirage';
import faker from 'faker';

import InstitutionUser from 'ember-osf-web/models/institution-user';

export default Factory.extend<InstitutionUser>({
    user: association() as InstitutionUser['user'],
    department() {
        return faker.random.arrayElement(['Architecture', 'Biology', 'Psychology']);
    },
    lastLogAction() {
        return faker.random.arrayElement(['Created Project', 'Deleted File', 'Uploaded File']);
    },
    publicProjects() {
        return faker.random.number({ min: 0, max: 99 });
    },
    privateProjects() {
        return faker.random.number({ min: 0, max: 99 });
    },
    publicRegistrationCount() {
        return faker.random.number({ min: 0, max: 50 });
    },
    embargoedRegistrationCount() {
        return faker.random.number({ min: 0, max: 50 });
    },
    publishedPreprintCount() {
        return faker.random.number({ min: 0, max: 50 });
    },
    publicFileCount() {
        return faker.random.number({ min: 0, max: 100 });
    },
    storageByteCount() {
        return faker.random.number({ min: 1e7, max: 1e9 }); // Between 10MB and 1GB
    },
    totalObjectCount() {
        return faker.random.number({ min: 0, max: 1000 });
    },
    monthLastLogin() {
        return faker.date.past(1); // Any date within the past year
    },
    monthLastActive() {
        return faker.date.past(1); // Any date within the past year
    },
    accountCreationDate() {
        return faker.date.past(10); // Any date within the past 10 years
    },
    orcidId() {
        return faker.random.uuid(); // Simulate an ORCID ID
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
