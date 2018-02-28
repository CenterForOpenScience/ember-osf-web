import FactoryGuy from 'ember-data-factory-guy';
import faker from 'faker';

FactoryGuy.define('taxonomy', {
    default: {
        text: () => faker.lorem.words(2),
        child_count: () => faker.random.number(),
        parents: null,
    },
    traits: {
        hasParents: {
            parents: () => [String(faker.random.number())],
        },
    },
});
