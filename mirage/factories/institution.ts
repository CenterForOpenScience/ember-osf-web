import { Factory, faker, trait, Trait } from 'ember-cli-mirage';

import Institution from 'ember-osf-web/models/institution';

import { placekitten, randomGravatar } from '../utils';

export interface InstitutionTraits {
    withInstitutionDepartments: Trait;
    withInstitutionUsers: Trait;
    withSummaryMetrics: Trait;
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
    withInstitutionUsers: trait<Institution>({
        afterCreate(institution, server) {
            const userMetrics = server.createList('institution-user', 15);
            institution.update({ userMetrics });
        },
    }),
    withInstitutionDepartments: trait<Institution>({
        afterCreate(institution, server) {
            const institutionDepartments = server.createList('institution-department', 7);
            institution.update({ institutionDepartments });
        },
    }),
    withSummaryMetrics: trait<Institution>({
        afterCreate(institution, server) {
            const institutionSummaryMetrics = server.create('institution-summary-metric');
            institution.update({ institutionSummaryMetrics });
        },
    }),
});

declare module 'ember-cli-mirage/types/registries/schema' {
    export default interface MirageSchemaRegistry {
        institutions: Institution;
    } // eslint-disable-line semi
}
