import { Factory, faker, trait, Trait } from 'ember-cli-mirage';

import Institution from 'ember-osf-web/models/institution';

import { placekitten, randomGravatar } from '../utils';

export interface InstitutionTraits {
    withInstitutionalUsers: Trait;
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
    withInstitutionalUsers: trait<Institution>({
        afterCreate(institution, server) {
            const institutionalUsers = server.createList('institutional-user', 15);
            institution.set('institutionalUsers', institutionalUsers);
        },
    }),
    withSummaryMetrics: trait<Institution>({
        afterCreate(institution, server) {
            const summaryMetrics = server.create('institution-summary-metric');
            institution.set('institutionSummaryMetrics', summaryMetrics);
        },
    }),
});

declare module 'ember-cli-mirage/types/registries/schema' {
    export default interface MirageSchemaRegistry {
        institutions: Institution;
    } // eslint-disable-line semi
}
