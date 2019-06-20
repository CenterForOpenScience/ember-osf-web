import { capitalize } from '@ember/string';
import { Collection, Factory, faker, trait, Trait } from 'ember-cli-mirage';

import Identifier from 'ember-osf-web/models/identifier';
import Node from 'ember-osf-web/models/node';
import { Permission } from 'ember-osf-web/models/osf-model';

import { guid, guidAfterCreate } from './utils';

export interface MirageNode extends Node {
    affiliatedInstitutionIds: string[] | number[];
    regionId: string | number;
    lastLogged: Date | string;
    _anonymized: boolean;
}

export interface NodeTraits {
    anonymized: Trait;
    currentUserAdmin: Trait;
    withContributors: Trait;
    withRegistrations: Trait;
    withDraftRegistrations: Trait;
    withDoi: Trait;
    withLicense: Trait;
    withAffiliatedInstitutions: Trait;
    withManyAffiliatedInstitutions: Trait;
}

export default Factory.extend<MirageNode & NodeTraits>({
    id: guid('node'),
    afterCreate(newNode, server) {
        guidAfterCreate(newNode, server);
        if (!newNode.root && newNode.parent) {
            newNode.update({ root: newNode.parent.root || newNode.parent });
        }
    },

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
    _anonymized: false,

    withContributors: trait<MirageNode>({
        afterCreate(node, server) {
            const contributorCount = faker.random.number({ min: 1, max: 5 });
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
                        server.schema.registrationSchemas.all().models,
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
                    server.schema.registrationSchemas.all().models,
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
            const license = faker.random.arrayElement(server.schema.licenses.all().models);
            node.license = license; // eslint-disable-line no-param-reassign
            node.save();
        },
    }),

    withAffiliatedInstitutions: trait<MirageNode>({
        afterCreate(node, server) {
            const affiliatedInstitutionCount = faker.random.number({ min: 4, max: 5 });
            server.createList('institution', affiliatedInstitutionCount, {
                nodes: [node],
            });
        },
    }),

    withManyAffiliatedInstitutions: trait<MirageNode>({
        afterCreate(node, server) {
            server.createList('institution', 15, {
                nodes: [node],
            });
        },
    }),

    currentUserAdmin: trait<MirageNode>({
        currentUserPermissions: Object.values(Permission),
    }),

    anonymized: trait<MirageNode>({
        _anonymized: true,
    }),
});

declare module 'ember-cli-mirage/types/registries/model' {
    export default interface MirageModelRegistry {
        node: MirageNode;
    } // eslint-disable-line semi
}

declare module 'ember-cli-mirage/types/registries/schema' {
    export default interface MirageSchemaRegistry {
        nodes: MirageNode;
    } // eslint-disable-line semi
}
