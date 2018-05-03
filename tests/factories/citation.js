import FactoryGuy from 'ember-data-factory-guy';
import faker from 'faker';

FactoryGuy.define('citation', {
    default: {
        citation: () => faker.lorem.words(10),
    },
});
