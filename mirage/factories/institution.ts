import { Factory, faker, trait, Trait } from 'ember-cli-mirage';

import Institution from 'ember-osf-web/models/institution';

import { placekitten, randomGravatar } from '../utils';

export interface InstitutionTraits {
    withInstitutionalUsers: Trait;
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
    withInstitutionalUsers: trait<Institution>({
        afterCreate(institution, server) {
            server.createList('institutional-user', 15, { institution });
        },
    }),
    currentUserIsAdmin: true,
});

declare module 'ember-cli-mirage/types/registries/schema' {
    export default interface MirageSchemaRegistry {
        institutions: Institution;
    } // eslint-disable-line semi
}
