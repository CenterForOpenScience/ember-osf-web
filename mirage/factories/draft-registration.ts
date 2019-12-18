import { association, Factory, faker, trait, Trait } from 'ember-cli-mirage';

import DraftRegistration from 'ember-osf-web/models/draft-registration';

import { NodeCategory } from 'ember-osf-web/models/node';

import { createRegistrationMetadata } from './utils';

export interface DraftRegistrationTraits {
    withRegistrationMetadata: Trait;
}

export default Factory.extend<DraftRegistration & DraftRegistrationTraits>({
    registrationSupplement: 'abcdefghijklmnopqrstuvwxyz',

    title() {
        return faker.lorem.sentence();
    },

    description() {
        return faker.lorem.paragraph();
    },

    tags() {
        return Array.from({ length: 5 }, () => faker.lorem.word());
    },

    datetimeInitiated() {
        return faker.date.past(1, new Date(2015, 0, 0));
    },

    datetimeUpdated() {
        return faker.date.past(2, new Date(2018, 0, 0));
    },

    branchedFrom: association() as DraftRegistration['branchedFrom'],

    initiator: association() as DraftRegistration['initiator'],

    registrationSchema: association() as DraftRegistration['registrationSchema'],

    affiliatedInstitutions: association() as DraftRegistration['affiliatedInstitutions'],

    subjects: association() as DraftRegistration['subjects'],

    license: association() as DraftRegistration['license'],

    registrationMetadata: {},

    nodeLicense: null,

    category: NodeCategory.Uncategorized,

    withRegistrationMetadata: trait<DraftRegistration>({
        afterCreate(draftRegistration) {
            draftRegistration.update({
                registrationMetadata: createRegistrationMetadata(draftRegistration.registrationSchema),
            });
        },
    }),
});

declare module 'ember-cli-mirage/types/registries/schema' {
    export default interface MirageSchemaRegistry {
        draftRegistrations: DraftRegistration;
    } // eslint-disable-line semi
}
