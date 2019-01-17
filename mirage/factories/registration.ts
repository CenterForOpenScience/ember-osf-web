import { association, faker } from 'ember-cli-mirage';

import Registration from 'ember-osf-web/models/registration';

import NodeFactory from './node';
import { createRegistrationMetadata, guid, guidAfterCreate } from './utils';

export default NodeFactory.extend<Registration>({
    id: guid('registration'),
    afterCreate(newReg, server) {
        guidAfterCreate(newReg, server);
        if (newReg.registrationSchema) {
            newReg.update({
                registeredMeta: createRegistrationMetadata(newReg.registrationSchema.schemaNoConflict, true),
            });
        }
    },

    registration: true,
    dateRegistered() {
        return faker.date.recent(5);
    },
    pendingRegistrationApproval() {
        return false;
    },
    archiving() {
        return false;
    },
    embargoed() {
        return false;
    },
    embargoEndDate() {
        return null;
    },
    pendingEmbargoApproval() {
        return faker.random.boolean();
    },
    withdrawn() {
        return false;
    },
    pendingWithdrawal() {
        return false;
    },
    registrationSchema: association() as Registration['registrationSchema'],
});
