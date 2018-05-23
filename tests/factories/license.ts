import FactoryGuy from 'ember-data-factory-guy';
import faker from 'faker';

FactoryGuy.define('license', {
    default: {
        name: () => faker.lorem.words(1),
        text: () => faker.lorem.words(15),
    },
});
