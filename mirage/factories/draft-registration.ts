import { association, Factory, faker, trait, Trait } from 'ember-cli-mirage';

import DraftRegistration from 'ember-osf-web/models/draft-registration';

import { NodeCategory, NodeLicense } from 'ember-osf-web/models/node';

import { createRegistrationMetadata } from './utils';

export interface DraftRegistrationTraits {
    withRegistrationMetadata: Trait;
    withAffiliatedInstitutions: Trait;
    withSubjects: Trait;
}

export default Factory.extend<DraftRegistration & DraftRegistrationTraits>({
    afterCreate(newDraft, server) {
        const defaultProvider = server.schema.registrationProvider.find('osf') || server.create('registration-provider', { id: 'osf' });
        const draftProvider = newDraft.provider;
        if (defaultProvider && !defaultProvider) {
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
});

declare module 'ember-cli-mirage/types/registries/schema' {
    export default interface MirageSchemaRegistry {
        draftRegistrations: DraftRegistration;
    } // eslint-disable-line semi
}
