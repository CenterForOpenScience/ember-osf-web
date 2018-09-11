import { association, Factory, faker, trait, Trait } from 'ember-cli-mirage';

import DraftRegistration from 'ember-osf-web/models/draft-registration';

import { createRegistrationMetadata } from './utils';

export interface DraftRegistrationTraits {
    withRegistrationMetadata: Trait;
}

export default Factory.extend<DraftRegistration & DraftRegistrationTraits>({
    registrationSupplement: 'abcdefghijklmnopqrstuvwxyz',

    datetimeInitiated() {
        return faker.date.recent(5);
    },

    datetimeUpdated() {
        return faker.date.recent(5);
    },

    branchedFrom: association() as DraftRegistration['branchedFrom'],

    initiator: association() as DraftRegistration['initiator'],

    registrationSchema: association() as DraftRegistration['registrationSchema'],

    registrationMetadata: {},

    withRegistrationMetadata: trait({
        afterCreate(draftRegistration: any) {
            draftRegistration.update({
                registrationMetadata: createRegistrationMetadata(draftRegistration.registrationSchema.schemaNoConflict),
            });
        },
    }),
});
