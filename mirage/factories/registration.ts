import { association, faker, trait, Trait } from 'ember-cli-mirage';

import Registration from 'ember-osf-web/models/registration';

import NodeFactory from './node';
import { createRegistrationMetadata, guid } from './utils';

interface RegistrationTraits {
    withRegisteredMeta: Trait;
}

export default NodeFactory.extend<Registration & RegistrationTraits>({
    id(i: number) {
        return guid(i, 'registration');
    },
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
    withdrawalJustification: 'faulty logic',
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
});
