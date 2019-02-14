import { association, Factory, faker, trait, Trait } from 'ember-cli-mirage';

import DraftRegistration from 'ember-osf-web/models/draft-registration';

import { createRegistrationMetadata } from './utils';

export interface DraftRegistrationTraits {
    withRegistrationMetadata: Trait;
}

export default Factory.extend<DraftRegistration & DraftRegistrationTraits>({
    registrationSupplement: 'abcdefghijklmnopqrstuvwxyz',

    datetimeInitiated() {
        return faker.date.past(1, new Date(2015, 0, 0));
    },

    datetimeUpdated() {
        return faker.date.past(2, new Date(2018, 0, 0));
    },

    branchedFrom: association() as DraftRegistration['branchedFrom'],

    initiator: association() as DraftRegistration['initiator'],

    registrationSchema: association() as DraftRegistration['registrationSchema'],

    registrationMetadata: {},

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
