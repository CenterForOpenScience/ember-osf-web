import { Factory, faker, trait, Trait } from 'ember-cli-mirage';

import Institution from 'ember-osf-web/models/institution';

import { placekitten, randomGravatar } from '../utils';

export interface InstitutionTraits {
    withInstitutionalUsers: Trait;
    withStatSummary: Trait;
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
    withInstitutionalUsers: trait<Institution>({
        afterCreate(institution, server) {
            server.createList('institutional-user', 15, { institution });
        },
    }),
    withStatSummary: trait<Institution>({
        statSummary() {
            return {
                departments: ['Architecture', 'Biology', 'Psychology'].map(department => ({
                    name: department,
                    numUsers: faker.random.number({ min: 0, max: 99 }),
                })),
                numPrivateProjects: faker.random.number({ min: 0, max: 999 }),
                numPublicProjects: faker.random.number({ min: 0, max: 999 }),
            };
        },
    }),
});

declare module 'ember-cli-mirage/types/registries/schema' {
    export default interface MirageSchemaRegistry {
        institutions: Institution;
    } // eslint-disable-line semi
}
