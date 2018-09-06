import { Factory, faker, trait } from 'ember-cli-mirage';
import { guid } from './utils';

export default Factory.extend({
    category() {
        faker.list.cycle([
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
        ]);
    },
    id(i) {
        return guid(i, 'node');
    },
    fork: false,
    currentUserIsContributor: false,
    preprint: false,
    description() {
        return faker.lorem.sentences(faker.random.number({ min: 0, max: 4 }));
    },
    currentUserPermissions: ['read'],
    dateModified() {
        return faker.date.recent(5);
    },
    accessRequests_enabled: true,
    title() {
        return faker.lorem.sentence().replace('.', '');
    },
    collection: false,
    subjects: [],
    registration: false,
    dateCreated() {
        return faker.date.past(5);
    },
    currentUserCanComment: true,
    node_license: null,
    public: true,
    tags: faker.lorem.words(5).split(' '),
    withContributors: trait({
        afterCreate(node, server) {
            const contributorCount = faker.random.number({ min: 1, max: 5 });
            if (contributorCount === 1) {
                server.create('contributor', { node, index: 0, permission: 'admin', bibliographic: true });
            } else if (contributorCount === 2) {
                server.create('contributor', { node, index: 0, permission: 'admin', bibliographic: true });
                server.create('contributor', { node, index: 1 });
            } else {
                for (let i = 0; i < contributorCount; i++) {
                    server.create('contributor', { node, index: i });
                }
            }
        },
    }),
});
