import FactoryGuy from 'ember-data-factory-guy';
import faker from 'faker';

FactoryGuy.define('contributor', {
    default: {
        bibliographic: () => faker.random.boolean(),
        permission: () => faker.random.arrayElement(['read', 'write', 'admin']),
        // nodeID: // TODO: Field not defined in serializer. Find out meaning and add to factory.
        users: FactoryGuy.belongsTo('user'),
        index: () => faker.random.number(),
        fullName: () => faker.lorem.words(2),
        email: () => faker.internet.email(),
        node: FactoryGuy.belongsTo('node'),
    },
});
