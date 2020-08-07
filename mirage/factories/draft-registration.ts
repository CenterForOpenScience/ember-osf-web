import { association, Factory, trait, Trait } from 'ember-cli-mirage';
import faker from 'faker';

import DraftRegistration from 'ember-osf-web/models/draft-registration';

import { NodeCategory, NodeLicense } from 'ember-osf-web/models/node';
import { Permission } from 'ember-osf-web/models/osf-model';

import { createRegistrationMetadata } from './utils';

export interface DraftRegistrationTraits {
    withRegistrationMetadata: Trait;
    withAffiliatedInstitutions: Trait;
    withSubjects: Trait;
    withContributors: Trait;
}

export default Factory.extend<DraftRegistration & DraftRegistrationTraits>({
    afterCreate(newDraft, server) {
        const draftProvider = newDraft.provider;
        if (!draftProvider) {
            const defaultProvider = server.schema.registrationProviders.find('osf')
                || server.create('registration-provider', {
                    id: 'osf',
                    shareSource: 'OSF',
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

    branchedFrom: association() as DraftRegistration['branchedFrom'],

    initiator: association() as DraftRegistration['initiator'],

    registrationSchema: association() as DraftRegistration['registrationSchema'],

    registrationMetadata: {},

    nodeLicense: { copyrightHolders: 'Fergie', year: '3008' } as NodeLicense,

    category: NodeCategory.Uncategorized,

    withRegistrationMetadata: trait<DraftRegistration>({
        afterCreate(draftRegistration) {
            draftRegistration.update({
                registrationMetadata: createRegistrationMetadata(draftRegistration.registrationSchema),
            });
        },
    }),

    withAffiliatedInstitutions: trait<DraftRegistration>({
        afterCreate(draft, server) {
            const affiliatedInstitutions = server.createList('institution', 3);
            draft.update({ affiliatedInstitutions });
        },
    }),

    withSubjects: trait<DraftRegistration>({
        afterCreate(draft, server) {
            const subjects = [server.create('subject', 'withChildren')];
            draft.update({ subjects });
        },
    }),

    withContributors: trait<DraftRegistration>({
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
});

declare module 'ember-cli-mirage/types/registries/schema' {
    export default interface MirageSchemaRegistry {
        draftRegistrations: DraftRegistration;
    } // eslint-disable-line semi
}
