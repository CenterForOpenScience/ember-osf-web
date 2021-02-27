import { association, Factory, trait, Trait } from 'ember-cli-mirage';
import faker from 'faker';

import DraftRegistration from 'ember-osf-web/models/draft-registration';

import { NodeCategory, NodeLicense } from 'ember-osf-web/models/node';
import { Permission } from 'ember-osf-web/models/osf-model';

import { BranchedFromId } from 'ember-osf-web/mirage/serializers/draft-registration';
import { createRegistrationMetadata } from './utils';

export interface DraftRegistrationTraits {
    withRegistrationMetadata: Trait;
    withAffiliatedInstitutions: Trait;
    withSubjects: Trait;
    withContributors: Trait;
    currentUserIsAdmin: Trait;
    currentUserIsReadOnly: Trait;
    currentUserIsReadAndWrite: Trait;
}

export interface MirageDraftRegistration extends DraftRegistration {
    branchedFromId: BranchedFromId;
}

export default Factory.extend<MirageDraftRegistration & DraftRegistrationTraits>({
    afterCreate(newDraft, server) {
        const draftProvider = newDraft.provider;
        if (!draftProvider) {
            const defaultProvider = server.schema.registrationProviders.find('osf')
                || server.create('registration-provider', {
                    id: 'osf',
                    shareSource: 'OSF Registries',
                    name: 'OSF Registries',
                });
            newDraft.update({
                provider: defaultProvider,
            });
        }
    },

    registrationSupplement: 'abcdefghijklmnopqrstuvwxyz',

    title() {
        return faker.lorem.sentence();
    },

    description() {
        return faker.lorem.paragraph();
    },

    tags() {
        return Array.from({ length: 5 }, () => faker.lorem.word());
    },

    datetimeInitiated() {
        return faker.date.past(1, new Date(2015, 0, 0));
    },

    datetimeUpdated() {
        return faker.date.past(2, new Date(2018, 0, 0));
    },

    initiator: association() as MirageDraftRegistration['initiator'],

    registrationSchema: association() as MirageDraftRegistration['registrationSchema'],

    registrationMetadata: {},

    nodeLicense: { copyrightHolders: 'Fergie', year: '3008' } as NodeLicense,

    category: NodeCategory.Uncategorized,

    hasProject: true,

    withRegistrationMetadata: trait<MirageDraftRegistration>({
        afterCreate(draftRegistration) {
            draftRegistration.update({
                registrationMetadata: createRegistrationMetadata(draftRegistration.registrationSchema),
            });
        },
    }),

    withAffiliatedInstitutions: trait<MirageDraftRegistration>({
        afterCreate(draft, server) {
            const affiliatedInstitutions = server.createList('institution', 3);
            draft.update({ affiliatedInstitutions });
        },
    }),

    withSubjects: trait<MirageDraftRegistration>({
        afterCreate(draft, server) {
            const subjects = [server.create('subject', 'withChildren')];
            draft.update({ subjects });
        },
    }),

    withContributors: trait<MirageDraftRegistration>({
        afterCreate(draftRegistration, server) {
            const contributorCount = faker.random.number({ min: 1, max: 5 });
            if (contributorCount === 1) {
                server.create(
                    'contributor',
                    {
                        draftRegistration,
                        index: 0,
                        permission: Permission.Admin,
                        bibliographic: true,
                    },
                );
            } else if (contributorCount === 2) {
                server.create(
                    'contributor',
                    {
                        draftRegistration,
                        index: 0,
                        permission: Permission.Admin,
                        bibliographic: true,
                    },
                );
                server.create('contributor', { draftRegistration, index: 1 });
            } else {
                for (let i = 0; i < contributorCount; i++) {
                    server.create('contributor', { draftRegistration, index: i });
                }
            }
        },
    }),

    currentUserIsAdmin: trait<MirageDraftRegistration>({
        afterCreate(draftRegistration) {
            const currentUserPermissions = [Permission.Admin, Permission.Read, Permission.Write];
            draftRegistration.update({ currentUserPermissions });
        },
    }),

    currentUserIsReadOnly: trait<MirageDraftRegistration>({
        afterCreate(draftRegistration) {
            const currentUserPermissions = [Permission.Read];
            draftRegistration.update({ currentUserPermissions });
        },
    }),

    currentUserIsReadAndWrite: trait<MirageDraftRegistration>({
        afterCreate(draftRegistration) {
            const currentUserPermissions = [Permission.Read, Permission.Write];
            draftRegistration.update({ currentUserPermissions });
        },
    }),
});

declare module 'ember-cli-mirage/types/registries/model' {
    export default interface MirageModelRegistry {
        draftRegistration: MirageDraftRegistration;
    } // eslint-disable-line semi
}

declare module 'ember-cli-mirage/types/registries/schema' {
    export default interface MirageSchemaRegistry {
        draftRegistrations: MirageDraftRegistration;
    } // eslint-disable-line semi
}
