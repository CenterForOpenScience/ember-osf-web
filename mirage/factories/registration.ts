import { association, faker, trait, Trait } from 'ember-cli-mirage';

import Registration from 'ember-osf-web/models/registration';

import NodeFactory from './node';
import { createRegistrationMetadata, guid, guidAfterCreate } from './utils';

export interface RegistrationTraits {
    withRegisteredMeta: Trait;
    withComments: Trait;
}

export default NodeFactory.extend<Registration & RegistrationTraits>({
    id: guid('registration'),
    afterCreate: guidAfterCreate,

    registration: true,
    dateRegistered() {
        return faker.date.recent(5);
    },
    pendingRegistrationApproval() {
        return faker.random.boolean();
    },
    archiving() {
        return faker.random.boolean();
    },
    embargoed() {
        return faker.random.boolean();
    },
    embargoEndDate() {
        return faker.date.future(1);
    },
    pendingEmbargoApproval() {
        return faker.random.boolean();
    },
    withdrawn() {
        return faker.random.boolean();
    },
    withdrawalJustification() {
        return faker.hacker.phrase();
    },
    pendingWithdrawal() {
        return faker.random.boolean();
    },
    registrationSchema: association() as Registration['registrationSchema'],

    registeredMeta: {},

    withRegisteredMeta: trait({
        afterCreate(registration: any) {
            registration.update({
                registeredMeta: createRegistrationMetadata(registration.registrationSchema.schemaNoConflict, true),
            });
        },
    }),
    withComments: trait({
        afterCreate(registration: any, server: any) {
            server.createList(
                'comment', 6,
                'withReplies',
                'asAbuse',
                { node: registration, targetID: registration.id, targetType: 'registrations' },
            );
            server.createList(
                'comment', 3,
                'withReplies',
                { node: registration, targetID: registration.id, targetType: 'registrations' },
            );
        },
    }),
});
