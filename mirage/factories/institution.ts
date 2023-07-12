import { Factory, trait, Trait } from 'ember-cli-mirage';
import faker from 'faker';

import Institution from 'ember-osf-web/models/institution';

import { placekitten, randomGravatar } from '../utils';

export interface InstitutionTraits {
    withMetrics: Trait;
}

export default Factory.extend<Institution & InstitutionTraits>({
    name() {
        return faker.company.companyName();
    },
    description() {
        return faker.company.catchPhrase();
    },
    assets() {
        return {
            banner: placekitten(512, 80),
            logo: randomGravatar(100),
        };
    },
    currentUserIsAdmin: true,
    lastUpdated() {
        return faker.date.recent();
    },
    withMetrics: trait<Institution>({
        afterCreate(institution, server) {
            const userMetrics = server.createList('institution-user', 15);
            const departmentMetrics = server.createList('institution-department', 12);
            const userCount = userMetrics.length;
            let publicProjectCount = 0;
            let privateProjectCount = 0;
            userMetrics.forEach(({ publicProjects, privateProjects }) => {
                publicProjectCount += publicProjects;
                privateProjectCount += privateProjects;
            });
            const summaryMetrics = server.create('institution-summary-metric', { id: institution.id });
            summaryMetrics.update({ publicProjectCount, privateProjectCount, userCount });
            institution.update({ userMetrics, departmentMetrics, summaryMetrics });
        },
    }),
});

declare module 'ember-cli-mirage/types/registries/schema' {
    export default interface MirageSchemaRegistry {
        institutions: Institution;
    } // eslint-disable-line semi
}
