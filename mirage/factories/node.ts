import { capitalize } from '@ember/string';
import { Collection, Factory, faker, trait, Trait } from 'ember-cli-mirage';

import Identifier from 'ember-osf-web/models/identifier';
import License from 'ember-osf-web/models/license';
import Node from 'ember-osf-web/models/node';
import { Permission } from 'ember-osf-web/models/osf-model';
import RegistrationSchema from 'ember-osf-web/models/registration-schema';

import { guid, guidAfterCreate } from './utils';

export interface MirageNode extends Node {
    regionId: string | number;
    lastLogged: Date | string;
}

export interface NodeTraits {
    withContributors: Trait;
    withRegistrations: Trait;
    withDraftRegistrations: Trait;
    withDoi: Trait;
    withLicense: Trait;
}

export default Factory.extend<MirageNode & NodeTraits>({
    id: guid('node'),
    afterCreate: guidAfterCreate,

    category: faker.list.cycle(
        'project',
        'analysis',
        'communication',
        'data',
        'hypothesis',
        'instrumentation',
        'methods and measures',
        'procedure',
        'project',
        'software',
        'other',
    ),
    fork: false,
    currentUserIsContributor: false,
    preprint: false,
    description() {
        return faker.lorem.sentences(faker.random.number({ min: 0, max: 4 }));
    },
    currentUserPermissions: [],
    dateModified() {
        return faker.date.past(2, new Date(2018, 0, 0));
    },
    title() {
        return capitalize(faker.random.arrayElement([
            faker.company.bs,
            faker.company.catchPhrase,
            faker.hacker.noun,
            faker.lorem.word,
        ])());
    },
    collection: false,
    subjects: [],
    registration: false,
    dateCreated() {
        return faker.date.past(1, new Date(2015, 0, 0));
    },
    currentUserCanComment: true,
    nodeLicense: null,
    public: true,
    tags: faker.lorem.words(5).split(' '),

    withContributors: trait<MirageNode>({
        afterCreate(node, server) {
            const contributorCount = faker.random.number({ min: 1, max: 25 });
            if (contributorCount === 1) {
                server.create('contributor', { node, index: 0, permission: Permission.Admin, bibliographic: true });
            } else if (contributorCount === 2) {
                server.create('contributor', { node, index: 0, permission: Permission.Admin, bibliographic: true });
                server.create('contributor', { node, index: 1 });
            } else {
                for (let i = 0; i < contributorCount; i++) {
                    server.create('contributor', { node, index: i });
                }
            }
        },
    }),

    withRegistrations: trait<MirageNode>({
        afterCreate(node, server) {
            const registrationCount = faker.random.number({ min: 5, max: 15 });
            for (let i = 0; i < registrationCount; i++) {
                const registration = server.create('registration', {
                    registeredFrom: node,
                    category: node.category,
                    title: node.title,
                    registrationSchema: faker.random.arrayElement(
                        server.schema.registrationSchemas.all<RegistrationSchema>().models,
                    ),
                });
                node.contributors.models.forEach(contributor =>
                    server.create('contributor', { node: registration, users: contributor.users }));
            }
        },
    }),

    withDraftRegistrations: trait<MirageNode>({
        afterCreate(node, server) {
            const draftRegistrationCount = faker.random.number({ min: 5, max: 15 });
            server.createList('draft-registration', draftRegistrationCount, {
                branchedFrom: node,
                initiator: node.contributors.models[0].users,
                registrationSchema: faker.random.arrayElement(
                    server.schema.registrationSchemas.all<RegistrationSchema>().models,
                ),
            });
        },
    }),

    withDoi: trait<MirageNode>({
        afterCreate(node, server) {
            const identifier = server.create('identifier');
            // eslint-disable-next-line no-param-reassign
            node.identifiers = [identifier] as unknown as Collection<Identifier>;
            node.save();
        },
    }),

    withLicense: trait<MirageNode>({
        afterCreate(node, server) {
            const license = faker.random.arrayElement(server.schema.licenses.all<License>().models);
            node.license = license; // eslint-disable-line no-param-reassign
            node.save();
        },
    }),
});

declare module 'ember-cli-mirage/types/registries/model' {
    export default interface MirageModelRegistry {
        node: MirageNode;
    } // eslint-disable-line semi
}
