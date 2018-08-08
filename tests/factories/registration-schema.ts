import FactoryGuy from 'ember-data-factory-guy';
import faker from 'faker';

FactoryGuy.define('registration-schema', {
    default: {
        name: () => faker.lorem.words(1),
        schemaVersion: () => faker.random.number(),
        schema: {},
    },
});
