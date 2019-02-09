import { association, faker, trait, Trait } from 'ember-cli-mirage';

import Registration from 'ember-osf-web/models/registration';

import NodeFactory from './node';
import { createRegistrationMetadata, guid, guidAfterCreate } from './utils';

export interface MirageRegistration extends Registration {
    index: number;
}

export interface RegistrationTraits {
    withComments: Trait;
    isPendingApproval: Trait;
    isArchiving: Trait;
    isEmbargoed: Trait;
    isPendingEmbargoApproval: Trait;
    isPendingWithdrawal: Trait;
    isWithdrawn: Trait;
    withArbitraryState: Trait;
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

export default NodeFactory.extend<MirageRegistration & RegistrationTraits>({
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
                pendingEmbargoTerminationApproval: newReg.pendingEmbargoTerminationApproval,
                withdrawn: newReg.parent.withdrawn,
                pendingWithrawal: newReg.parent.pendingWithdrawal,
                registrationSchema: newReg.parent.registrationSchema,
                registeredMeta: newReg.parent.registeredMeta,
            });
        } else if (!newReg.registeredMeta) {
            const registrationSchema = newReg.registrationSchema ||
                faker.random.arrayElement(server.schema.registrationSchemas.all().models) ||
                server.create('registration-schema');
            newReg.update({
                registrationSchema,
                registeredMeta: createRegistrationMetadata(registrationSchema, true),
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
    pendingEmbargoTerminationApproval: false,

    registeredFrom: association(),

    index(i) {
        return i;
    },
    withComments: trait<MirageRegistration>({
        afterCreate(registration, server) {
            server.createList(
                'comment', 6,
                { node: registration, targetID: registration.id, targetType: 'registrations' },
                'withReplies',
                'asAbuse',
            );
            server.createList(
                'comment', 3,
                { node: registration, targetID: registration.id, targetType: 'registrations' },
                'withReplies',
            );
        },
    }),
    isPendingApproval: trait<MirageRegistration>({
        ...stateAttrs.pendingApproval,
    }),
    isArchiving: trait<MirageRegistration>({
        ...stateAttrs.archiving,
    }),
    isEmbargoed: trait<MirageRegistration>({
        ...stateAttrs.embargoed,
    }),
    isPendingEmbargoApproval: trait<MirageRegistration>({
        ...stateAttrs.pendingEmbargoApproval,
    }),
    isPendingWithdrawal: trait<MirageRegistration>({
        ...stateAttrs.pendingWithdrawal,
    }),
    isWithdrawn: trait<MirageRegistration>({
        ...stateAttrs.withdrawn,
    }),
    withArbitraryState: trait<MirageRegistration>({
        afterCreate(registration) {
            const arbitraryState =
                faker.list.cycle(...Object.keys(stateAttrs))(registration.index);
            const attrsToUse = stateAttrs[arbitraryState as keyof typeof stateAttrs];
            registration.update(attrsToUse);
        },
    }),
});

declare module 'ember-cli-mirage/types/registries/model' {
    export default interface MirageModelRegistry {
        registration: MirageRegistration;
    } // eslint-disable-line semi
}
