import { association, faker, ModelInstance, trait, Trait } from 'ember-cli-mirage';

import Registration from 'ember-osf-web/models/registration';

import NodeFactory from './node';
import { createRegistrationMetadata, guid, guidAfterCreate } from './utils';

export interface RegistrationExtra {
    withComments: Trait;
    isPendingApproval: Trait;
    isArchiving: Trait;
    isEmbargoed: Trait;
    isPendingEmbargoApproval: Trait;
    isPendingWithdrawal: Trait;
    isWithdrawn: Trait;
    withArbitraryState: Trait;
    index: number;
}

const stateAttrs = {
    pendingApproval: {
        pendingRegistrationApproval: true,
        archiving: false,
    },
    archiving: {
        archiving: true,
        pendingRegistrationApproval: false,
    },
    embargoed: {
        pendingEmbargoApproval: false,
        embargoed: true,
        embargoEndDate: faker.date.future(),
    },
    pendingEmbargoApproval: {
        pendingEmbargoApproval: true,
        embargoed: false,
        embargoEndDate: null,
    },
    pendingWithdrawal: {
        withdrawn: false,
        pendingWithdrawal: true,
    },
    withdrawn: {
        withdrawn: true,
        pendingWithdrawal: false,
        dateWithdrawn: faker.date.recent(),
    },
    normal: {
        pendingRegistrationApproval: false,
        archiving: false,
        embargoed: false,
        embargoEndDate: null,
        pendingEmbargoApproval: false,
        withdrawn: false,
        pendingWithdrawal: false,
    },
};

export default NodeFactory.extend<Registration & RegistrationExtra>({
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

    index(i) {
        return i;
    },
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
    isPendingApproval: trait({
        ...stateAttrs.pendingApproval,
    }),
    isArchiving: trait({
        ...stateAttrs.archiving,
    }),
    isEmbargoed: trait({
        ...stateAttrs.embargoed,
    }),
    isPendingEmbargoApproval: trait({
        ...stateAttrs.pendingEmbargoApproval,
    }),
    isPendingWithdrawal: trait({
        ...stateAttrs.pendingWithdrawal,
    }),
    isWithdrawn: trait({
        ...stateAttrs.withdrawn,
    }),
    withArbitraryState: trait({
        afterCreate(registration: ModelInstance<Registration> & RegistrationExtra) {
            const arbitraryState =
                faker.list.cycle(...Object.keys(stateAttrs))(registration.index);
            const attrsToUse = stateAttrs[arbitraryState as keyof typeof stateAttrs];
            registration.update(attrsToUse);
        },
    }),
});
