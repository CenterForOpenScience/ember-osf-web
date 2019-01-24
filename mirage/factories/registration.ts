import { association, faker, trait, Trait } from 'ember-cli-mirage';

import Registration from 'ember-osf-web/models/registration';

import NodeFactory from './node';
import { createRegistrationMetadata, guid, guidAfterCreate } from './utils';

export interface RegistrationTraits {
    withComments: Trait;
}

export default NodeFactory.extend<Registration & RegistrationTraits>({
    id: guid('registration'),
    afterCreate(newReg, server) {
        guidAfterCreate(newReg, server);

        if (newReg.parent) {
            newReg.update({
                dateRegistered: newReg.parent.dateRegistered,
                pendingRegistrationApproval: newReg.parent.pendingRegistrationApproval,
                archiving: newReg.parent.archiving,
                embargoed: newReg.parent.embargoed,
                embargoEndDate: newReg.parent.embargoEndDate,
                pendingEmbargoApproval: newReg.parent.pendingEmbargoApproval,
                withdrawn: newReg.parent.withdrawn,
                pendingWithrawal: newReg.parent.pendingWithrawal,
                registrationSchema: newReg.parent.registrationSchema,
                registeredMeta: newReg.parent.registeredMeta,
            });
        } else if (!newReg.registeredMeta) {
            const registrationSchema = newReg.registrationSchema ||
                faker.random.arrayElement(server.schema.registrationSchemas.all().models) ||
                server.create('registrationSchema');
            newReg.update({
                registrationSchema,
                registeredMeta: createRegistrationMetadata(registrationSchema.schemaNoConflict, true),
            });
        }
    },

    dateRegistered() {
        return faker.date.recent(5);
    },
    registration: true,
    pendingRegistrationApproval: false,
    archiving: false,
    embargoed: false,
    embargoEndDate: null,
    pendingEmbargoApproval: false,
    withdrawn: false,
    pendingWithdrawal: false,

    registeredFrom: association(),

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
