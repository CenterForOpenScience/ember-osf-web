// @ts-ignore
import { association, Factory, faker, trait } from 'ember-cli-mirage';

import { createRegistrationMetadata } from './utils';

export default Factory.extend({
    registrationSupplement: 'abcdefghijklmnopqrstuvwxyz',

    datetimeInitiated() {
        return faker.date.recent(5);
    },

    datetimeUpdated() {
        return faker.date.recent(5);
    },

    branchedFrom: association(),

    initiator: association(),

    registrationSchema: association(),

    registrationMetadata: {},

    withRegistrationMetadata: trait({
        afterCreate(draftRegistration: any) {
            draftRegistration.update({
                registrationMetadata: createRegistrationMetadata(draftRegistration.registrationSchema.schemaNoConflict),
            });
        },
    }),
});
