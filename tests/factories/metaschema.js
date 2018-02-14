import FactoryGuy from 'ember-data-factory-guy';
import faker from 'faker';

FactoryGuy.define('metaschema', {
    default: {
        name: () => faker.lorem.words(1),
        schemaVersion: () => faker.random.number(),
        schema: {},
    },
});
