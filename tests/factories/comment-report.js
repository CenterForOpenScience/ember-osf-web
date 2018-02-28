import FactoryGuy from 'ember-data-factory-guy';
import faker from 'faker';

FactoryGuy.define('comment-report', {
    default: {
        category: () => faker.random.arrayElement(['hate', 'spam', 'violence']),
        text: FactoryGuy.belongsTo('comment'),
    },
});
