import { association, trait, Trait } from 'ember-cli-mirage';
import faker from 'faker';

import Registration, { RegistrationReviewStates } from 'ember-osf-web/models/registration';

import NodeFactory from './node';
import { createRegistrationMetadata, guid, guidAfterCreate } from './utils';

export interface MirageRegistration extends Registration {
    index: number;
    affiliatedInstitutionIds: Array<string|number>;
    draftRegistrationId: string;
    registrationSchemaId: string|number;
    registeredFromId: string|number;
    identifierIds: Array<string|number>;
    forkIds: Array<string|number>;
}

export interface RegistrationTraits {
    withComments: Trait;
    isArchiving: Trait;
    isPendingRegistrationApproval: Trait;
    isPendingEmbargoApproval: Trait;
    isPending: Trait;
    isEmbargo: Trait;
    isPendingEmbargoTermination: Trait;
    isPendingWithdrawRequest: Trait;
    isPendingWithdraw: Trait;
    isWithdrawn: Trait;
    withArbitraryState: Trait;
    withAffiliatedInstitutions: Trait;
    isPublic: Trait;
    withSubjects: Trait;
    withReviewActions: Trait;
    withSingleReviewAction: Trait;
}

const stateAttrs = {
    archiving: {
        archiving: true,
        pendingRegistrationApproval: false,
    },
    pendingRegistrationApproval: {
        pendingRegistrationApproval: true,
        archiving: false,
        reviewsState: RegistrationReviewStates.Initial,
    },
    pendingEmbargoApproval: {
        pendingEmbargoApproval: true,
        embargoed: false,
        embargoEndDate: null,
        reviewsState: RegistrationReviewStates.Initial,
    },
    pending: {
        reviewsState: RegistrationReviewStates.Pending,
    },
    embargo: {
        pendingEmbargoApproval: false,
        reviewsState: RegistrationReviewStates.Embargo,
        embargoEndDate() {
            return faker.date.future(1, new Date(2022, 0, 0));
        },
    },
    rejected: {
        reviewsState: RegistrationReviewStates.Rejected,
    },
    pendingEmbargoTermination: {
        pendingEmbargoTerminationApproval: true,
        reviewsState: RegistrationReviewStates.PendingEmbargoTermination,
        embargoed: true,
        embargoEndDate() {
            return faker.date.future(1, new Date(2022, 0, 0));
        },
    },
    pendingWithdrawRequest: {
        reviewsState: RegistrationReviewStates.PendingWithdrawRequest,
        withdrawn: false,
        pendingWithdrawal: false,
    },
    pendingWithdraw: {
        reviewsState: RegistrationReviewStates.PendingWithdraw,
        withdrawn: false,
        pendingWithdrawal: true,
    },
    withdrawn: {
        reviewsState: RegistrationReviewStates.Withdrawn,
        withdrawn: true,
        pendingWithdrawal: false,
        currentUserPermissions: [],
        dateWithdrawn() {
            return faker.date.past(1, new Date(2019, 0, 0));
        },
    },
    public: {
        reviewsState: RegistrationReviewStates.Accepted,
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
            if (!newReg.root) {
                newReg.update({ root: newReg.parent.root || newReg.parent });
            }
        } else if (!newReg.registeredMeta) {
            const registrationSchema = newReg.registrationSchema
                || faker.random.arrayElement(server.schema.registrationSchemas.all().models)
                || server.create('registration-schema');
            newReg.update({
                registrationSchema,
                registeredMeta: createRegistrationMetadata(registrationSchema, true),
            });
        }

        if (!newReg.provider) {
            newReg.update({
                provider: server.schema.registrationProviders.find('osf')
                    || server.create('registration-provider', {
                        id: 'osf',
                        shareSource: 'OSF Registries',
                        name: 'OSF Registries',
                    }),
            });
        }
    },

    dateRegistered() {
        return faker.date.past(1, new Date(2019, 0, 0));
    },

    iaUrl() {
        return faker.internet.url();
    },

    registration: true,
    pendingRegistrationApproval: false,
    archiving: false,
    embargoed: false,
    embargoEndDate: null,
    pendingEmbargoApproval: false,
    withdrawn: false,
    dateWithdrawn: null,
    articleDoi: null,
    pendingWithdrawal: false,
    pendingEmbargoTerminationApproval: false,
    registeredFrom: association(),
    registeredBy: association(),
    reviewsState: RegistrationReviewStates.Accepted,

    index(i: number) {
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
    isArchiving: trait<MirageRegistration>({
        ...stateAttrs.archiving,
    }),
    isPendingRegistrationApproval: trait<MirageRegistration>({
        ...stateAttrs.pendingRegistrationApproval,
    }),
    isPendingEmbargoApproval: trait<MirageRegistration>({
        ...stateAttrs.pendingEmbargoApproval,
    }),
    isPending: trait<MirageRegistration>({
        ...stateAttrs.pending,
    }),
    isEmbargo: trait<MirageRegistration>({
        ...stateAttrs.embargo,
    }),
    isPendingWithdrawRequest: trait<MirageRegistration>({
        ...stateAttrs.pendingWithdrawRequest,
    }),
    isPendingWithdraw: trait<MirageRegistration>({
        ...stateAttrs.pendingWithdraw,
    }),
    isPendingEmbargoTermination: trait<MirageRegistration>({
        ...stateAttrs.pendingEmbargoTermination,
    }),
    isWithdrawn: trait<MirageRegistration>({
        ...stateAttrs.withdrawn,
    }),
    isPublic: trait<MirageRegistration>({
        ...stateAttrs.public,
    }),
    withAffiliatedInstitutions: trait<MirageRegistration>({
        afterCreate(registration, server) {
            const affiliatedInstitutionCount = faker.random.number({ min: 4, max: 5 });
            server.createList('institution', affiliatedInstitutionCount, {
                registrations: [registration],
            });
        },
    }),
    withArbitraryState: trait<MirageRegistration>({
        afterCreate(registration) {
            const stateAttrsKeys = Object.keys(stateAttrs);
            const arbitraryState = stateAttrsKeys[registration.index % stateAttrsKeys.length];
            const attrsToUse = stateAttrs[arbitraryState as keyof typeof stateAttrs];
            registration.update(attrsToUse);
        },
    }),
    withSubjects: trait<MirageRegistration>({
        afterCreate(registration) {
            const providerSubjects = registration.provider.subjects.models;
            const subjectCount = faker.random.number({ min: 1, max: 6 });
            const subjects = [];
            for (let i = 0; i < subjectCount; i++) {
                subjects.push(faker.random.arrayElement(providerSubjects));
            }
            registration.update({ subjects });
        },
    }),
    withReviewActions: trait<MirageRegistration>({
        afterCreate(registration, server) {
            const reviewActions = server.createList('review-action', 3, { target: registration });
            registration.update({ reviewActions });
        },
    }),
    withSingleReviewAction: trait<MirageRegistration>({
        afterCreate(registration, server) {
            const reviewActions = server.createList('review-action', 1, { target: registration });
            registration.update({ reviewActions });
        },
    }),
});

declare module 'ember-cli-mirage/types/registries/model' {
    export default interface MirageModelRegistry {
        registration: MirageRegistration;
    } // eslint-disable-line semi
}

declare module 'ember-cli-mirage/types/registries/schema' {
    export default interface MirageSchemaRegistry {
        registrations: MirageRegistration;
    } // eslint-disable-line semi
}
